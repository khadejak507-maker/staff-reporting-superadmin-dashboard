/* eslint-disable no-unused-vars */
import { Avatar, ConfigProvider, Pagination, Select, Space, Table } from "antd";
import { useEffect, useRef, useState } from "react";

import { Modal } from "antd";
import { FaDownload, FaEye } from "react-icons/fa";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useGetDailyReportsQuery } from "../../redux/Feature/reportApi/reportApi";
const Daily = () => {
  const printRef = useRef();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: dailyData } = useGetDailyReportsQuery({
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
  });
  const userData = dailyData?.data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const columns = [
    {
      title: "#",
      key: "slno",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar
            size={40}
            className="shadow-md"
            src={record?.staffRef?.staffImage}
          />
          <span>{record?.staffRef?.name || "N/A"}</span>
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
      title: "Check In",
      dataIndex: "checkInTime",
      key: "checkInTime",
      render: (text) => (text !== "0" ? text : "N/A"),
    },
    {
      title: "Check Out",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
      render: (text) => (text !== "0" ? text : "N/A"),
    },
    {
      title: "Total Hours",
      dataIndex: "totalWorkedTime",
      key: "totalWorkedTime",
      render: (text) => (text !== "NaNh NaNm" ? text : "N/A"),
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
          options={[
            { value: "Approve", label: "Approve" },
            { value: "Pending", label: "Pending" },
            { value: "Cancelled", label: "Cancelled" },
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
              <FaEye className="text-2xl" />
            </button>
          </Space>
        </ConfigProvider>
      ),
    },
  ];

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
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-10"></div>
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
          total={dailyData?.data?.meta?.total}
          onChange={handlePageChange}
        ></Pagination>
      </div>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        title="Daily Report Submission"
        width={800}
      >
        {selectedUser && (
          <div ref={printRef} className="mt-6 space-y-4">
            <div className="flex justify-end">
              <FaDownload
                className="cursor-pointer"
                size={20}
                onClick={handleDownloadPdf}
                title="Download PDF"
              />
            </div>
            <div>
              <img
                src={selectedUser?.staffRef?.staffImage || "/default.png"}
                className="h-20 w-full border"
                crossOrigin="anonymous"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-bold">
                  Name: {selectedUser?.staffRef?.name || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-bold">
                  Staff ID: {selectedUser?.staffRef?.staffId || "N/A"}
                </p>
              </div>
              <div>
                <p className="font-bold">
                  Additional UserId:{" "}
                  {selectedUser?.staffRef?.additionalUserId || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-bold">
                  Designation: {selectedUser?.staffRef?.designation || "N/A"}
                </p>
              </div>
              <div>
                <p className="font-bold">
                  Rates: {selectedUser?.staffRef?.rates || "N/A"}
                </p>
              </div>
              <div>
                <p className="font-bold">
                  Password: {selectedUser?.staffRef?.password || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-bold">
                  Check-in Time: {selectedUser?.checkInTime || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-bold">
                  Check-out Time: {selectedUser?.checkOutTime || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-bold">
                  Break Time: {selectedUser?.breakTime || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-bold">
                  Total Worked Time: {selectedUser?.totalWorkedTime || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-bold">
                  Job Number: {selectedUser?.jobNumber || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-bold">
                  Job Location: {selectedUser?.jobLocation || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-bold">
                  Travel Time: {selectedUser?.travelTime || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-bold">
                  Mileage Logged: {selectedUser?.mileageLogged || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-bold">
                  Stay Away From Home: {selectedUser?.stayAwayFromHome || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-bold">
                  Wasted Material: {selectedUser?.anyWastedMaterial || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-bold">
                  Expenses Incurred: {selectedUser?.expensesIncurred || "N/A"}
                </p>
              </div>
            </div>

            <div>
              <p className="font-bold">
                Work Description: {selectedUser?.workDescription || "N/A"}
              </p>
            </div>

            <div>
              <p className="font-bold">
                Issues or Delays: {selectedUser?.issueOrDelays || "N/A"}
              </p>
            </div>

            <div>
              <p className="font-bold">
                Additional Notes: {selectedUser?.addAdditionalNotes || "N/A"}
              </p>
            </div>

            <div>
              <p className="font-bold">
                Status: {selectedUser?.status || "N/A"}
              </p>
            </div>
            <div>
              <p className="font-bold">
                urgent:{" "}
                {selectedUser?.urgent === false ? "Not Urgent" : "Urgent"}
              </p>
            </div>
            <div>
              <p className="font-bold">
                isBlocked:{" "}
                {selectedUser?.isBlocked === true ? "Blocked" : "Unblock"}
              </p>
            </div>

            {/* Uploaded Files Section */}
            <div>
              <p className="font-bold">Photo or File Uploaded:</p>
              {selectedUser?.photoOrFileUploaded ? (
                <img
                  src={selectedUser.photoOrFileUploaded}
                  alt="Uploaded file"
                  className="max-w-xs border rounded shadow"
                />
              ) : (
                <p className="text-gray-400 italic">No file uploaded.</p>
              )}
            </div>

            <div>
              <p className="font-bold">Issue or Delays Image:</p>
              {selectedUser?.issueOrDelaysImage ? (
                <img
                  src={selectedUser.issueOrDelaysImage}
                  alt="Issue or Delay"
                  className="max-w-xs border rounded shadow"
                />
              ) : (
                <p className="text-gray-400 italic">No image uploaded.</p>
              )}
            </div>

            <div>
              <p className="font-bold">Expenses Incurred Image:</p>
              {selectedUser?.expensesIncurredImage ? (
                <img
                  src={selectedUser.expensesIncurredImage}
                  alt="Expenses"
                  className="max-w-xs border rounded shadow"
                />
              ) : (
                <p className="text-gray-400 italic">No image uploaded.</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Daily;
