/* eslint-disable no-unused-vars */
import { Avatar, ConfigProvider, Input, Space, Table } from "antd";
import { useState } from "react";

import { Button, Modal } from "antd";
import { FaCalendar, FaEye, FaStopwatch } from "react-icons/fa";
import { AllImages } from "../../../assets/image/AllImages";
import { FiUserCheck } from "react-icons/fi";
import { LiaUserSlashSolid } from "react-icons/lia";
import { SearchOutlined } from "@ant-design/icons";
import { LuRefreshCcw } from "react-icons/lu";
const Doctor = () => {
    const userData = [
        {
            id: "#1239",
            name: "Mr. Mahmud",
            email: "mr101@mail.ru",
            total_appointment: 20,
            contact: "(+33) 7 00 55 59 27",
            address: "Corona, Michigan",
            subscription: "Basic",
            dob: "17 Dec, 2024",
            gender: "Male",
            action: "↗",
            is_active: "true",
            specialization: 'Cardiologist',
            appointment_fee: '200',
            experience: '5 years',
        },
        {
            id: "#1238",
            name: "Lily",
            email: "xterris@gmail.com",
            total_appointment: 20,
            contact: "(+33) 7 00 55 59 27",
            address: "Great Falls, Maryland",
            subscription: "Premium",
            dob: "15 Jan, 2022",
            gender: "Female",
            action: "↗",
            is_active: "true",
            specialization: 'Cardiologist',
            appointment_fee: '200',
            experience: '5 years',
        },
        {
            id: "#1237",
            name: "Kathry",
            email: "irnabela@gmail.com",
            total_appointment: 20,
            contact: "(+33) 7 00 55 59 27",
            address: "Syracuse, Connecticut",
            subscription: "Premium",
            dob: "11 Jul, 2021",
            gender: "Female",
            action: "↗",
            is_active: "true",
            specialization: 'Cardiologist',
            appointment_fee: '200',
            experience: '5 years',
        },
    ];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [email, setEmail] = useState("");


    const showModal = (record) => {
        setSelectedUser(record);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleSearch = () => {
        // refetc();
    };

    const handleSession = (record) => {
        console.log(record);


    }

    const columns = [
        {
            title: 'Sl No',
            dataIndex: 'slno',
            key: 'slno',
            render: (text, record, index) => index + 1
        },
        {
            title: 'Name',
            key: 'name',
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    <Avatar size={40} className="shadow-md" src={record?.profileImage || AllImages.user} />
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
            title: 'Contact No',
            key: 'contact',
            render: (_, record) => {
                const contact = record.contact || 'N/A';
                return (
                    <p>{contact}</p>
                )
            }
        },
        {
            title: 'Subscription',
            key: 'subscription',
            render: (_, record) => {
                const subscription = record?.subscription || 'N/A';
                return (
                    <p className="text-primary">{subscription}</p>
                )
            }
        },
        {
            title: 'Specialization',
            key: 'specialization',
            render: (_, record) => {
                const specialization = record?.specialization || 'N/A';
                return (
                    <p>{specialization}</p>
                )
            }
        },

        {
            title: 'Appointment Fee',
            key: 'appointment_fee',
            render: (_, record) => {
                const appointmentFee = record?.appointment_fee || 'N/A';
                return (
                    <p>{appointmentFee}</p>
                )
            }
        },
        {
            title: 'Total Appointment',
            key: 'total_appointment',
            render: (_, record) => {
                const totalBooking = record?.total_appointment || 'N/A';
                return (
                    <p>{totalBooking}</p>
                )
            }
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
                        <Button onClick={() => showModal(record)} icon={<FaEye className="text-primary" />} />

                        <Button
                            onClick={() => handleSession(record)}
                            icon={
                                record?.is_active === true ? (
                                    <FiUserCheck className="h-5 w-5 text-green-500" />

                                ) : (
                                    <LiaUserSlashSolid className="h-5 w-5 text-red-500" />
                                )
                            }
                        />
                    </Space>
                </ConfigProvider>
            ),
        }
    ];


    return (
        <div className="">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-10">
                <h3 className="text-xl md:text-2xl font-semibold text-textColor px-2 md:px-0">
                    All Doctors
                </h3>
                <div className="mt-4 md:mt-0 flex justify-between items-center gap-2">
                    <div>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Input: {
                                        borderRadius: 0,
                                        hoverBorderColor: "none",
                                        activeBorderColor: "none",
                                    },
                                },
                            }}
                        >
                            <div className="flex gap-2 items-center relative">

                                <Input
                                    placeholder="Search by email"
                                    allowClear
                                    size="large"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onPressEnter={handleSearch}
                                    prefix={
                                        <SearchOutlined
                                            style={{ cursor: "pointer" }}
                                            onClick={handleSearch}
                                        />
                                    }
                                />


                                <button
                                    onClick={handleSearch}
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-primaryColor text-white p-2 rounded-r-lg"
                                >
                                    search
                                </button>
                            </div>
                        </ConfigProvider>
                    </div>

                </div>
            </div>
            <div className="bg-white overflow-x-auto">
                <Table columns={columns} dataSource={userData || []} pagination={false} rowKey="id" />
            </div>

            <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
                {selectedUser && (
                    <div className="p-2">
                        <div className="bg-[#e9d69a] py-5 text-center">
                            <Avatar size={200} src={selectedUser?.profileImage || AllImages.user} />
                            <h2 className="text-2xl font-bold mt-4 text-textColor">Doctor: {selectedUser.name}</h2>
                            <h2 className="text-xl mt-4 text-textColor">{selectedUser.specialization}</h2>
                        </div>
                        <div className="my-6">

                            <div className="flex gap-2 mb-4">
                                <p className="text-gray-600 font-semibold">Email :</p>
                                <p>{selectedUser.email}</p> 
                            </div>
                            <div className="flex gap-2 mb-4">
                                <p className="text-gray-600 font-semibold">Contact No :</p>
                                <p>{selectedUser?.contact || 'N/A'}</p>
                            </div>
                            <div className="flex gap-2 mb-4">
                                <p className="text-gray-600 font-semibold">Address :</p>
                                <p>{selectedUser?.address || 'N/A'}</p>
                            </div>
                            <div className="flex gap-2 mb-4">
                                <p className="text-gray-600 font-semibold">Date of birth :</p>
                                <p>{selectedUser?.dob || 'N/A'}</p>
                            </div>
                            <div className="flex gap-2 mb-4">
                                <p className="text-gray-600 font-semibold">Experience :</p>
                                <p>{selectedUser?.experience || 'N/A'}</p>
                            </div>
                            <div className="flex gap-2 mb-4">
                                <p className="text-gray-600 font-semibold">Subscription :</p>
                                <p className="text-primary">{selectedUser?.subscription || 'N/A'}</p>
                            </div>
                            <div className="flex gap-2 mb-4">
                                <p className="text-gray-600 font-semibold">CV & Certification:</p>
                                <p className="text-primary cursor-pointer">View</p>
                            </div>
                            <div className="flex gap-2 mb-4">
                                <p className="text-gray-600 font-semibold">Availablity:</p>
                                <p className="flex gap-2 justify-start items-center"><FaCalendar className="text-primary" /> Mon-Fri </p>
                                <p className="flex gap-2 justify-start items-center" ><FaStopwatch className="text-primary" /> 10:00 AM - 6:00 PM</p>
                            </div>



                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Doctor;
