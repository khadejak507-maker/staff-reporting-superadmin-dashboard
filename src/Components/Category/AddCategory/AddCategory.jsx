/* eslint-disable no-unused-vars */
import { Form, Input, Upload } from "antd";
import { useState } from "react";
import { FaCamera } from "react-icons/fa";



const AddCategory = () => {
    const [categoryImg, setCategoryImg] = useState(null);
    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log("Received values of form: ", values);
    }

    return (
        <div>
            <div className="pt-8">
                <Form
                    name="add-category"
                    initialValues={{ remember: false }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item name="img" >
                        <div className="flex flex-col justify-center items-center border-dashed border-2 border-gray-400 p-4">
                            <Upload
                                showUploadList={false}
                                maxCount={1}
                                beforeUpload={(file) => {
                                    form.setFieldsValue({ img: [file] });
                                    return false;
                                }}
                                className=" px-2 py-1 rounded-full cursor-pointer"
                            >
                                <FaCamera className="text-primary h-5 w-5" />
                            </Upload>
                            <p>{categoryImg?.name ? categoryImg?.name : "Upload Image"}</p>
                        </div>
                    </Form.Item>
                    <div className="">
                        <Form.Item
                            name="title"
                            label={<p className="text-md">Category Name</p>}
                            rules={[{ message: "Please input a challenge name!" }]}
                        >
                            <Input
                                style={{ padding: "6px" }}
                                className="text-md"
                                placeholder="Add Category Name"
                            />
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <button
                            type="submit"
                            className="bg-primary w-full text-white px-4 py-2 rounded-md"
                        >
                            Submit
                        </button>
                    </Form.Item>
                </Form>
            </div>
        </div>



    );
};

export default AddCategory;