/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  useGetAllTermsDataQuery,
  useUpdateTermsDataMutation,
} from "../../../redux/Feature/seetingsApi/seetingsApi";
import { message } from "antd";

const TermsCondition = () => {
  const { data: termsData, isLoading } = useGetAllTermsDataQuery();
  const [updateTermsData] = useUpdateTermsDataMutation();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (termsData?.termsAndConditions) {
      setValue(termsData.termsAndConditions);
    }
  }, [termsData]);

  const handleSubmit = async (content) => {
    const data = { termsAndConditions: content };
    try {
      await updateTermsData(data).unwrap();
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
          Save
        </button>
      </div>
    </div>
  );
};

export default TermsCondition;
