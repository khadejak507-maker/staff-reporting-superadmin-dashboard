/* eslint-disable react/jsx-key */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Button, Form, Input, Upload } from "antd";
import { useState } from "react";
import { FaCamera, FaPlus, FaTrash } from "react-icons/fa";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';


const EditSubscription = () => {
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
                    <div className="w-full flex justify-between items-center gap-2">
                        <Form.Item
                            name="price"
                            label={<p className="text-md">price</p>}
                            rules={[{ message: "Please input a challenge name!" }]}
                        >
                            <Input
                                style={{ padding: "6px" }}
                                className="text-md"
                                placeholder="Add price"
                            />
                        </Form.Item>
                        <Form.Item
                            name="validity"
                            label={<p className="text-md">Validity</p>}
                            rules={[{ message: "Please input a challenge name!" }]}
                        >
                            <Input
                                style={{ padding: "6px" }}
                                className="text-md"
                                placeholder="Add Validity"
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.List name="add features">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div key={key} className="">

                                            <div className="flex justify-between items-center">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'feature']}

                                                    rules={[{ required: true, message: 'Please add an feature' }]}
                                                >
                                                    <Input placeholder="feature" />
                                                </Form.Item>
                                                <FaTrash
                                                    className="text-red-500 cursor-pointer -mt-5"
                                                    onClick={() => remove(name)}
                                                />
                                            </div>




                                        </div>



                                    ))}
                                    <Form.Item>
                                        <button
                                            className="flex justify-between items-center gap-2 w-full  border  px-4 py-2 rounded-md"
                                            type=""
                                            onClick={() => add()}

                                        >
                                            Add feature
                                            <FaPlus />
                                        </button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
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

export default EditSubscription;