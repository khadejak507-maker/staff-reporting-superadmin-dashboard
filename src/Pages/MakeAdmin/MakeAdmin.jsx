import { ConfigProvider, Form, Input, message, Modal, Space, Table } from "antd";
import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const MakeAdmin = () => {
    const showDeleteModal = () => {
        message.success("Delete Admin");
    }

    // form modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    // form Modal
    const onFinish = (values) => {
        console.log('Success:', values);
    };
    // table data:

    const data = [
        {
            key: '1',
            slno: '1',
            name: 'John Doe',
            email: 'dGc2m@example.com',
            user_type: 'Admin'
        },
        {
            key: '2',
            slno: '2',
            name: 'John Doe',
            email: 'dGc2m@example.com',
            user_type: 'Admin'
        },
        {
            key: '3',
            slno: '3',
            name: 'John Doe',
            email: 'dGc2m@example.com',
            user_type: 'Admin'
        }
    ]

    const columns = [
        {
            title: 'Sl No',
            dataIndex: 'slno',
            key: 'slno',
        },
        {
            title: 'Name',
            key: 'name',
            render: (_, record) => (
                <div className="flex items-center gap-2">

                    <span>{record.name}</span>
                </div>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'User Type',
            dataIndex: 'user_type',
            key: 'user_type',

        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <ConfigProvider theme={{
                    components: {
                        "Button": {
                            "defaultHoverBorderColor": "rgb(47,84,235)",
                            "defaultHoverColor": "rgb(47,84,235)",
                            "defaultBorderColor": "rgb(47,84,235)"
                        }
                    }
                }}>
                    <Space size="middle">
                        <button onClick={() => showDeleteModal(record)} className=""><FaTrash className="text-red-500"></FaTrash></button>


                    </Space>
                </ConfigProvider>
            ),
        }
    ];




    return (
        <div className="mx-2">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-5 my-6">
                <p className="text-textColor md:text-xl font-bold">Make Admin</p>

                <button onClick={showModal} className="flex justify-center items-center gap-2 bg-primary px-4 py-2 rounded-md text-white ">
                    <FaPlus className="text-white" />
                    Make Admin
                </button>

            </div>

            <div className="bg-white">
                <Table columns={columns} dataSource={data} pagination={false} rowKey="id" className="overflow-x-auto" />
            </div>
            {/* modal for add admin */}
            <ConfigProvider
                theme={{
                    components: {
                        "Button": {
                            "defaultHoverBorderColor": "rgb(47,84,235)",
                            "defaultHoverColor": "rgb(47,84,235)",
                            "defaultBorderColor": "rgb(47,84,235)"
                        }
                    }
                }}
            >
                <Modal title="Make Admin" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false} >
                    <Form
                        name="contact"
                        initialValues={{ remember: false }}
                        onFinish={onFinish}
                        layout="vertical"

                    >
                        <div className="">
                            <Form.Item
                                name="name"
                                label={<p className=" text-md">Full Name</p>}
                                style={{}}
                            >
                                <Input
                                    required
                                    style={{ padding: "6px" }}
                                    className=" text-md"
                                    placeholder="John Doe"
                                />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label={<p className=" text-md">E-mail</p>}
                                style={{}}
                            >
                                <Input
                                    required
                                    style={{ padding: "6px" }}
                                    className=" text-md"
                                    placeholder="abcd@gmail.com"
                                />
                            </Form.Item>

                        </div>
                        <div className="">
                            <Form.Item
                                name="user_type"
                                label={<p className=" text-md">User Type</p>}
                                style={{}}
                            >
                                <Input
                                    required
                                    style={{ padding: "6px" }}
                                    className=" text-md"
                                    placeholder="Admin"
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label={<p className=" text-md">Password</p>}

                            >
                                <Input.Password
                                    required
                                    style={{ padding: "6px" }}
                                    className=" text-md"
                                    placeholder="******"
                                />
                            </Form.Item>
                        </div>
                        <Form.Item >
                            <button

                                onClick={handleOk}
                                className=" w-full py-2 bg-primary text-white font-semiboldbold rounded-lg text-xl  shadow-lg"
                                type="submit"
                            >
                                Confirm
                            </button>
                        </Form.Item>
                    </Form>

                </Modal>
            </ConfigProvider>
        </div>
    );
};

export default MakeAdmin;