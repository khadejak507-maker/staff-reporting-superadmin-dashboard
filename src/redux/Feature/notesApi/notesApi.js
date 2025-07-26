import { baseApi } from "../../api/baseApi";

const NotesAPi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotesByStaffId: builder.query({
      query: ({ staffId }) => ({
        url: `/note/get-single-notes/${staffId}`,
        method: "GET",
      }),
      providesTags: ["get-all-notes-by-staff"],
    }),

    getSingleNotesBySTaff: builder.query({
      query: ({ noteId, staffId }) => ({
        url: `/note/get-single-one-get-note/${staffId}?notesId=${noteId}`,
        method: "GET",
      }),
      providesTags: ["get-all-notes-by-staff"],
    }),

    createNote: builder.mutation({
      query: ({ data, staffId }) => ({
        url: `/note/create-notes/${staffId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["get-all-notes-by-staff"],
    }),

    deleteNote: builder.mutation({
      query: ({ noteId }) => ({
        url: `/note/delete-note/${noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["get-all-notes-by-staff"],
    }),
  }),
});

export const {
  useGetAllNotesByStaffIdQuery,
  useGetSingleNotesBySTaffQuery,
  useCreateNoteMutation,
  useDeleteNoteMutation,
} = NotesAPi;
