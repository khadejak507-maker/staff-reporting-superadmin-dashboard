/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ConfigProvider,
  DatePicker,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  message,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { FaDownload, FaEye } from "react-icons/fa";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useGetReportsQuery } from "../../redux/Feature/reportApi/reportApi";
import { BASE_URL } from "../../redux/utils/utils";

const { RangePicker } = DatePicker;

// Report views requested in the Forma brief.
const REPORT_TYPES = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "client", label: "Client" },
  { key: "productivity", label: "Productivity" },
  { key: "labour", label: "Labour" },
  { key: "cost", label: "Cost" },
];

const GROUPED = ["client", "labour"];

// Pull a plain number out of free-text fields like "2.5h" or "20".
const toNumber = (val) => {
  if (val === null || val === undefined) return 0;
  const n = parseFloat(String(val).replace(/[^0-9.\-]/g, ""));
  return isNaN(n) ? 0 : n;
};

// Plain amount — no currency sign, per the super-admin requirement.
const amt = (n) => (Number(n) || 0).toFixed(2);
const fmtDate = (d) => (d ? dayjs(d).format("DD MMM YYYY") : "N/A");

// Handles PDF uploads as a link, images inline.
const FilePreview = ({ url, label }) => {
  if (!url) return <span className="text-gray-400 italic">No file uploaded.</span>;
  const full = `${BASE_URL}${url}`;
  if (url.toLowerCase().endsWith(".pdf")) {
    return (
      <a href={full} target="_blank" rel="noreferrer" className="text-blue-600 underline">
        View PDF
      </a>
    );
  }
  return <img src={full} alt={label} className="max-w-xs border rounded shadow" />;
};

// One field per row. `block` stacks the value on its own line below the
// label (used for long free-text fields like notes / progress).
const Row = ({ label, value, block }) => {
  const display =
    value === undefined || value === null || value === "" ? "N/A" : value;
  return (
    <div className="py-1 border-b border-gray-100">
      {block ? (
        <>
          <div className="font-semibold">{label}:</div>
          <div className="whitespace-pre-wrap break-words">{display}</div>
        </>
      ) : (
        <>
          <span className="font-semibold">{label}:</span>{" "}
          <span>{display}</span>
        </>
      )}
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <div className="font-bold text-base mt-4 mb-1 pt-2 border-t-2 border-gray-300">
    {children}
  </div>
);

// Reusable detail view — used both in the modal and in the PDF export.
// Every field is on a separate line.
const ReportDetail = ({ r }) => {
  if (!r) return null;
  return (
    <div className="text-sm bg-white p-2">
      <SectionTitle>Project & Labour</SectionTitle>
      <Row label="User ID" value={r?.staffRef?.staffId} />
      <Row label="Trade/Role" value={r?.staffRef?.designation} />
      <Row label="Date" value={fmtDate(r?.date)} />
      <Row label="Client" value={r?.clientId?.name} />
      <Row label="Project / Job No." value={r?.job?.jobNumber || r?.jobNumber} />
      <Row label="Site Location" value={r?.jobLocation} />
      <Row label="Check-in" value={r?.checkInTime} />
      <Row label="Check-out" value={r?.checkOutTime} />
      <Row label="Break" value={r?.breakTime} />
      <Row label="Hours Worked" value={r?.totalWorkedTime} />
      <Row label="Overtime Hours" value={r?.overtimeHours || "0"} />
      <Row label="Team Size" value={r?.teamSize ?? 1} />

      <SectionTitle>Commercial</SectionTitle>
      <Row label="Approved Hours" value={r?.approvedHours} />
      <Row label="Actual Hours" value={r?.workedHours != null ? `${r.workedHours}h` : null} />
      <Row label="Variations" value={r?.variations} block />
      <Row label="Travel Time" value={r?.travelTime} />
      <Row label="Mileage Logged" value={r?.mileageLogged} />
      <Row label="Stay Away From Home" value={r?.stayAwayFromHome ? "Yes" : "No"} />

      <SectionTitle>Expenses & Cost</SectionTitle>
      <Row label="Travel" value={amt(r?.expenseBreakdown?.travel)} />
      <Row label="Accommodation" value={amt(r?.expenseBreakdown?.accommodation)} />
      <Row label="Subsistence" value={amt(r?.expenseBreakdown?.subsistence)} />
      <Row label="Other" value={amt(r?.expenseBreakdown?.other)} />
      <Row label="Total Expenses" value={amt(r?.expenseTotal)} />
      <Row label="Labour Cost" value={amt(r?.labourCost)} />
      <Row label="Invoice Cost" value={amt(r?.invoiceCost)} />

      <SectionTitle>Site Notes</SectionTitle>
      <Row label="Daily Progress" value={r?.workDescription} block />
      <Row label="Health & Safety" value={r?.healthSafetyNotes} block />
      <Row
        label="Material Issues"
        value={r?.materialIssues || (r?.anyWastedMaterial ? "Yes" : null)}
        block
      />
      <Row label="Access Issues" value={r?.accessIssues} block />
      <Row label="Weather" value={r?.weather} />
      <Row label="Delays" value={r?.issueOrDelays} block />
      <Row label="Delay Reasons" value={r?.delayReasons} block />
      <Row label="Additional Notes" value={r?.addAdditionalNotes} block />

      <SectionTitle>Uploads</SectionTitle>
      <Row label="Photo / File" value={<FilePreview url={r?.photoOrFileUploaded} label="file" />} />
      <Row label="Issue or Delays File" value={<FilePreview url={r?.issueOrDelaysImage} label="issue" />} />
      <Row label="Expenses File" value={<FilePreview url={r?.expensesIncurredImage} label="expense" />} />
    </div>
  );
};

const Reports = () => {
  const printRef = useRef();
  const exportRef = useRef();
  const [reportType, setReportType] = useState("daily");
  const [clientId, setClientId] = useState();
  const [jobId, setJobId] = useState();
  const [dateRange, setDateRange] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const [singleDownloading, setSingleDownloading] = useState(false);
  const pageSize = 10;

  // Build query params from the active filters + the report's default period.
  const params = useMemo(() => {
    const p = {};
    if (clientId) p.clientId = clientId;
    if (jobId) p.jobId = jobId;
    if (search) p.search = search;

    if (dateRange?.[0] && dateRange?.[1]) {
      p.dateFrom = dateRange[0].format("YYYY-MM-DD");
      p.dateTo = dateRange[1].format("YYYY-MM-DD");
    } else if (reportType === "daily") {
      p.date = dayjs().format("YYYY-MM-DD");
    } else if (reportType === "weekly") {
      p.week = true;
    } else {
      // Monthly + analytic reports default to the last 30 days unless a range
      // is chosen.
      p.month = true;
    }
    return p;
  }, [reportType, clientId, jobId, search, dateRange]);

  const { data: reportRes, isFetching } = useGetReportsQuery(params);
  const rows = reportRes?.data || [];

  // Unfiltered fetch purely to populate the Client / Project dropdowns.
  const { data: allRes } = useGetReportsQuery({});
  const clientOptions = useMemo(() => {
    const map = new Map();
    (allRes?.data || []).forEach((r) => {
      const c = r.clientId;
      if (c?._id && !map.has(c._id)) map.set(c._id, c.name || c._id);
    });
    return [...map].map(([value, label]) => ({ value, label }));
  }, [allRes]);
  const projectOptions = useMemo(() => {
    const map = new Map();
    (allRes?.data || []).forEach((r) => {
      const j = r.job;
      if (j?._id && !map.has(j._id)) map.set(j._id, j.jobNumber || j._id);
    });
    return [...map].map(([value, label]) => ({ value, label }));
  }, [allRes]);

  const showModal = (record) => {
    setSelected(record);
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelected(null);
  };

  // --- Common columns (anonymous: User ID only, never names) ---
  const colIndex = { title: "#", key: "slno", render: (_t, _r, i) => i + 1 };
  const colUserId = { title: "User ID", key: "userId", render: (_, r) => r?.staffRef?.staffId || "N/A" };
  const colTrade = { title: "Trade/Role", key: "trade", render: (_, r) => r?.staffRef?.designation || "N/A" };
  const colDate = { title: "Date", key: "date", render: (_, r) => fmtDate(r?.date) };
  const colClient = { title: "Client", key: "client", render: (_, r) => r?.clientId?.name || "N/A" };
  const colProject = { title: "Project / Job No.", key: "project", render: (_, r) => r?.job?.jobNumber || r?.jobNumber || "N/A" };
  const colSite = { title: "Site Location", key: "site", render: (_, r) => r?.jobLocation || "N/A" };
  const colView = {
    title: "View",
    key: "view",
    render: (_, r) => (
      <Space size="middle">
        <button onClick={() => showModal(r)}>
          <FaEye className="text-2xl" />
        </button>
      </Space>
    ),
  };

  const listColumns = [
    colIndex, colDate, colUserId, colTrade, colClient, colProject, colSite,
    {
      title: "Hours Worked",
      key: "hours",
      render: (_, r) =>
        r?.totalWorkedTime && r.totalWorkedTime !== "NaNh NaNm" ? r.totalWorkedTime : "N/A",
    },
    { title: "Overtime", key: "ot", render: (_, r) => r?.overtimeHours || "0" },
    { title: "Team Size", key: "team", render: (_, r) => r?.teamSize ?? 1 },
    colView,
  ];

  const productivityColumns = [
    colIndex, colDate, colUserId, colProject,
    { title: "Approved Hours", key: "approved", render: (_, r) => r?.approvedHours || "N/A" },
    { title: "Actual Hours", key: "actual", render: (_, r) => (r?.workedHours != null ? `${r.workedHours}h` : "N/A") },
    {
      title: "Variance",
      key: "variance",
      render: (_, r) => {
        const approved = toNumber(r?.approvedHours);
        const actual = Number(r?.workedHours) || 0;
        if (!approved) return "N/A";
        return `${(actual - approved).toFixed(2)}h`;
      },
    },
    { title: "Variations", key: "variations", render: (_, r) => r?.variations || "—" },
    { title: "Delays", key: "delays", render: (_, r) => r?.issueOrDelays || "—" },
    { title: "Delay Reasons", key: "delayReasons", render: (_, r) => r?.delayReasons || "—" },
    colView,
  ];

  const costColumns = [
    colIndex, colDate, colUserId, colProject,
    { title: "Travel", key: "travel", render: (_, r) => amt(r?.expenseBreakdown?.travel) },
    { title: "Accommodation", key: "accom", render: (_, r) => amt(r?.expenseBreakdown?.accommodation) },
    { title: "Subsistence", key: "subs", render: (_, r) => amt(r?.expenseBreakdown?.subsistence) },
    { title: "Other", key: "other", render: (_, r) => amt(r?.expenseBreakdown?.other) },
    { title: "Expenses Total", key: "total", render: (_, r) => amt(r?.expenseTotal) },
    { title: "Labour Cost", key: "labour", render: (_, r) => <strong>{amt(r?.labourCost)}</strong> },
    { title: "Invoice Cost", key: "invoice", render: (_, r) => <strong>{amt(r?.invoiceCost)}</strong> },
    colView,
  ];

  // --- Grouped (aggregate) data + columns ---
  const clientSummary = useMemo(() => {
    const map = new Map();
    rows.forEach((r) => {
      const name = r?.clientId?.name || "Unassigned";
      const cur = map.get(name) || { client: name, reports: 0, hours: 0, overtime: 0, expenses: 0, labour: 0, invoice: 0 };
      cur.reports += 1;
      cur.hours += Number(r?.workedHours) || 0;
      cur.overtime += toNumber(r?.overtimeHours);
      cur.expenses += Number(r?.expenseTotal) || 0;
      cur.labour += Number(r?.labourCost) || 0;
      cur.invoice += Number(r?.invoiceCost) || 0;
      map.set(name, cur);
    });
    return [...map.values()];
  }, [rows]);

  const clientColumns = [
    colIndex,
    { title: "Client", dataIndex: "client", key: "client" },
    { title: "Reports", dataIndex: "reports", key: "reports" },
    { title: "Total Hours", key: "hours", render: (_, r) => `${r.hours.toFixed(2)}h` },
    { title: "Overtime", key: "ot", render: (_, r) => `${r.overtime.toFixed(2)}h` },
    { title: "Total Expenses", key: "exp", render: (_, r) => amt(r.expenses) },
    { title: "Labour Cost", key: "labour", render: (_, r) => amt(r.labour) },
    { title: "Invoice Cost", key: "invoice", render: (_, r) => amt(r.invoice) },
  ];

  const labourSummary = useMemo(() => {
    const map = new Map();
    rows.forEach((r) => {
      const id = r?.staffRef?.staffId || "N/A";
      const cur = map.get(id) || { userId: id, trade: r?.staffRef?.designation || "N/A", reports: 0, hours: 0, overtime: 0, labour: 0 };
      cur.reports += 1;
      cur.hours += Number(r?.workedHours) || 0;
      cur.overtime += toNumber(r?.overtimeHours);
      cur.labour += Number(r?.labourCost) || 0;
      map.set(id, cur);
    });
    return [...map.values()];
  }, [rows]);

  const labourColumns = [
    colIndex,
    { title: "User ID", dataIndex: "userId", key: "userId" },
    { title: "Trade/Role", dataIndex: "trade", key: "trade" },
    { title: "Reports", dataIndex: "reports", key: "reports" },
    { title: "Total Hours", key: "hours", render: (_, r) => `${r.hours.toFixed(2)}h` },
    { title: "Overtime Hours", key: "ot", render: (_, r) => `${r.overtime.toFixed(2)}h` },
    { title: "Labour Cost", key: "labour", render: (_, r) => amt(r.labour) },
  ];

  const { columns, dataSource } = useMemo(() => {
    switch (reportType) {
      case "client":
        return { columns: clientColumns, dataSource: clientSummary };
      case "labour":
        return { columns: labourColumns, dataSource: labourSummary };
      case "productivity":
        return { columns: productivityColumns, dataSource: rows };
      case "cost":
        return { columns: costColumns, dataSource: rows };
      default:
        return { columns: listColumns, dataSource: rows };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType, rows, clientSummary, labourSummary]);

  // Rows on the page currently shown — these are what the detailed PDF exports.
  const pageRows = useMemo(
    () => dataSource.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [dataSource, currentPage]
  );

  // Detailed PDF: one report's full "view" info per page, for the current page.
  // Grouped reports (client/labour) have no per-report detail, so they export
  // the visible table instead.
  const handleDownloadPdf = async () => {
    if (downloading) return;
    setDownloading(true);
    const hide = message.loading("Generating PDF, please wait…", 0);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const usableWidth = pdfWidth - margin * 2;

      if (GROUPED.includes(reportType)) {
        if (!printRef.current) return;
        const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * usableWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", margin, margin, usableWidth, imgHeight);
        pdf.save(`${reportType}-report.pdf`);
        return;
      }

      const nodes = exportRef.current?.querySelectorAll(".pdf-report");
      if (!nodes || !nodes.length) {
        message.info("No reports to download on this page.");
        return;
      }
      const pageHeight = pdf.internal.pageSize.getHeight();
      for (let i = 0; i < nodes.length; i++) {
        const canvas = await html2canvas(nodes[i], { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");
        const imgProps = pdf.getImageProperties(imgData);
        let imgHeight = (imgProps.height * usableWidth) / imgProps.width;
        const maxHeight = pageHeight - margin * 2;
        if (imgHeight > maxHeight) imgHeight = maxHeight;
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, margin, usableWidth, imgHeight);
      }
      pdf.save(`${reportType}-report-page-${currentPage}.pdf`);
    } catch (error) {
      console.error("PDF generation failed", error);
      message.error("Could not generate the PDF. Please try again.");
    } finally {
      hide();
      setDownloading(false);
    }
  };

  const [primaryColor, setPrimaryColor] = useState("#d51920");
  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const cssPrimaryColor = rootStyles.getPropertyValue("--color-primary").trim();
    setPrimaryColor(cssPrimaryColor || "#3b19d5");
  }, []);

  const resetFilters = () => {
    setClientId(undefined);
    setJobId(undefined);
    setDateRange(null);
    setSearch("");
  };

  // Reset to page 1 whenever the data set changes.
  useEffect(() => setCurrentPage(1), [reportType, clientId, jobId, dateRange, search]);

  return (
    <div>
      {/* Report type tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-primary rounded-md p-1 mb-5">
        {REPORT_TYPES.map((t) => (
          <button
            key={t.key}
            onClick={() => setReportType(t.key)}
            className={`px-3 py-2 rounded-md text-sm ${
              reportType === t.key ? "bg-white text-primary font-semibold" : "text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters: Client / Project / Date (per the brief) */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select allowClear showSearch optionFilterProp="label" placeholder="Filter by Client"
          style={{ minWidth: 180 }} value={clientId} onChange={setClientId} options={clientOptions} />
        <Select allowClear showSearch optionFilterProp="label" placeholder="Filter by Project"
          style={{ minWidth: 180 }} value={jobId} onChange={setJobId} options={projectOptions} />
        <RangePicker value={dateRange} onChange={setDateRange} />
        <Input allowClear placeholder="Search User ID / Role" style={{ width: 200 }}
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={resetFilters} className="px-3 py-1 border rounded text-sm">Reset</button>
      </div>

      <div ref={printRef} className="overflow-x-auto">
        <ConfigProvider
          theme={{
            token: { colorPrimary: primaryColor },
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
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm text-gray-500">{dataSource.length} record(s)</span>
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              title="Download detailed PDF (current page)"
              className={`flex items-center gap-2 text-sm ${
                downloading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {downloading ? (
                <>
                  <Spin indicator={<LoadingOutlined spin />} size="small" />
                  <span>Generating…</span>
                </>
              ) : (
                <FaDownload />
              )}
            </button>
          </div>
          <Table
            columns={columns}
            dataSource={dataSource}
            loading={isFetching}
            pagination={{ pageSize, current: currentPage, onChange: setCurrentPage }}
            rowKey={(r) => r._id || r.userId || r.client}
          />
        </ConfigProvider>
      </div>

      {/* Off-screen detailed render of the current page — source for the PDF. */}
      {!GROUPED.includes(reportType) && (
        <div style={{ position: "absolute", left: -99999, top: 0, width: 760 }} ref={exportRef}>
          {pageRows.map((r) => (
            <div key={r._id} className="pdf-report" style={{ width: 760 }}>
              <ReportDetail r={r} />
            </div>
          ))}
        </div>
      )}

      <Modal open={isModalOpen} onCancel={handleCancel} footer={null} title="Daily Report Detail" width={720}>
        {selected && (
          <div className="mt-2">
            <div className="flex justify-end mb-2">
              <button
                disabled={singleDownloading}
                title="Download this report"
                className={`flex items-center gap-2 text-sm ${
                  singleDownloading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={async () => {
                  if (singleDownloading) return;
                  setSingleDownloading(true);
                  const hide = message.loading("Generating PDF, please wait…", 0);
                  try {
                    const node = document.getElementById("single-report-detail");
                    if (!node) return;
                    const canvas = await html2canvas(node, { scale: 2, useCORS: true });
                    const imgData = canvas.toDataURL("image/png");
                    const pdf = new jsPDF("p", "mm", "a4");
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const margin = 10;
                    const usableWidth = pdfWidth - margin * 2;
                    const imgProps = pdf.getImageProperties(imgData);
                    const imgHeight = (imgProps.height * usableWidth) / imgProps.width;
                    pdf.addImage(imgData, "PNG", margin, margin, usableWidth, imgHeight);
                    pdf.save(`report-${selected?.staffRef?.staffId || "detail"}.pdf`);
                  } catch (error) {
                    console.error("PDF generation failed", error);
                    message.error("Could not generate the PDF. Please try again.");
                  } finally {
                    hide();
                    setSingleDownloading(false);
                  }
                }}
              >
                {singleDownloading ? (
                  <>
                    <Spin indicator={<LoadingOutlined spin />} size="small" />
                    <span>Generating…</span>
                  </>
                ) : (
                  <FaDownload size={18} />
                )}
              </button>
            </div>
            <div id="single-report-detail">
              <ReportDetail r={selected} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Reports;
