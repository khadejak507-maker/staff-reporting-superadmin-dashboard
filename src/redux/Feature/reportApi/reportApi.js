import { baseApi } from "../../api/baseApi";

// Build a query string from a params object, skipping empty values.
const buildQuery = (params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      qs.append(key, value);
    }
  });
  const str = qs.toString();
  return str ? `?${str}` : "";
};

const ReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Unified report query. Accepts: period (week/month booleans handled by
    // caller), date, dateFrom, dateTo, clientId, jobId, search.
    getReports: builder.query({
      query: (params = {}) => ({
        url: `/daily-report/get-all-daily-report-by-superAdmin${buildQuery(
          params
        )}`,
        method: "GET",
      }),
      providesTags: ["reports"],
    }),

    // Legacy queries kept for backwards compatibility.
    getDailyReports: builder.query({
      query: () => ({
        url: `/daily-report/get-all-daily-report-by-superAdmin?week=true`,
        method: "GET",
      }),
      providesTags: ["reports"],
    }),
    getWeklyReport: builder.query({
      query: () => ({
        url: `/daily-report/get-all-daily-report-by-superAdmin?month=true`,
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
      invalidatesTags: ["reports"],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetDailyReportsQuery,
  useGetWeklyReportQuery,
  useUpdateExpenceStatusMutation,
} = ReportApi;
