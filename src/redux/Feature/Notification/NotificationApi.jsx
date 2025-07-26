import { baseApi } from "../../api/baseApi";

const NotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotification: builder.query({
      query: ({ page, limit }) => ({
        url: `/notification/get-all-notification-by-admin?limit=${limit}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["notofication"],
    }),
    markAsRead: builder.mutation({
      query: (_id) => ({
        url: `/notification/notifications-mark-as-read/${_id}`,
        method: "PATCH",
      }),
      providesTags: ["notofication"],
    }),
  }),
});

export const { useGetAllNotificationQuery , useMarkAsReadMutation} = NotificationApi;
