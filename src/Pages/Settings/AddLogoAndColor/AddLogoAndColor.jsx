/* eslint-disable no-unused-vars */
import { ColorPicker, Form, Input, message, Upload } from "antd";
import { useState } from "react";
import { useCreateLogoAndColorMutation } from "../../../redux/Feature/seetingsApi/seetingsApi";

const AddLogoAndColor = () => {
  const [createLogoAndColor] = useCreateLogoAndColorMutation();
  const [form] = Form.useForm();
  const [selectedColor, setSelectedColor] = useState("#1677ff");

  const [previewImage, setPreviewImage] = useState(null);
  const [bannerPic, setBannerPic] = useState(null);
  const handleProfilePicUpload = (file) => {
    setBannerPic(file);
    setPreviewImage(URL.createObjectURL(file));
    return false;
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("color", selectedColor);
    formData.append("companyLogo", JSON.stringify(values.companyLogo));
    const res = await createLogoAndColor(formData).unwrap();
    form.resetFields();
    setBannerPic(null);
    setPreviewImage(null);
    message.success(res.message);
  };

  return (
    <div className="max-w-screen-md mx-auto">
      <h1 className="text-2xl md:text-4xl font-bold text-center">
        Add your Company Logo
      </h1>

      <div className="mt-5">
        <Form
          form={form}
          onFinish={onFinish}
          name="add-token"
          initialValues={{ remember: false }}
          layout="vertical"
        >
          <div className="w-full ">
            <Form.Item
              name="companyLogo"
              label={<p className=" text-md">Add Company Logo and Color</p>}
            >
              <div className="border border-dashed border-primary p-5 flex justify-center items-center h-40">
                <Upload
                  showUploadList={false}
                  // onChange={handleProfilePicUpload}
                  beforeUpload={handleProfilePicUpload}
                  className=" "
                >
                  {previewImage ? (
                    <img src={previewImage} alt="" className="w-full h-32" />
                  ) : (
                    <p className="text-primarborder-primary">Upload Image</p>
                  )}
                </Upload>
              </div>
            </Form.Item>
            <Form.Item
              name="color"
              label={<p className="text-md">Add New Color Code</p>}
            >
              <ColorPicker
                style={{ width: "100%" }}
                defaultValue={selectedColor}
                onChange={(color) => setSelectedColor(color.toHexString())}
              />
            </Form.Item>
          </div>

          <Form.Item type="submit">
            <div className="flex justify-center items-center gap-2">
              {/* {isLoading ? (
                <button className="px-6 py-2 rounded-md bg-primary text-white">
                  Submitting...
                </button>
              ) : (
                <button className="px-6 py-2 rounded-md bg-primary text-white">
                  Submit
                </button>
              )} */}

              <button className="px-6 py-2 rounded-md bg-primary text-white">
                Submit
              </button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddLogoAndColor;
