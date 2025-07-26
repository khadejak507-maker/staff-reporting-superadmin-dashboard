/* eslint-disable no-unused-vars */
import {
  Avatar,
  ConfigProvider,
  Form,
  Input,
  message,
  Pagination,
  Select,
  Space,
  Table,
  Upload,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { Modal } from "antd";
import { FaDownload, FaEye, FaImage } from "react-icons/fa";
import { useForm } from "antd/es/form/Form";
import {
  useGetDailyReportsQuery,
  useUpdateExpenceStatusMutation,
} from "../../redux/Feature/reportApi/reportApi";
import { BASE_URL } from "../../redux/utils/utils";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
const Expences = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setsearchTerm] = useState("");
  const { data: expencedata } = useGetDailyReportsQuery({
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
  });
  const [updateExpenceStatus] = useUpdateExpenceStatusMutation();

  const printRef = useRef();
  const userData = expencedata?.data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addClientModal, setAddClientModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const form = useForm();
  const handleProfileImageChange = (e) => {
    setProfileImage(e.file.originFileObj);
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
  const handleUpdateStatus = async (record, newStatus) => {
    try {
      const _id = record?._id;
      console.log(_id);
      const res = await updateExpenceStatus({
        _id,
        status: newStatus,
      }).unwrap();
      message.success(res?.success || "Status updated successfully");
    } catch (error) {
      message.error("Failed to update status");
    }
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
          <image
            size={40}
            className="shadow-md h-10 w-10 rounded-full"
            src={`${BASE_URL}${record?.staffImage}`}
          />
          <span>{record?.staffRef?.name}</span>
        </div>
      ),
    },
    {
      title: "Staff ID",
      dataIndex: ["staffRef", "staffId"],
      key: "staffId",
      render: (_, record) => record?.staffRef?.staffId || "N/A",
    },
    {
      title: "Designation",
      dataIndex: ["staffRef", "designation"],
      key: "designation",
      render: (_, record) => record?.staffRef?.designation || "N/A",
    },
    {
      title: "Amount",
      dataIndex: "expensesIncurred",
      key: "expensesIncurred",
      render: (_, record) => record?.expensesIncurred,
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Select
          style={{ width: 120 }}
          showSearch
          defaultValue={record?.status}
          optionFilterProp="label"
          onChange={(value) => handleUpdateStatus(record, value)}
          options={[
            { value: "Approved", label: "Approved" },
            { value: "Pending", label: "Pending" },
            { value: "Canceled", label: "Canceled" },
          ]}
          placeholder="Select status"
        />
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
          <Space size="middle">
            <button onClick={() => showModal(record)}>
              <FaEye className="text-2xl"></FaEye>
            </button>
          </Space>
        </ConfigProvider>
      ),
    },
  ];

  const onFinish = () => {
    console.log("Success");
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // ✅ Define margins
      const marginLeft = 20; // mm
      const marginTop = 20;
      const marginRight = 20;
      const marginBottom = 20;

      const usableWidth = pdfWidth - marginLeft - marginRight;

      // Get image properties
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = usableWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // If image height exceeds page height, adjust it
      const maxImgHeight = pdfHeight - marginTop - marginBottom;
      const finalImgHeight =
        imgHeight > maxImgHeight ? maxImgHeight : imgHeight;

      pdf.addImage(
        imgData,
        "PNG",
        marginLeft,
        marginTop,
        imgWidth,
        finalImgHeight
      );

      pdf.save("daily-report.pdf");
    } catch (error) {
      console.error("PDF generation failed", error);
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
        <h1 className="text-xl md:text-3xl font-bold">Expences</h1>
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
                onChange={(e) => setsearchTerm(e.target.value)}
                onPressEnter={handleSearch}
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
          total={expencedata?.pagination?.total}
          onChange={handlePageChange}
        ></Pagination>
      </div>

      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <div ref={printRef}>
          <div className="flex justify-between items-center mb-4 mt-5">
            <h1 className="text-xl font-bold">Invoice</h1>
            <div className="flex justify-end">
              <FaDownload
                className="cursor-pointer"
                size={20}
                onClick={handleDownloadPdf}
                title="Download PDF"
              />
            </div>
          </div>
          {selectedUser && (
            <div className="">
              <div className="bg-red-100  text-center relative h-[100px] w-full flex flex-col justify-center items-center">
                <Avatar
                  className="shadow-md h-32 w-32 absolute top-[20px] left-[50%] translate-x-[-50%]"
                  src={selectedUser?.profileImage}
                />
              </div>

              <div className="mt-16">
                <div className="flex gap-2 mb-4">
                  <p className=" font-bold">Name :</p>
                  <p>{selectedUser.staffRef?.name}</p>
                </div>
                <div className="flex gap-2 mb-4">
                  <p className=" font-bold">Employee Id :</p>
                  <p>{selectedUser?.staffRef?.staffId}</p>
                </div>
                <div className="flex gap-2 mb-4">
                  <p className=" font-bold">Designation:</p>
                  <p>{selectedUser?.staffRef?.designation || "N/A"}</p>
                </div>

                <div className="flex gap-2 mb-4">
                  <p className=" font-bold">Amount :</p>
                  <p>{selectedUser?.expensesIncurred || "N/A"}</p>
                </div>
                <div className="gap-2 mb-4">
                  <p className=" font-bold">Invoice :</p>
                  <img
                    src={`${BASE_URL}${selectedUser?.expensesIncurredImage}`}
                    alt=""
                    className="h-40 w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={addClientModal}
        onCancel={handleAddClientCancel}
        footer={null}
        title="Add Client"
      >
        <div>
          <Form
            name="login"
            initialValues={{ remember: true }}
            style={{ maxWidth: 550 }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item name="image">
              <div className="h-20 w-full border border-dashed border-gray-400 flex flex-col justify-center items-center ">
                <Upload
                  showUploadList={false}
                  maxCount={1}
                  beforeUpload={(file) => {
                    form.setFieldsValue({ img: [file] });
                    setProfileImage(file.name);
                    return false;
                  }}
                  className=" px-2 py-1 rounded-full cursor-pointer"
                >
                  <FaImage className="text-neutral-400 h-10 w-10" />
                </Upload>
                {/* <p className="mt-2 text-sm text-gray-700">
                  {profileImage ? profileImage : "No file uploaded"}
                </p> */}
              </div>
            </Form.Item>
            <Form.Item name="name" label={<p>Name</p>}>
              <Input placeholder="Name"></Input>
            </Form.Item>
            <Form.Item name="jobId" label={<p>Job Id</p>}>
              <Input placeholder="Job Id"></Input>
            </Form.Item>
            <Form.Item name="number" label={<p>Phone Number</p>}>
              <Input placeholder="Phone Number"></Input>
            </Form.Item>
            <Form.Item name="location" label={<p>Location</p>}>
              <Input placeholder="Location"></Input>
            </Form.Item>
          </Form>
          <Form.Item name={"submit"}>
            <button
              onClick={handleAddClient}
              className="w-full py-2    rounded-xl bg-primary text-white font-semiboldbold shadow-lg flex justify-center items-center gap-2"
            >
              Submit
            </button>
          </Form.Item>
        </div>
      </Modal>
    </div>
  );
};

export default Expences;
