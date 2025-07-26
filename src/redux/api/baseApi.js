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

const baseQueryWithRefreshToken = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  // internal server error
  if (result?.error?.status === 500) {
    message.error(result.error.data.message);
  }
  // page not found
  if (result?.error?.status === 404) {
    message.error(result.error.data.message);
  }
  // forbidden
  if (result?.error?.status === 403) {
    message.error(result.error.data.message);
  }
  // bad request
  if (result?.error?.status === 400) {
    message.error(result.error.data.message);
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
