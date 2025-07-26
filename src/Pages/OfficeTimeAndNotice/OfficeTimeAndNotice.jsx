import { Form, message, TimePicker, Upload } from "antd";
import { useState } from "react";
import {
  useCraeteOfficeTimeMutation,
  useCreateOfficeNoticeMutation,
} from "../../redux/Feature/officeTimeAndNoticeApi/officetimeAndNoticeApi";
import { FaImage } from "react-icons/fa";

const OfficeTimeAndNotice = () => {
  const [form] = Form.useForm();
  const [craeteOfficeTime] = useCraeteOfficeTimeMutation();
  const [createOfficeNotice] = useCreateOfficeNoticeMutation();

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    const data = {
      checkInTime: values.check_in,
      checkOutTime: values.check_out,
    };
    try {
      const res = await craeteOfficeTime(data).unwrap();
      form.resetFields();
      message.success(res?.message);
    } catch (error) {
      message.error(error?.message);
    }
  };
  const [previewImage, setPreviewImage] = useState(null);
  const [bannerPic, setBannerPic] = useState(null);

  const handleProfilePicUpload = (file) => {
    setBannerPic(file);
    setPreviewImage(URL.createObjectURL(file));
    return false;
  };

  const onFinishForNotice = async () => {
    const formData = new FormData();
    try {
      formData.append("officeNotice", bannerPic);
      const res = await await createOfficeNotice(formData).unwrap();
      message.success(res?.message);
      setBannerPic("");
    } catch (error) {
      console.log(error);
      error.message(error?.data?.message);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col  items-center h-screen">
        <h1 className="text-2xl font-bold my-3">Office Time Management</h1>
        <div>
          <Form
            form={form}
            name="office-time"
            initialValues={{ remember: false }}
            onFinish={onFinish}
            layout="vertical"
            className="w-[400px]"
          >
            <Form.Item name="check_in" label="Check In">
              <TimePicker
                style={{ width: "100%" }}
                placeholder="Check In"
                format="HH:mm"
              ></TimePicker>
            </Form.Item>
            <Form.Item name="check_out" label="Check Out">
              <TimePicker
                style={{ width: "100%" }}
                placeholder="Check In"
                format="HH:mm"
              ></TimePicker>
            </Form.Item>

            <Form.Item name="submit">
              <div className="flex  justify-end">
                {" "}
                <button
                  type="submit"
                  className="bg-primary text-white py-2 w-full rounded-md"
                >
                  Create
                </button>
              </div>
            </Form.Item>
          </Form>
        </div>
        <div className="mt-10">
          <h1 className="text-2xl font-bold my-3">Office Notice</h1>
          <div>
            <Form
              name="office-time"
              initialValues={{ remember: false }}
              onFinish={onFinishForNotice}
              layout="vertical"
              className="w-[400px]"
            >
              <Form.Item name="check_in" label="Upload Image">
                <div className="border-2 border-primary border-dashed py-5 flex flex-col justify-center items-center w-full ">
                  <Upload
                    showUploadList={false}
                    // onChange={handleProfilePicUpload}
                    beforeUpload={handleProfilePicUpload}
                    className=" "
                  >
                    {previewImage ? (
                      <img src={previewImage} alt="" className="w-full h-40" />
                    ) : (
                      <FaImage className="text-3xl"></FaImage>
                    )}
                  </Upload>
                </div>
              </Form.Item>

              <Form.Item name="submit">
                <div className="flex  justify-end">
                  {" "}
                  <button
                    type="submit"
                    className="bg-primary text-white py-2 w-full rounded-md"
                  >
                    Create
                  </button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeTimeAndNotice;
