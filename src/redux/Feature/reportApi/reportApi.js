import { baseApi } from "../../api/baseApi";

const ReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDailyReports: builder.query({
      query: ({ page, limit, search }) => ({
        url: `/daily-report/get-all-daily-report-by-admin?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["reports"],
    }),
    getWeklyReport: builder.query({
      query: () => ({
        url: `/daily-report/get-all-daily-report-by-admin?week=true`,
        method: "GET",
      }),
      providesTags: ["reports"],
    }),

    updateExpenceStatus: builder.mutation({
      query: ({ _id, status }) => ({
        url: `/daily-report/update-daily-report/${_id}`,
        method: "PATCH",
        body: { status },
      }),
    }),
  }),
});

export const {
  useGetDailyReportsQuery,
  useGetWeklyReportQuery,
  useUpdateExpenceStatusMutation
} = ReportApi;
