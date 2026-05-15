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

export interface CdekTariffsRequest {
  fromCityCode: number;
  toCityCode: number;
  weight: number;
  length: number;
  width: number;
  height: number;
}

export interface CdekTariffItem {
  tariffCode: number;
  tariffName: string;
  fromDoor?: boolean | number;
  toDoor?: boolean | number;
  deliveryMode?: number;
  periodMin?: number;
  periodMax?: number;
  totalSum?: number;
  tariff_code?: number;
  tariff_name?: string;
  period_min?: number;
  period_max?: number;
  total_sum?: number;
}
