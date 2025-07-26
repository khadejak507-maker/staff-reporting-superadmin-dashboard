/* eslint-disable no-unused-vars */
import {
  Avatar,
  ConfigProvider,
  Form,
  Input,
  InputNumber,
  message,
  Pagination,
  Space,
  Table,
  Upload,
} from "antd";
import { BiEdit } from "react-icons/bi";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import { FaCheck, FaEye, FaImage, FaPlus } from "react-icons/fa";
import { SearchOutlined } from "@ant-design/icons";
import { MdBlock } from "react-icons/md";
import user from "../../assets/image/user.png";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../redux/utils/utils";
import {
  useBlockStaffByAdminMutation,
  useCreateStaffByAdminMutation,
  useGetAllStaffByAdminQuery,
  useUpdateStaffByAdminMutation,
} from "../../redux/Feature/satffApi/staffApi";
import { FaPencil } from "react-icons/fa6";
const CreateStaff = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const [createStaffByAdmin] = useCreateStaffByAdminMutation();
  const [blockStaffByAdmin] = useBlockStaffByAdminMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserClient, setSelectedUserClient] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [addClientModal, setAddClientModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const { data: staffDataByAdmin } = useGetAllStaffByAdminQuery({
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
  });
  const userData = staffDataByAdmin?.data;

  const [updateStaffByAdmin] = useUpdateStaffByAdminMutation();

  const handleBeforeUpload = (file) => {
    form.setFieldsValue({ class_banner: [file] });
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
    return false; // Prevent auto upload
  };

  const handleAddClient = () => {
    setAddClientModal(true);
  };
  const handleEditStaff = (record) => {
    setSelectedUserClient(record)
    setIsEditModalOpen(true);
  };

  const handleAddClientCancel = () => {
    setAddClientModal(false);
  };
  const handleEditStaffCancel = () => {
    setIsEditModalOpen(false);
  };

  const handleAddClientOk = () => {
    setAddClientModal(false);
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const showModal = (record) => {
    setSelectedUserClient(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedUserClient(null);
  };

  const handleSearch = () => {};

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
          <img
            className="shadow-md rounded-full h-10 w-10"
            src={`${BASE_URL}${record?.staffImage}`}
          />
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
      title: "password",
      dataIndex: "password",
      key: "password",
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
              <button onClick={()=>handleEditStaff(record)}>
                <FaPencil className="text-xl" />
              </button>
            </Space>
          </div>
        </ConfigProvider>
      ),
    },
  ];

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

  const handleNotes = (record) => {
    // console.log(record._id);
    setSelectedUserClient(record._id);
    navigate(`notes/${record._id}`, {
      state: { selectedUserClient: record._id },
    });
  };

  const onFinish = async (values) => {
    console.log("Success", values);
    const formData = new FormData();
    const data = {
      name: values.name,
      phoneNumber: values.phoneNumber,
      location: values.location,
      rates: values.rates,
      password: values.password,
      designation: values.designation,
    };

    try {
      formData.append("staff", JSON.stringify(data));
      formData.append("staffImage", profileImage);

      const res = await createStaffByAdmin(formData).unwrap();
      message.success(res?.message);
      setAddClientModal(false);
    } catch (error) {
      message.error(error?.message);
      console.log(error);
    }
  };

const onEditFinish = async (values) => {
  const formData = new FormData();
  const data = {
    name: values.name,
    phoneNumber: values.phoneNumber,
    location: values.location,
    rates: values.rates,
    password: values.password,
    designation: values.designation,
  };

  formData.append("staff", JSON.stringify(data));
  formData.append("staffImage", profileImage);

  try {
    const res = await updateStaffByAdmin({
      data: formData,
      _id: selectedUserClient?._id,
    }).unwrap();
    message.success(res?.message);
    setIsEditModalOpen(false);
  } catch (error) {
    message.error(error?.message || "Update failed");
    console.log(error);
  }
};

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
        <div className="mt-4 md:mt-0 flex justify-between items-center gap-2">
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
        <button
          onClick={handleAddClient}
          className="px-10 py-3    rounded-xl bg-primary text-white font-semiboldbold shadow-lg flex justify-center items-center gap-2"
        >
          <FaPlus></FaPlus>
          Create Staff
        </button>
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
          total={staffDataByAdmin?.pagination?.total}
          onChange={handlePageChange}
        ></Pagination>
      </div>

      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        {selectedUserClient && (
          <div className="">
            <div className="bg-red-100 text-center relative h-[100px] w-full flex flex-col justify-center items-center">
              <Avatar
                className="shadow-md h-32 w-32 absolute top-[20px] left-[50%] translate-x-[-50%]"
                src={
                  selectedUserClient?.staffImage
                    ? `${BASE_URL}${selectedUserClient.staffImage}`
                    : user
                }
              />
            </div>

            <div className="mt-16">
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Name:</p>
                <p>{selectedUserClient?.name || "N/A"}</p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Designation:</p>
                <p>{selectedUserClient?.designation || "N/A"}</p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Employee ID:</p>
                <p>{selectedUserClient?.staffId || "N/A"}</p>
              </div>

              <div className="flex gap-2 mb-4">
                <p className="font-bold">Password:</p>
                <p>{selectedUserClient?.password || "N/A"}</p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Phone Number:</p>
                <p>{selectedUserClient?.phoneNumber || "N/A"}</p>
              </div>

              <div className="flex gap-2 mb-4">
                <p className="font-bold">Rates:</p>
                <p>{selectedUserClient?.rates ?? "N/A"}</p>
              </div>

              <div className="flex gap-2 mb-4">
                <p className="font-bold">Created At:</p>
                <p>
                  {new Date(selectedUserClient?.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Updated At:</p>
                <p>
                  {new Date(selectedUserClient?.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2 mb-4">
                <p className="font-bold">Blocked:</p>
                <p>{selectedUserClient?.isBlocked ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={addClientModal}
        onCancel={handleAddClientCancel}
        footer={null}
        title="Add Client"
      >
        <div>
          <Form
            name="addClient"
            initialValues={{ remember: true }}
            style={{ maxWidth: 550 }}
            onFinish={onFinish}
            layout="vertical"
            form={form}
          >
            <Form.Item name="staffImage">
              <div className="border border-dashed border-secondary p-5 flex justify-center items-center h-40">
                <Upload
                  showUploadList={false}
                  maxCount={1}
                  beforeUpload={handleBeforeUpload}
                  setFileList={setProfileImage}
                >
                  {!previewImage ? (
                    <>
                      <FaImage className="text-secondary h-10 w-10" />
                      <p className="text-secondary">Upload Image</p>
                    </>
                  ) : (
                    <>
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="h-24 object-contain"
                      />
                      <p className="text-secondary">{profileImage?.name}</p>
                    </>
                  )}
                </Upload>
              </div>
            </Form.Item>
            <Form.Item name="name" label={<p>Name</p>}>
              <Input placeholder="Name"></Input>
            </Form.Item>
            <Form.Item name="designation" label={<p>Designation</p>}>
              <Input placeholder="Designation"></Input>
            </Form.Item>

            <Form.Item name="phoneNumber" label={<p>Phone Number</p>}>
              <Input placeholder="Phone Number"></Input>
            </Form.Item>
            <Form.Item
              name="rates"
              label={<p>Rates</p>}
              rules={[
                {
                  required: true,
                  message: "Rates is required",
                },
                {
                  type: "number",
                  min: 0,
                  message: "Rates cannot be a negative number",
                },
              ]}
            >
              <InputNumber style={{ width: 470 }} placeholder="Rates" />
            </Form.Item>

            {/* <Form.Item name="location" label={<p>Location</p>}>
              <Input placeholder="Location"></Input>
            </Form.Item> */}
            <Form.Item name="password" label={<p>Password</p>}>
              <Input placeholder="password"></Input>
            </Form.Item>
            <Form.Item>
              <button
                type="submit"
                className="w-full py-2    rounded-xl bg-primary text-white font-semiboldbold shadow-lg flex justify-center items-center gap-2"
              >
                Submit
              </button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Modal
        open={isEditModalOpen}
        onCancel={handleEditStaffCancel}
        footer={null}
        title="Edit Client"
      >
        <div>
          <Form
            name="editClient"
            initialValues={{ remember: true }}
            style={{ maxWidth: 550 }}
            onFinish={onEditFinish}
            layout="vertical"
            form={form}
          >
            <Form.Item name="staffImage">
              <div className="border border-dashed border-secondary p-5 flex justify-center items-center h-40">
                <Upload
                  showUploadList={false}
                  maxCount={1}
                  beforeUpload={handleBeforeUpload}
                  setFileList={setProfileImage}
                >
                  {!previewImage ? (
                    <>
                      <FaImage className="text-secondary h-10 w-10" />
                      <p className="text-secondary">Upload Image</p>
                    </>
                  ) : (
                    <>
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="h-24 object-contain"
                      />
                      <p className="text-secondary">{profileImage?.name}</p>
                    </>
                  )}
                </Upload>
              </div>
            </Form.Item>
            <Form.Item name="name" label={<p>Name</p>}>
              <Input placeholder="Name"></Input>
            </Form.Item>
            <Form.Item name="designation" label={<p>Designation</p>}>
              <Input placeholder="Designation"></Input>
            </Form.Item>

            <Form.Item name="phoneNumber" label={<p>Phone Number</p>}>
              <Input placeholder="Phone Number"></Input>
            </Form.Item>
            <Form.Item
              name="rates"
              label={<p>Rates</p>}
              rules={[
                {
                  required: true,
                  message: "Rates is required",
                },
                {
                  type: "number",
                  min: 0,
                  message: "Rates cannot be a negative number",
                },
              ]}
            >
              <InputNumber style={{ width: 470 }} placeholder="Rates" />
            </Form.Item>

            {/* <Form.Item name="location" label={<p>Location</p>}>
              <Input placeholder="Location"></Input>
            </Form.Item> */}
            <Form.Item name="password" label={<p>Password</p>}>
              <Input placeholder="password"></Input>
            </Form.Item>
            <Form.Item>
              <button
                type="submit"
                className="w-full py-2    rounded-xl bg-primary text-white font-semiboldbold shadow-lg flex justify-center items-center gap-2"
              >
                Submit
              </button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default CreateStaff;
