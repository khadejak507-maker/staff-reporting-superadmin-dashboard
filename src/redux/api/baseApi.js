/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { message } from "antd";
import { BASE_URL } from "../utils/utils";

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    // const token = getState().auth.token;
    const token = localStorage.getItem("token");
    // console.log(token);
    if (token) {
      // headers.set("authorization", ` ${token}`);
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const apiErrorMessage = (error) => {
  const d = error?.data;
  if (typeof d === "string") return d;
  if (d && typeof d === "object" && d.message != null) return String(d.message);
  if (typeof error?.error === "string") return error.error;
  return "Something went wrong";
};

const COMPANY_LOGO_COLOR_PATH = "get-company-logo-color";

const baseQueryWithRefreshToken = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const status = result?.error?.status;
  const requestUrl =
    typeof args === "string" ? args : String(args?.url ?? "");
  const skipToast =
    status === 404 && requestUrl.includes(COMPANY_LOGO_COLOR_PATH);

  if (
    !skipToast &&
    (status === 400 ||
      status === 401 ||
      status === 403 ||
      status === 404 ||
      status === 409 ||
      status === 500)
  ) {
    message.error(apiErrorMessage(result.error));
  }
  // unauthorized
  //   if (result?.error?.status === 401) {
  //     const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
  //       method: "POST",
  //       body: JSON.stringify({
  //         refreshToken: api.getState().auth.refreshToken,
  //       }),
  //     });
  //     const data = await res.json();
  //     console.log(data);
  //     if (data?.accessToken) {
  //       localStorage.setItem("token", data?.accessToken);
  //       result = await baseQuery(args, api, extraOptions);
  //     } else {
  //       api.dispatch(logOut());
  //     }
  //   }
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  // baseQuery: fetchBaseQuery({
  //     baseUrl: `${BASE_URL}/v1`,
  // }),
  endpoints: () => ({}),
});
