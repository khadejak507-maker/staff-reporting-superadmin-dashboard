import { baseApi } from "../../api/baseApi";

const OfficeTimeAndNoticeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    craeteOfficeTime: builder.mutation({
      query: (data) => ({
        url: `/office-time/create-office-time`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["office-noticeF"],
    }),
    createOfficeNotice: builder.mutation({
      query: (data) => ({
        url: "/office/office-notice",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["office-notice"],
    }),
  }),
});

export const { useCraeteOfficeTimeMutation, useCreateOfficeNoticeMutation } =
  OfficeTimeAndNoticeApi;
