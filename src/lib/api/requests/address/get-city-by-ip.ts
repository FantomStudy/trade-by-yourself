export interface CityByIpResponse {
  city: string;
  region?: string;
}

export const getCityByIp = async (): Promise<CityByIpResponse> => {
  // Используем бесплатный сервис ip-api.com для определения города
  const response = await fetch(
    "http://ip-api.com/json/?lang=ru&fields=city,regionName",
  );

  if (!response.ok) {
    throw new Error("Не удалось определить город");
  }

  const data = await response.json();

  return {
    city: data.city || "",
    region: data.regionName || "",
  };
};
