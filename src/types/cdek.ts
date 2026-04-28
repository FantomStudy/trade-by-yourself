export interface CdekCity {
  code: number;
  city?: string;
  city_uuid?: string;
  region?: string;
}

export interface CdekPvz {
  code: string;
  name?: string;
  location?: {
    address?: string;
    city?: string;
    city_code?: number;
  };
  work_time?: string;
}

export interface CdekCalculateRequest {
  tariffCode: number;
  fromCityCode?: number;
  toCityCode: number;
  weight: number;
  length: number;
  width: number;
  height: number;
}

export interface CdekCalculateResponse {
  delivery_sum?: number;
  total_sum?: number;
  period_min?: number;
  period_max?: number;
  tariff_code?: number;
  tariff_name?: string;
}
