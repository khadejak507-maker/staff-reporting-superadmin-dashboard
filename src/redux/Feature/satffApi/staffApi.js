import { baseApi } from "../../api/baseApi";

const StaffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllStaff: builder.query({
      query: ({ limit, page, search }) => ({
        url: `/staff/get-all-staff-info?search=${search}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["all-staff-by-admin"],
    }),

    createStaffByAdmin: builder.mutation({
      query: (data) => ({
        url: "/staff/create-staff",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["all-staff-by-admin"],
    }),
    getAllStaffByAdmin: builder.query({
      query: ({ page, limit, search }) => ({
        url: `/staff/get-all-my-staffs?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["all-staff-by-admin"],
    }),

    blockStaffByAdmin: builder.mutation({
      query: (_id) => ({
        url: `/staff/block-unblock-staff/${_id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["all-staff-by-admin"],
    }),
    updateStaffByAdmin: builder.mutation({
      query: ({ data, _id }) => ({
        url: `/staff/update-staff/${_id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["all-staff-by-admin"],
    }),
  }),
});

export const {
  useGetAllStaffQuery,
  useCreateStaffByAdminMutation,
  useGetAllStaffByAdminQuery,
  useBlockStaffByAdminMutation,
  useUpdateStaffByAdminMutation
} = StaffApi;
