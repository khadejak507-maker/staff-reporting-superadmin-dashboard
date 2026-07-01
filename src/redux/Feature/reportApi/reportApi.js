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

    // Companies (owner accounts) for the Data Harvest "Filter by Company"
    // dropdown. Each item's `_id` is the owner id used as the `ownerId` filter.
    getCompanies: builder.query({
      query: () => ({
        url: `/company/all-companies`,
        method: "GET",
      }),
      providesTags: ["companies"],
    }),

    // Clients belonging to a selected company (Company → Client cascade). Skip
    // the request until a company (ownerId) is chosen.
    getClientsByCompany: builder.query({
      query: (ownerId) => ({
        url: `/client/get-clients-by-company?ownerId=${ownerId}`,
        method: "GET",
      }),
      providesTags: ["companyClients"],
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
  useGetCompaniesQuery,
  useGetClientsByCompanyQuery,
  useGetDailyReportsQuery,
  useGetWeklyReportQuery,
  useUpdateExpenceStatusMutation,
} = ReportApi;
