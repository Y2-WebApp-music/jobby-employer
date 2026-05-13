import apiService from "./apiService";
import type {
  UtilityDistrictsByProvinceResponse,
  UtilityPostalCodesBySubDistrictResponse,
  UtilityProvincesResponse,
  UtilitySubDistrictsByDistrictResponse,
} from "@/types/utilityTypes";

export type {
  UtilityCountryRef,
  UtilityDistrictItem,
  UtilityDistrictsByProvinceResponse,
  UtilityPostalCodeItem,
  UtilityPostalCodesBySubDistrictResponse,
  UtilityProvinceItem,
  UtilityProvinceRef,
  UtilityProvincesResponse,
  UtilitySubDistrictItem,
  UtilitySubDistrictsByDistrictResponse,
} from "@/types/utilityTypes";

// get {{bff-service}}/utility/province
export const apiGetUtilityProvinces = () => {
  return apiService.fetchData<UtilityProvincesResponse>({
    url: "/utility/province",
    method: "get",
  });
};

// get {{bff-service}}/utility/district/:province_code
export const apiGetUtilityDistrictsByProvinceCode = (
  provinceCode: number | string,
) => {
  return apiService.fetchData<UtilityDistrictsByProvinceResponse>({
    url: `/utility/district/${provinceCode}`,
    method: "get",
  });
};

// get {{bff-service}}/utility/sub-district/:district_code
export const apiGetUtilitySubDistrictsByDistrictCode = (
  districtCode: number | string,
) => {
  return apiService.fetchData<UtilitySubDistrictsByDistrictResponse>({
    url: `/utility/sub-district/${districtCode}`,
    method: "get",
  });
};

// get {{bff-service}}/utility/postal-code/:sub_district_code
export const apiGetUtilityPostalCodesBySubDistrictCode = (
  subDistrictCode: number | string,
) => {
  return apiService.fetchData<UtilityPostalCodesBySubDistrictResponse>({
    url: `/utility/postal-code/${subDistrictCode}`,
    method: "get",
  });
};
