import { baseApi } from "../../api/baseApi";

const ClientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllClient: builder.query({
      query: () => ({
        url: "/client/get-all-my-clients",
        method: "GET",
      }),
      providesTags: ["all-client"],
    }),

    createClient: builder.mutation({
      query: (data) => {
        console.log(data);
        return {
          url: "/client/create-client",
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const { useGetAllClientQuery, useCreateClientMutation } = ClientApi;
