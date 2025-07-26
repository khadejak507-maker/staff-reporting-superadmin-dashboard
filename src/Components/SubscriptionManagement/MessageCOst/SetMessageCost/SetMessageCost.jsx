/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Button, Form, Input, Upload } from "antd";
import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";


const SetMessageCost = ({ handleCancel }) => {
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
                            name="cost"
                            label={<p className="text-md">Set message cost</p>}
                            rules={[{ message: "Please input a message cost!" }]}
                        >
                            <Input
                                style={{ padding: "6px" }}
                                className="text-md"
                                placeholder="Set message cost"
                            />
                        </Form.Item>
                    </div>

                    <div className="">
                        <Form.Item
                            name="caracter"
                            label={<p className="text-md">Set Maximum message character</p>}
                            rules={[{ message: "Please input a challenge name!" }]}
                        >
                            <Input
                                style={{ padding: "6px" }}
                                className="text-md"
                                placeholder=" Set Maximum message character"
                            />
                        </Form.Item>
                    </div>


                    <Form.Item>
                        <button
                            onClick={handleCancel}
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

export default SetMessageCost;