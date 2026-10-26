"use client";

import L from "leaflet";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

import { Input } from "@/components/ui";
import { getAddressSuggestions, validateAddress } from "@/lib/api/requests/address";

import "leaflet/dist/leaflet.css";

// Исправляем проблему с иконками маркеров в Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface AddressSuggestion {
  lat?: string | number | null;
  lon?: string | number | null;
  value: string;
}

interface AddressMapProps {
  value?: string;
  onChange?: (address: string) => void;
  onCoordinatesChange?: (lat: number, lng: number) => void;
}

// Компонент для центрирования карты при смене позиции
function MapRecenter({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, Math.max(map.getZoom(), 14), { animate: true });
    }
  }, [center, map]);
  return null;
}

// Компонент для обработки кликов по карте
function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const AddressMap = ({ value = "", onChange, onCoordinatesChange }: AddressMapProps) => {
  // Координаты Оренбурга
  const ORENBURG_CENTER: [number, number] = [51.7687, 55.0963];

  const [address, setAddress] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [_locationPermission, setLocationPermission] = useState<PermissionState | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Функция для получения текущей геолокации пользователя
  const getCurrentLocation = async () => {
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
      console.log("Получены координаты:", latitude, longitude);

      // Устанавливаем маркер на карте
      setMarkerPosition([latitude, longitude]);
      onCoordinatesChange?.(latitude, longitude);

      // Получаем адрес по координатам
      await getAddressFromCoordinates(latitude, longitude);
    } catch (error: any) {
      console.error("Ошибка получения геолокации:", error);

      if (error.code === error.PERMISSION_DENIED) {
        setLocationPermission("denied");
        console.log("Пользователь запретил доступ к геолокации");
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        console.log("Информация о местоположении недоступна");
      } else if (error.code === error.TIMEOUT) {
        console.log("Превышено время ожидания получения геолокации");
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const lastGeocodedAddressRef = useRef<string>("");

  // Надежная функция геокодирования адреса в координаты [lat, lng]
  const geocodeAddress = async (rawAddress: string): Promise<[number, number] | null> => {
    if (!rawAddress || !rawAddress.trim()) return null;
    const cleanStr = rawAddress.trim();

    // 1. Пробуем DaData suggestions
    try {
      const data = await getAddressSuggestions(cleanStr);
      if (data && data.length > 0 && data[0].lat != null && data[0].lon != null) {
        const lat = Number.parseFloat(String(data[0].lat));
        const lng = Number.parseFloat(String(data[0].lon));
        if (!isNaN(lat) && !isNaN(lng)) {
          return [lat, lng];
        }
      }
    } catch (e) {
      console.warn("DaData geocoding skipped:", e);
    }

    // 2. Многоступенчатый поиск через OpenStreetMap Nominatim с очисткой
    const queriesToTry: string[] = [];

    // Вариант 1: Исходная строка
    queriesToTry.push(cleanStr);

    // Вариант 2: Очистка от служебных префиксов DaData/КЛАДР
    const stripped = cleanStr
      .replace(/Россия,?\s*/gi, "")
      .replace(/\b\d{6}\b,?\s*/g, "") // почтовые индексы
      .replace(/\b(обл|область|край|респ|республика)\.?\s*/gi, "")
      .replace(/\b(г|город|п|поселок|посёлок|с|село|дер|деревня|пгт)\.?\s+/gi, "")
      .replace(/\b(ул|улица|пр-кт|проспект|пер|переулок|проезд|б-р|бульвар|тракт|наб|набережная|ш|шоссе)\.?\s+/gi, "")
      .replace(/\b(д|дом|корп|корпус|строение|стр|кв|квартира)\.?\s*/gi, "")
      .replace(/[,;]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (stripped && stripped !== cleanStr) {
      queriesToTry.push(stripped);
    }

    // Вариант 3: Город + улица + номер
    const parts = cleanStr.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      const filteredParts = parts
        .filter((p) => !/россия|индекс|\d{6}|обл|район|край/i.test(p))
        .map((p) => p.replace(/\b(г|ул|д|дом)\.?\s*/gi, "").trim())
        .filter(Boolean);
      if (filteredParts.length > 0) {
        queriesToTry.push(filteredParts.join(" "));
      }
    }

    for (const q of queriesToTry) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          },
        );
        clearTimeout(timeoutId);

        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0 && list[0].lat && list[0].lon) {
            const lat = Number.parseFloat(list[0].lat);
            const lng = Number.parseFloat(list[0].lon);
            if (!isNaN(lat) && !isNaN(lng)) {
              return [lat, lng];
            }
          }
        }
      } catch {
        // пробуем следующий вариант
      }
    }

    return null;
  };

  // Синхронизация с внешним значением value и геокодирование адреса
  useEffect(() => {
    if (!value || !value.trim()) return;

    if (value !== address) {
      setAddress(value);
    }

    if (lastGeocodedAddressRef.current !== value) {
      lastGeocodedAddressRef.current = value;
      (async () => {
        const coords = await geocodeAddress(value);
        if (coords) {
          setMarkerPosition(coords);
          onCoordinatesChange?.(coords[0], coords[1]);
        }
      })();
    }
  }, [value]);

  // Проверяем разрешения на геолокацию и автоматически определяем местоположение при монтировании
  useEffect(() => {
    const initializeLocation = async () => {
      // Если адрес уже передан (например, редактирование), не перезаписываем его по GPS
      if (value) {
        return;
      }

      if ("permissions" in navigator) {
        try {
          const result = await navigator.permissions.query({
            name: "geolocation",
          });
          setLocationPermission(result.state);
          console.log("Статус разрешения геолокации:", result.state);

          result.onchange = () => {
            setLocationPermission(result.state);
          };

          if (result.state === "granted") {
            await getCurrentLocation();
          }
        } catch {
          // Игнорируем ошибку permissions API
        }
      }
    };

    initializeLocation();
  }, [value]);

  // Функция для получения адреса по координатам (обратное геокодирование)
  const getAddressFromCoordinates = async (lat: number, lng: number) => {
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
  };

  // Функция для поиска адресов (автодополнение)
  const searchAddresses = async (query: string) => {
    console.log("Starting searchAddresses with query:", query);

    if (!query.trim() || query.length < 2) {
      console.log("Query too short, clearing suggestions");
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setIsLoadingSuggestions(true);
      console.log("Loading suggestions set to true");

      const data = await getAddressSuggestions(query);
      console.log("API response:", data);

      if (!Array.isArray(data) || data.length === 0) {
        console.log("No suggestions received");
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      console.log("Received suggestions:", data);
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Ошибка при поиске адресов:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoadingSuggestions(false);
      console.log("Loading suggestions set to false");
    }
  };

  // Обработка изменения текста в поле адреса
  const handleAddressChange = (newAddress: string) => {
    console.log("Address changed to:", newAddress);
    setAddress(newAddress);
    onChange?.(newAddress);
    setValidationError(null); // Сбрасываем ошибку валидации при изменении

    // Если поле очистили, скрываем подсказки
    if (!newAddress.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      return;
    }

    // Дебаунс для поиска адресов
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      console.log("Debounced search starting for:", newAddress);
      searchAddresses(newAddress);
    }, 300);
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
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Поле ввода адреса с автодополнением */}
      <div ref={suggestionsRef} className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              className="pr-10"
              value={address}
              onChange={(e) => handleAddressChange(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              placeholder="Введите адрес для поиска"
            />
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              {isLoadingSuggestions || isLoadingAddress || isLoadingLocation ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
              ) : (
                <Search className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Список подсказок */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
            {suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.value}-${index}`}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={async () => {
                  setAddress(suggestion.value);
                  onChange?.(suggestion.value);
                  setShowSuggestions(false);

                  lastGeocodedAddressRef.current = suggestion.value;
                  const coords = await geocodeAddress(suggestion.value);
                  if (coords) {
                    setMarkerPosition(coords);
                    onCoordinatesChange?.(coords[0], coords[1]);
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
                    }
                  } catch (error: any) {
                    const msg =
                      error?.data?.message ||
                      "Указанный адрес не найден. Пожалуйста, выберите адрес из предложенных вариантов.";
                    setValidationError(msg);
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
      {validationError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{validationError}</div>
      )}

      {/* Карта */}
      <div className="h-80 w-full overflow-hidden rounded-lg border border-gray-200">
        <MapContainer
          center={markerPosition || ORENBURG_CENTER}
          className="z-0 [&_.leaflet-control-attribution]:hidden"
          style={{ height: "100%", width: "100%" }}
          zoom={12}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Центрирование карты при изменении markerPosition */}
          <MapRecenter center={markerPosition} />

          {/* Обработчик кликов по карте */}
          <MapClickHandler onLocationSelect={handleMapClick} />

          {/* Маркер на выбранной позиции */}
          {markerPosition && <Marker position={markerPosition} />}
        </MapContainer>
      </div>

      <p className="text-sm text-gray-500">Кликните на карту, чтобы выбрать местоположение</p>
    </div>
  );
};
