import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import {
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useGetAllNotesByStaffIdQuery,
  useGetSingleNotesBySTaffQuery,
} from "../../redux/Feature/notesApi/notesApi";
import { useLocation } from "react-router-dom";
import { message } from "antd";

const Notes = () => {
  const location = useLocation();
  const selectedUser = location.state.selectedUser;

  const [noteId, setNoteId] = useState();
  const [selectedNote, setSelectedNote] = useState();

  const { data: notesData, refetch } = useGetAllNotesByStaffIdQuery({
    staffId: selectedUser,
  });

  const { data: singleNote } = useGetSingleNotesBySTaffQuery(
    { staffId: selectedUser, noteId },
    { skip: !noteId }
  );

  const [createNote, { isLoading: creating }] = useCreateNoteMutation();
  const [deleteNote, { isLoading: deleting }] = useDeleteNoteMutation();

  const [value, setValue] = useState("");

  useEffect(() => {
    if (singleNote?.data?.desc) {
      setValue(singleNote.data.desc);
    } else {
      setValue("");
    }
  }, [singleNote]);

  const handleAddNote = async () => {
    if (!value.trim()) {
      message.warning("Note content cannot be empty");
      return;
    }
    try {
      const data = {
        desc: value,
      };
      const res = await createNote({ data, staffId: selectedUser }).unwrap();
      message.success(res?.message || "Note created successfully");
      setValue("");
      setNoteId(null);
      setSelectedNote(null);
      refetch();
    } catch (error) {
      message.error(error?.data?.message || "Failed to create note");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote({ noteId: id }).unwrap();
      message.success("Note deleted successfully");
      if (id === noteId) {
        setNoteId(null);
        setSelectedNote(null);
        setValue("");
      }
      refetch();
    } catch (error) {
      message.error(error?.data?.message || "Failed to delete note");
    }
  };

  const AllNotedData = notesData?.data;

  return (
    <div>
      <div className="flex justify-between items-start gap-5">
        <div className="w-full md:w-[40%] h-screen overflow-y-auto">
          <h1 className="text-2xl font-bold mb-5">All Notes</h1>
          <div className={selectedNote ? "font-bold" : ""}>
            {AllNotedData?.map((data) => {
              const isSelected = selectedNote === data._id;
              return (
                <div
                  key={data._id}
                  className={`border-b border-gray-300 pb-4 mb-4 cursor-pointer rounded-md p-3 ${
                    isSelected ? "bg-secondary" : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setSelectedNote(data._id);
                    setNoteId(data._id); // triggers singleNote fetch
                  }}
                >
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>
                      <span className="font-semibold text-red-500">
                        Description:
                      </span>{" "}
                      {data?.desc.replace(/<\/?[^>]+(>|$)/g, "")}
                    </div>

                    <div>
                      <span className="font-semibold text-red-500">
                        Created By:
                      </span>{" "}
                      {data?.createdBy}
                    </div>
                    <div>
                      <span className="font-semibold text-red-500">
                        Staff ID:
                      </span>{" "}
                      {data?.staffId}
                    </div>
                    <div>
                      <span className="font-semibold text-red-500">
                        Created At:
                      </span>{" "}
                      {new Date(data?.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <button
                    className="mt-3 text-red-600 hover:text-white border border-red-500 hover:bg-red-500 px-3 py-1 text-xs rounded transition"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent note select on delete
                      handleDelete(data._id);
                    }}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full md:w-[60%]">
          <ReactQuill
            style={{ height: 600 }}
            theme="snow"
            value={value}
            onChange={setValue}
          />

          <button
            onClick={handleAddNote}
            className="px-10 py-3 mt-20 md:my-16 rounded bg-primary text-white font-semiboldbold shadow-lg flex justify-center items-center"
            type="button"
            disabled={creating}
          >
            {creating ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notes;
