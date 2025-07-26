/* eslint-disable no-unused-vars */
import { Avatar, ConfigProvider, Input, Pagination, Space, Table } from "antd";
import { useEffect, useState } from "react";
import user from "../../assets/image/user.png";
import { Modal } from "antd";
import { FaCheck, FaEye } from "react-icons/fa";

import { MdBlock } from "react-icons/md";
import Swal from "sweetalert2";
import {
  useBlockStaffByAdminMutation,
  useGetAllStaffQuery,
} from "../../redux/Feature/satffApi/staffApi";
import { BASE_URL } from "../../redux/utils/utils";
import { BiEdit } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
const StaffDetails = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: staffData } = useGetAllStaffQuery({
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
  });
  const [blockStaffByAdmin] = useBlockStaffByAdminMutation();
  const userData = staffData?.data;
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

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
  };
  const handleblock = (id, isBlocked) => {
    const action = isBlocked ? "Unblock" : "Block";
    const pastTenseAction = isBlocked ? "unblocked" : "blocked";

    Swal.fire({
      title: `Are you sure you want to ${action.toLowerCase()} this user?`,
      text: `You can change it later if needed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action.toLowerCase()}!`,
    }).then((result) => {
      if (result.isConfirmed) {
        blockStaffByAdmin(id); // perform the toggle action
        Swal.fire({
          title: `${action}ed!`,
          text: `The user has been successfully ${pastTenseAction}.`,
          icon: "success",
        });
      }
    });
  };

  const columns = [
    {
      title: "#",
      dataIndex: "slno",
      key: "slno",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar size={40} className="shadow-md" src={record?.profileImage} />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: "Staff ID",
      dataIndex: "staffId",
      key: "staffId",
    },

    {
      title: "Contact No",
      key: "phoneNumber",
      render: (_, record) => {
        const phoneNumber = record.phoneNumber || "N/A";
        return <p>{phoneNumber}</p>;
      },
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: "Rates",
      dataIndex: "rates",
      key: "rates",
    },
    {
      title: "location",
      dataIndex: "location",
      key: "location",
    },

    {
      title: "Status",
      key: "isBlocked",
      render: (_, record) => (
        <p className="flex items-center gap-2">
          {record.isBlocked === false ? (
            <FaCheck
              onClick={() => handleblock(record._id, record.isBlocked)}
              className="text-green-500 text-2xl cursor-pointer"
            />
          ) : (
            <MdBlock
              onClick={() => handleblock(record._id, record.isBlocked)}
              className="text-red-500 text-2xl cursor-pointer"
            />
          )}
        </p>
      ),
    },
    {
      title: "View",
      key: "view",
      render: (_, record) => (
        <ConfigProvider
          theme={{
            components: {
              Button: {
                defaultHoverBorderColor: "rgb(47,84,235)",
                defaultHoverColor: "rgb(47,84,235)",
                defaultBorderColor: "rgb(47,84,235)",
              },
            },
          }}
        >
          <div className="flex justify-center items-center gap-2">
            <Space size="middle">
              <button onClick={() => showModal(record)}>
                <FaEye className="text-2xl"></FaEye>
              </button>
            </Space>
            <Space size="middle">
              <button onClick={() => handleNotes(record)}>
                <BiEdit className="text-2xl" />
              </button>
            </Space>
          </div>
        </ConfigProvider>
      ),
    },
  ];

  const handleNotes = (record) => {
    setSelectedUser(record._id);
    navigate(`notes/${record._id}`, { state: { selectedUser: record._id } });
  };

  // change the color according to the primary color:
    const [primaryColor, setPrimaryColor] = useState("#d51920");
  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const cssPrimaryColor = rootStyles
      .getPropertyValue("--color-primary")
      .trim();
    setPrimaryColor(cssPrimaryColor || "#3b19d5"); // fallback to default
  }, []);
  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-10">
        <h3 className="text-xl md:text-2xl font-semibold text-textColor px-2 md:px-0">
          All Staff
        </h3>
        <div className="mt-4 md:mt-0 flex justify-between items-center gap-2">
          <div>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: primaryColor,
                },
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
                  placeholder="Search Class"
                  allowClear
                  size="large"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onPressEnter={handleSearch}
                  // prefix={
                  //   <SearchOutlined
                  //     style={{ cursor: "pointer" }}
                  //     onClick={handleSearch}
                  //   />
                  // }
                />

                <button
                  onClick={handleSearch}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-primaryColor text-white p-2 rounded-r-lg bg-primary"
                >
                  search
                </button>
              </div>
            </ConfigProvider>
          </div>
        </div>
      </div>
      <div className=" overflow-x-auto">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: primaryColor,
            },
            components: {
              Table: {
                headerBg: primaryColor,
                headerSortActiveBg: primaryColor,
                headerFilterHoverBg: primaryColor,
                colorText: "rgb(0, 0, 0)",
                colorTextHeading: "rgb(255, 255, 255)",
              },
            },
          }}
        >
          <Table
            columns={columns}
            dataSource={userData || []}
            pagination={false}
            rowKey="id"
          />
        </ConfigProvider>
      </div>

      <div className="mt-10 flex justify-center items-center">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={staffData?.pagination?.total}
          onChange={handlePageChange}
        ></Pagination>
      </div>

      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        {selectedUser && (
          <div className="">
            <div className="bg-red-100 text-center relative h-[100px] w-full flex flex-col justify-center items-center">
              <Avatar
                className="shadow-md h-32 w-32 absolute top-[20px] left-[50%] translate-x-[-50%]"
                src={
                  selectedUser?.staffImage
                    ? `${BASE_URL}${selectedUser.staffImage}`
                    : user
                }
              />
            </div>

            <div className="mt-16">
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Name:</p>
                <p>{selectedUser?.name || "N/A"}</p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Employee ID:</p>
                <p>{selectedUser?.staffId || "N/A"}</p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Designation:</p>
                <p>{selectedUser?.designation || "N/A"}</p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Location:</p>
                <p>{selectedUser?.location || "N/A"}</p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Phone Number:</p>
                <p>{selectedUser?.phoneNumber || "N/A"}</p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Emergency Contact Name:</p>
                <p>{selectedUser?.emergencyContactName || "N/A"}</p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Emergency Contact Number:</p>
                <p>{selectedUser?.emergencyContactNumber || "N/A"}</p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Emergency Contact Address:</p>
                <p>{selectedUser?.emergencyContactAddress || "N/A"}</p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Ongoing Health Concern:</p>
                <p>{selectedUser?.ongoingHealthConcern || "N/A"}</p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Allergies:</p>
                <p>{selectedUser?.allergies || "N/A"}</p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Qualification:</p>
                <p>{selectedUser?.Qualifications || "N/A"}</p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Trade:</p>
                <p>{selectedUser?.trade || "N/A"}</p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Rates:</p>
                <p>{selectedUser?.rates ?? "N/A"}</p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Member Since:</p>
                <p>
                  {selectedUser?.memberSince
                    ? new Date(selectedUser.memberSince).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Created At:</p>
                <p>{new Date(selectedUser?.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Updated At:</p>
                <p>{new Date(selectedUser?.updatedAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Blocked:</p>
                <p>{selectedUser?.isBlocked ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffDetails;
