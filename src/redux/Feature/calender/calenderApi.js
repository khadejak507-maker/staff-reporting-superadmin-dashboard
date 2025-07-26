import { baseApi } from "../../api/baseApi";

const CalenderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCalenderData: builder.query({
      query: () => ({
        url: "/calender/get-calender-data?month=07&year=2025",
        method: "GET",
      }),
      providesTags: ["calender-data"],
    }),

    updateThecolor: builder.mutation({
      query: ({ _id, data }) => ({
        url: `/calender/update-calender-color/${_id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["calender-data"],
    }),
  }),
});

export const { useGetAllCalenderDataQuery, useUpdateThecolorMutation } =
  CalenderApi;
