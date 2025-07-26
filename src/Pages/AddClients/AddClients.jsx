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
import {
  useCreateClientMutation,
  useGetAllClientQuery,
} from "../../redux/Feature/clientApi/clientApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../redux/utils/utils";
const AddClients = () => {
  const [form] = Form.useForm();
  const { data: clientdata } = useGetAllClientQuery();
  const navigate = useNavigate();
  const [createClient] = useCreateClientMutation();

  const userData = clientdata?.data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserClient, setSelectedUserClient] = useState(null);
  const [email, setEmail] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [addClientModal, setAddClientModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // console.log(profileImage);

  const handleBeforeUpload = (file) => {
    form.setFieldsValue({ class_banner: [file] });
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
    return false; // Prevent auto upload
  };

  const handleAddClient = () => {
    setAddClientModal(true);
  };

  const handleAddClientCancel = () => {
    setAddClientModal(false);
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

  const handleSearch = () => {
    // refetc();
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
          <img
            className="shadow-md rounded-full h-10 w-10"
            src={`${BASE_URL}${record?.clientImage}`}
          />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: "Client ID",
      dataIndex: "userId",
      key: "userId",
    },

    {
      title: "Contact No",
      key: "phoneNumber",
      render: (_, record) => {
        const phoneNumber = record.phoneNumber || "N/A";
        return <p>{phoneNumber}</p>;
      },
    },
    // {
    //   title: "Designation",
    //   dataIndex: "designation",
    //   key: "designation",
    // },
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
            <FaCheck className="text-green-500 text-2xl" />
          ) : (
            <MdBlock
              onClick={() => handleblock(record?._id)}
              className="text-red-500 text-2xl"
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

  const handleblock = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
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
    };

    try {
      formData.append("client", JSON.stringify(data));
      formData.append("clientImage", profileImage);

      const res = await createClient(formData).unwrap();
      message.success(res?.message);
    } catch (error) {
      message.error(error?.message);
      console.log(error);
    }
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
                  placeholder="Search "
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
        <button
          onClick={handleAddClient}
          className="px-10 py-3    rounded-xl bg-primary text-white font-semiboldbold shadow-lg flex justify-center items-center gap-2"
        >
          <FaPlus></FaPlus>
          Add Client
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
          total={clientdata?.data?.pagination?.total}
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
                  selectedUserClient?.clientImage
                    ? `${BASE_URL}${selectedUserClient.clientImage}`
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
                <p className="font-bold">Employee ID:</p>
                <p>{selectedUserClient?.userId || "N/A"}</p>
              </div>

              <div className="flex gap-2 mb-4">
                <p className="font-bold">Location:</p>
                <p>{selectedUserClient?.location || "N/A"}</p>
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
            <Form.Item name="clientImage">
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

            <Form.Item name="location" label={<p>Location</p>}>
              <Input placeholder="Location"></Input>
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

export default AddClients;
