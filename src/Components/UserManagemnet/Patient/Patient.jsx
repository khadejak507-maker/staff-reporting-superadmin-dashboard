/* eslint-disable no-unused-vars */
import { Avatar, ConfigProvider, Input, Space, Table } from "antd";
import { useState } from "react";

import { Button, Modal } from "antd";
import { FaEye } from "react-icons/fa";
import { AllImages } from "../../../assets/image/AllImages";
import { FiUserCheck } from "react-icons/fi";
import { LiaUserSlashSolid } from "react-icons/lia";
import { SearchOutlined } from "@ant-design/icons";
import { LuRefreshCcw } from "react-icons/lu";
const Patient = () => {
  const userData = [
    {
      id: "#1239",
      name: "Mr. Mahmud",
      email: "mr101@mail.ru",
      total_booking: 20,
      contact: "(+33) 7 00 55 59 27",
      location: "Corona, Michigan",
      address: "76/4 R no. 60/1 Rue des Saints-Paris, 75005 Paris",
      dob: "17 Dec, 2024",
      gender: "Male",
      action: "↗",
      is_active: "true",
    },
    {
      id: "#1238",
      name: "Lily",
      email: "xterris@gmail.com",
      total_booking: 20,
      contact: "(+33) 7 00 55 59 27",
      location: "Great Falls, Maryland",
      address: "123 Rue des Lilas, Paris, 75008",
      dob: "15 Jan, 2022",
      gender: "Female",
      action: "↗",
      is_active: "true",
    },
    {
      id: "#1237",
      name: "Kathry",
      email: "irnabela@gmail.com",
      total_booking: 20,
      contact: "(+33) 7 00 55 59 27",
      location: "Syracuse, Connecticut",
      address: "45 Avenue des Champs, Paris, 75001",
      dob: "11 Jul, 2021",
      gender: "Female",
      action: "↗",
      is_active: "true",
    },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [email, setEmail] = useState("");

  // const data = userData?.data
  // const filteredData = data?.filter(user =>
  //   user.email.includes(email) || user.name.toLowerCase().includes(email.toLowerCase())
  // );

  // const [block, setBlock] = useState(false);


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
      title: 'Location',
      key: 'address',
      render: (_, record) => {
        const address = record?.address || 'N/A';
        return (
          <p>{address}</p>
        )
      }
    },
    {
      title: 'Total Booking',
      key: 'total_booking',
      render: (_, record) => {
        const totalBooking = record?.total_booking || 'N/A';
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
          All Patients
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
              <h2 className="text-2xl font-bold mt-4 text-textColor">Name: {selectedUser.name}</h2>
              <h2 className="text-xl mt-4 text-textColor">Patient </h2>
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
                <p className="text-gray-600 font-semibold">Date of birth :</p>
                <p>{selectedUser?.dob || 'N/A'}</p>
              </div>

              <div className="flex gap-2 mb-4">
                <p className="text-gray-600 font-semibold">Address :</p>
                <p>{selectedUser.address || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Patient;
