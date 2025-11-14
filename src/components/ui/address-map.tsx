"use client";

import L from "leaflet";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

import { Input } from "@/components/ui";

import "leaflet/dist/leaflet.css";

// Исправляем проблему с иконками маркеров в Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

interface AddressMapProps {
  value?: string;
  onChange?: (address: string) => void;
  onCoordinatesChange?: (lat: number, lng: number) => void;
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

export const AddressMap = ({
  value = "",
  onChange,
  onCoordinatesChange,
}: AddressMapProps) => {
  // Координаты Оренбурга
  const ORENBURG_CENTER: [number, number] = [51.7687, 55.0963];

  const [address, setAddress] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null,
  );
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [_locationPermission, setLocationPermission] =
    useState<PermissionState | null>(null);

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

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 минут
          });
        },
      );

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

  // Проверяем разрешения на геолокацию и автоматически определяем местоположение при монтировании
  useEffect(() => {
    const initializeLocation = async () => {
      if ("permissions" in navigator) {
        const result = await navigator.permissions.query({
          name: "geolocation",
        });
        setLocationPermission(result.state);
        console.log("Статус разрешения геолокации:", result.state);

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

      // Упрощенный подход - один запрос с несколькими вариантами
      const baseQuery = `${query}, Оренбург`;

      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        baseQuery,
      )}&limit=15&accept-language=ru&addressdetails=1&countrycodes=ru`;

      console.log("Fetching URL:", url);
      const response = await fetch(url);
      console.log("Response status:", response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw API response:", data);

      if (!Array.isArray(data)) {
        console.log("Data is not an array:", typeof data);
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      // Простая фильтрация
      const filteredResults = data
        .filter(
          (item) =>
            item && item.display_name && item.lat && item.lon && item.place_id,
        )
        .slice(0, 8);

      console.log("Filtered results:", filteredResults);
      setSuggestions(filteredResults);
      setShowSuggestions(filteredResults.length > 0);
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

  // Обработка выбора адреса из списка предложений
  const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
    const lat = Number.parseFloat(suggestion.lat);
    const lng = Number.parseFloat(suggestion.lon);

    setAddress(suggestion.display_name);
    onChange?.(suggestion.display_name);
    setMarkerPosition([lat, lng]);
    onCoordinatesChange?.(lat, lng);
    setShowSuggestions(false);
    setSuggestions([]);
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
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
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
              className="bg-white pr-10"
              value={address}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder={
                isLoadingLocation
                  ? "Определяем ваше местоположение..."
                  : "Введите адрес или выберите на карте"
              }
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

        {/* Список предложений адресов */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                type="button"
                className="w-full px-4 py-2 text-left text-sm first:rounded-t-md last:rounded-b-md hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                {suggestion.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Карта */}
      <div className="h-80 w-full overflow-hidden rounded-lg border border-gray-200">
        <MapContainer
          center={ORENBURG_CENTER}
          className="z-0 [&_.leaflet-control-attribution]:hidden"
          style={{ height: "100%", width: "100%" }}
          zoom={12}
        >
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

      <p className="text-sm text-gray-500">
        Кликните на карту, чтобы выбрать точное местоположение, или введите
        адрес в поле выше
      </p>
    </div>
  );
};
