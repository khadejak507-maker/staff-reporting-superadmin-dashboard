/* eslint-disable no-unused-vars */
import { ConfigProvider, Form, Input, message, Modal } from "antd";
import { FaEnvelope, FaPlus } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { useState } from "react";
const ContactUs = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // modal ends
    const [email, setEmail] = useState("");

    // for email:
    const showModal = () => {
        setIsModalOpen(true)
    };
    const handleOk = () => {
        setIsModalOpen(false)
    }
    const handleCancel = () => {
        setIsModalOpen(false)

    }

    const handleDelete = (id) => {
        message.error('Deleted Successfully');
    }


    // add contact Number button:

    // add email button:
    const onFinish = async (value) => {
        console.log('Success:', value.email);

    };

    return (
        <div className="mx-2 mb-10">
            {/* add email number: */}
            <div className=" max-w-screen-2xl mx-auto flex flex-col justify-start bg-white  md:px-20 py-8 md:w-[50%]">
                <div className="flex justify-start items-center gap-3 ">
                    <FaEnvelope className="text-white bg-primary p-1 h-6 w-6 rounded-full" />
                    <p className="text-xl text-textColor">Write To US</p>
                </div>
                <div className="my-6">
                    <div className="flex flex-col justify-center items-center gap-5 mb-5">

                        <div className="flex justify-center items-center gap-5">
                            <p className="px-5 py-2 border-2 rounded-lg w-60 md:w-96">abcd@gmail.com </p>
                            <FaRegTrashAlt onClick={() => handleDelete()} className="h-5 w-5 cursor-pointer" />
                        </div>

                    </div>
                    <button
                        onClick={showModal}
                        className=" bg-primary text-white font-semiboldbold text-xl rounded-full shadow-lg flex justify-end items-end"
                        type="submit"
                    >
                        <FaPlus className="text-white bg-primary h-8 w-8 p-1 rounded-full"></FaPlus>
                    </button>
                    <ConfigProvider theme={
                        {
                            components: {
                                "Modal": {
                                    "colorIcon": "rgb(0,0,0)",
                                    "colorIconHover": "rgb(0,0,0)",
                                    "colorBgTextHover": "#ffa496",
                                    "colorBgTextActive": "#ffa496"
                                },

                            }
                        }
                    }>

                        <Modal title="Add Email" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
                            <Form
                                name="contact"
                                initialValues={{ remember: false }}
                                onFinish={onFinish}
                                layout="vertical"

                            >
                                <div className=" gap-2">
                                    <Form.Item
                                        name="email"
                                        label={<p className=" text-md"></p>}
                                        style={{}}
                                    >
                                        <Input
                                            required
                                            style={{ padding: "6px" }}
                                            className=" text-md"
                                            placeholder="xxxxxxx@gmail.com"
                                        />
                                    </Form.Item>


                                </div>

                                <Form.Item >
                                    <button

                                        className="px-4 py-2 rounded bg-primary text-white font-semiboldbold   shadow-lg flex justify-end items-end"
                                        type="submit"
                                    >
                                        save
                                    </button>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </ConfigProvider>
                </div>
            </div>


        </div>

    );
};
export default ContactUs;