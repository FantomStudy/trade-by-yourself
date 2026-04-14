import { ofetch } from "ofetch";

export interface CityByIpResponse {
  city: string;
  region?: string;
}

export const getCityByIp = async (): Promise<CityByIpResponse> => {
  const response = await ofetch("http://ip-api.com/json/?lang=ru&fields=city,regionName");

  return {
    city: response.city || "",
    region: response.regionName || "",
  };
};
