import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  useGetAllAboutDataQuery,
  useUpdateABoutDataMutation,
} from "../../../redux/Feature/seetingsApi/seetingsApi";
import { message } from "antd";

const AboutUs = () => {
  const { data: aboutData, isLoading } = useGetAllAboutDataQuery();
  const [updateABoutData] = useUpdateABoutDataMutation();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (aboutData?.aboutUs) {
      setValue(aboutData.aboutUs);
    }
  }, [aboutData]);

  const handleSubmit = async (content) => {
    const data = { aboutUs: content };
    try {
      await updateABoutData(data).unwrap();
      message.success("About section updated successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to update About section.");
    }
  };

  return (
    <div className="mx-2 mb-10">
      <ReactQuill
        style={{ height: 600 }}
        theme="snow"
        value={value}
        onChange={setValue}
      />

      <button
        onClick={() => handleSubmit(value)}
        className="px-10 py-3 mt-20 md:my-16 rounded bg-primary text-white font-semibold shadow-lg flex justify-center items-center"
        type="button"
      >
        {isLoading ? "Submitting.." : "Submit"}
      </button>
    </div>
  );
};

export default AboutUs;
