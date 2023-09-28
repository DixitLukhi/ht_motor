import { PROFILE } from "../../api/constApi";
import { imageHeader } from "./authHeader";
import { apiInstance } from "./axiosApi";

export const profile = (payload) => {
  return apiInstance.post(PROFILE, payload, { headers: imageHeader() });
};