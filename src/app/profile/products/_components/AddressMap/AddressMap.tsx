"use client";

import L from "leaflet";
import { Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { getAddressSuggestions, validateAddress } from "@/api/address";
import { Input } from "@/components/ui/Input";
import { DEBOUNCE_TIMEOUT, ORENBURG_CENTER } from "./constants";
import styles from "./AddressMap.module.css";
import "leaflet/dist/leaflet.css";

// Исправляем проблему с иконками маркеров в Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface AddressSuggestion {
  lat?: string;
  lon?: string;
  value: string;
}

interface AddressMapProps {
  value?: string;
  onChange?: (address: string) => void;
  onCoordinatesChange?: (lat: number, lng: number) => void;
}

interface MapClickHandlerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

// Компонент для обработки кликов по карте
function MapClickHandler({ onLocationSelect }: MapClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export const AddressMap = ({ value = "", onChange, onCoordinatesChange }: AddressMapProps) => {
  const [address, setAddress] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [_locationPermission, setLocationPermission] = useState<PermissionState | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Функция для получения адреса по координатам (обратное геокодирование)
  const getAddressFromCoordinates = useCallback(
    async (lat: number, lng: number) => {
      try {
        setIsLoadingAddress(true);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ru&addressdetails=1`,
        );

        const data = await response.json();

        if (data && data.display_name) {
          const formattedAddress = data.display_name;
          setAddress(formattedAddress);
          onChange?.(formattedAddress);
        }
      } catch (error) {
        console.error("Ошибка при получении адреса:", error);
      } finally {
        setIsLoadingAddress(false);
      }
    },
    [onChange],
  );

  // Функция для получения текущей геолокации пользователя
  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      console.error("Геолокация не поддерживается браузером");
      return;
    }

    try {
      setIsLoadingLocation(true);

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 минут
        });
      });

      const { latitude, longitude } = position.coords;

      // Устанавливаем маркер на карте
      setMarkerPosition([latitude, longitude]);
      onCoordinatesChange?.(latitude, longitude);

      // Получаем адрес по координатам
      await getAddressFromCoordinates(latitude, longitude);
    } catch (error: any) {
      if (error.code === error.PERMISSION_DENIED) {
        setLocationPermission("denied");
        console.log("Пользователь запретил доступ к геолокации");
      } else {
        console.error("Ошибка получения геолокации:", error);
      }
    } finally {
      setIsLoadingLocation(false);
    }
  }, [getAddressFromCoordinates, onCoordinatesChange]);

  // Проверяем разрешения на геолокацию и автоматически определяем местоположение при монтировании
  useEffect(() => {
    const initializeLocation = async () => {
      if ("permissions" in navigator) {
        const result = await navigator.permissions.query({
          name: "geolocation",
        });
        setLocationPermission(result.state);

        result.onchange = () => {
          setLocationPermission(result.state);
        };

        // Автоматически определяем местоположение если разрешение есть или не установлено
        if (result.state === "granted" || result.state === "prompt") {
          await getCurrentLocation();
        }
      } else {
        // Если API разрешений не поддерживается, пробуем сразу получить геолокацию
        await getCurrentLocation();
      }
    };

    initializeLocation();
  }, [getCurrentLocation]);

  // Функция для поиска адресов (автодополнение)
  const searchAddresses = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setIsLoadingSuggestions(true);

      const data = await getAddressSuggestions(query);

      if (!Array.isArray(data) || data.length === 0) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Ошибка при поиске адресов:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  // Обработка изменения текста в поле адреса
  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    onChange?.(newAddress);
    setValidationError(null); // Сбрасываем ошибку валидации при изменении

    // Дебаунс для поиска адресов
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

    // Если поле очистили, скрываем подсказки
    if (!newAddress.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceTimeoutRef.current = setTimeout(() => {
      searchAddresses(newAddress);
    }, DEBOUNCE_TIMEOUT);
  };

  // Обработка клика по карте
  const handleMapClick = (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
    onCoordinatesChange?.(lat, lng);
    getAddressFromCoordinates(lat, lng);
  };

  // Закрытие списка предложений при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node))
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  return (
    <div className={styles.addressMap}>
      {/* Поле ввода адреса с автодополнением */}
      <div ref={suggestionsRef} className={styles.inputDropdown}>
        <div className={styles.inputContainer}>
          <div className={styles.inputGroup}>
            <Input
              className={styles.input}
              value={address}
              onChange={(e) => handleAddressChange(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              placeholder="Введите адрес для поиска"
            />
            <div className={styles.inputIconWrapper}>
              {isLoadingSuggestions || isLoadingAddress || isLoadingLocation ? (
                <div className={styles.spinnerIcon} />
              ) : (
                <Search className={styles.searchIcon} />
              )}
            </div>
          </div>
        </div>

        {/* Список подсказок */}
        {showSuggestions && suggestions.length > 0 && (
          <div className={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.value}-${index}`}
                className={styles.suggestion}
                onClick={async () => {
                  setAddress(suggestion.value);
                  onChange?.(suggestion.value);
                  setShowSuggestions(false);

                  // Используем координаты из API suggestions
                  if (suggestion.lat && suggestion.lon) {
                    const lat = Number.parseFloat(suggestion.lat);
                    const lng = Number.parseFloat(suggestion.lon);
                    setMarkerPosition([lat, lng]);
                    onCoordinatesChange?.(lat, lng);
                  }

                  // Валидация адреса после установки координат
                  try {
                    setValidationError(null);
                    const validationResult = await validateAddress({
                      address: suggestion.value,
                      addressDetails: {},
                    });

                    if (!validationResult.valid) {
                      setValidationError(validationResult.message || "Адрес не прошел валидацию");
                      console.warn("Невалидный адрес:", validationResult.message);
                    }
                  } catch (error) {
                    console.error("Ошибка при валидации адреса:", error);
                    setValidationError(
                      "Указанный адрес не найден. Пожалуйста, выберите адрес из предложенных вариантов.",
                    );
                  }
                }}
              >
                {suggestion.value}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ошибка валидации */}
      {validationError && <div className={styles.validationError}>{validationError}</div>}

      {/* Карта */}
      <div className={styles.map}>
        <MapContainer center={ORENBURG_CENTER} className={styles.mapContainer} zoom={12}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Обработчик кликов по карте */}
          <MapClickHandler onLocationSelect={handleMapClick} />

          {/* Маркер на выбранной позиции */}
          {markerPosition && <Marker position={markerPosition} />}
        </MapContainer>
      </div>
    </div>
  );
};
