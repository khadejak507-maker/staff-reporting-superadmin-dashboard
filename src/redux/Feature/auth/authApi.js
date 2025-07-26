import { baseApi } from "../../api/baseApi";

const AuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (credential) => ({
        url: "/user/register",
        method: "POST",
        body: credential,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/user/signin",
        method: "POST",
        body: credentials,
      }),
    }),
    forgatePassword: builder.mutation({
      query: (credentials) => ({
        url: "/user/forget-password",
        method: "POST",
        body: credentials,
      }),
    }),
    verifyPassword: builder.mutation({
      query: (credentials) => ({
        url: "/user/verify-code",
        method: "POST",
        body: credentials,
      }),
    }),
    resendOtp: builder.mutation({
      query: (credentials) => ({
        url: "/user/verify-code",
        method: "POST",
        body: credentials,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ body, token }) => ({
        url: "/user/set-new-password",
        method: "POST",
        body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    getProfile: builder.query({
      query: () => ({
        url: "/user/get-my-profile",
        method: "GET",
      }),
      providesTags: ["profile"],
    }),

    updateProfile: builder.mutation({
      query: ({ data }) => ({
        url: "/user/update-my-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["profile"],
    }),
  }),
});

export const {
  useSignUpMutation,
  useLoginMutation,
  useForgatePasswordMutation,
  useVerifyPasswordMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation
} = AuthApi;
