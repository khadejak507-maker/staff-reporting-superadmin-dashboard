import { baseApi } from "../../api/baseApi";

const CLientNoteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotesByclientId: builder.query({
      query: ({ clientId }) => ({
        url: `/note-client/get-single-notes/${clientId}`,
        method: "GET",
      }),
      providesTags: ["get-all-notes-by-staff"],
    }),

    getSingleNotesByClient: builder.query({
      query: ({ noteId, clientId }) => ({
        url: `/note-client/get-single-one-get-note/${clientId}?notesId=${noteId}`,
        method: "GET",
      }),
      providesTags: ["get-all-notes-by-staff"],
    }),

    createNoteByCLient: builder.mutation({
      query: ({ data, clientId }) => ({
        url: `/note-client/create-notes/${clientId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["get-all-notes-by-staff"],
    }),

    deleteNoteByClient: builder.mutation({
      query: ({ noteId }) => ({
        url: `/note-client/delete-note/${noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["get-all-notes-by-staff"],
    }),
  }),
});

export const {
 useCreateNoteByCLientMutation,
 useDeleteNoteByClientMutation,
 useGetAllNotesByclientIdQuery,
 useGetSingleNotesByClientQuery

} = CLientNoteApi;
