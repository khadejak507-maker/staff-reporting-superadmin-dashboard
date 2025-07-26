/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  useGetAllPrivacyDataQuery,
  useUpdatePrivacyDataMutation,
} from "../../../redux/Feature/seetingsApi/seetingsApi";
import { message } from "antd";

const PrivacyPolicy = () => {
  const { data: privacyData, isLoading } = useGetAllPrivacyDataQuery();
  const [updatePrivacyData] = useUpdatePrivacyDataMutation();
  const [value, setValue] = useState("");
  console.log(privacyData);
  useEffect(() => {
    if (privacyData?.privacyPolicy) {
      setValue(privacyData.privacyPolicy);
    }
  }, [privacyData]);

  const handleSubmit = async (content) => {
    const data = { privacyPolicy: content };
    try {
      await updatePrivacyData(data).unwrap();
      message.success("About section updated successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to update About section.");
    }
  };
  return (
    <div className="mx-2 mb-10">
      <div className="">
        {/* show about data */}

        <ReactQuill
          style={{ height: 600 }}
          theme="snow"
          value={value}
          onChange={setValue}
        />

        <button
          onClick={() => handleSubmit(value)}
          className="px-10 py-3 mt-20  md:my-16 rounded bg-primary text-white font-semiboldbold shadow-lg flex justify-center items-center"
          type="submit"
        >
          {isLoading ? " Saving.." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
