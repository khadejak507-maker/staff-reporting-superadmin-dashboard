import { baseApi } from "../../api/baseApi";

const SeetingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAboutData: builder.query({
      query: () => ({
        url: "/company/get-about-us",
        method: "GET",
      }),
      providesTags: ["aboutData"],
    }),
    updateABoutData: builder.mutation({
      query: (data) => ({
        url: "/company/update-about-us",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["aboutData"],
    }),

    getAllPrivacyData: builder.query({
      query: () => ({
        url: "/company/get-privacy-policy",
        method: "GET",
      }),
      providesTags: ["privacyData"],
    }),
    updatePrivacyData: builder.mutation({
      query: (data) => ({
        url: "/company/update-privacy-policy",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["privacyData"],
    }),

    getAllTermsData: builder.query({
      query: () => ({
        url: "/company/get-terms-and-conditions",
        method: "GET",
      }),
      providesTags: ["termsData"],
    }),
    updateTermsData: builder.mutation({
      query: (data) => ({
        url: "/company/update-terms-and-conditions",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["termsData"],
    }),

    getAllContactData: builder.query({
      query: () => ({
        url: "/company/get-contact-us",
        method: "GET",
      }),
      providesTags: ["termsData"],
    }),
    updateContactData: builder.mutation({
      query: (data) => ({
        url: "/company/update-contact-us",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["termsData"],
    }),

    createLogoAndColor: builder.mutation({
      query: (data) => ({
        url: "/company/create-company-logo-color",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["logo-color"],
    }),
    getLogoAndColor: builder.query({
      query: () => ({
        url: "/company/get-company-logo-color",
        method: "GET",
      }),
      providesTags: ["logo-color"],
    }),
  }),
});

export const {
  useGetAllAboutDataQuery,
  useUpdateABoutDataMutation,
  useGetAllPrivacyDataQuery,
  useUpdatePrivacyDataMutation,
  useGetAllTermsDataQuery,
  useUpdateTermsDataMutation,
  useGetAllContactDataQuery,
  useUpdateContactDataMutation,
  useCreateLogoAndColorMutation,
  useGetLogoAndColorQuery,
} = SeetingsApi;
