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
import {
  useGetReportsQuery,
  useGetCompaniesQuery,
  useGetClientsByCompanyQuery,
} from "../../redux/Feature/reportApi/reportApi";
import { BASE_URL } from "../../redux/utils/utils";

const { RangePicker } = DatePicker;

// Report views. Daily / Weekly / Monthly are gone — they are now a single
// "All Reports" list that the date-range filter narrows to any period.
const REPORT_TYPES = [
  { key: "reports", label: "All Reports" },
  { key: "client", label: "Client" },
  { key: "productivity", label: "Productivity" },
  { key: "labour", label: "Labour" },
  { key: "cost", label: "Cost" },
];

// Views rendered as a single screenshot of the on-screen table.
const GROUPED = ["client", "labour"];

// Pull a plain number out of free-text fields like "2.5h" or "20".
const toNumber = (val) => {
  if (val === null || val === undefined) return 0;
  const n = parseFloat(String(val).replace(/[^0-9.-]/g, ""));
  return isNaN(n) ? 0 : n;
};

// Plain amount — no currency sign, per the super-admin requirement.
const amt = (n) => (Number(n) || 0).toFixed(2);
const fmtDate = (d) => (d ? dayjs(d).format("DD MMM YYYY") : "N/A");

// Travel/delay time is stored by the app as free text ("2 hours 30 minutes",
// "45 minutes", "1 hour", "0"), and occasionally as "HH:MM" from AI extraction.
// Return the value in decimal hours so it can be summed.
const travelHours = (val) => {
  if (val === null || val === undefined) return 0;
  const s = String(val).trim();
  if (!s || s === "0") return 0;
  const hm = s.match(/^(\d{1,2}):(\d{2})$/);
  if (hm) return parseInt(hm[1], 10) + parseInt(hm[2], 10) / 60;
  const hMatch = s.match(/(\d+(?:\.\d+)?)\s*hour/i);
  const mMatch = s.match(/(\d+)\s*min/i);
  if (hMatch || mMatch) {
    return (hMatch ? parseFloat(hMatch[1]) : 0) + (mMatch ? parseFloat(mMatch[1]) / 60 : 0);
  }
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
};

// Human-friendly hours → "Xh Ym".
const fmtHours = (h) => {
  const totalMin = Math.round((Number(h) || 0) * 60);
  const hh = Math.floor(totalMin / 60);
  const mm = totalMin % 60;
  return mm ? `${hh}h ${mm}m` : `${hh}h`;
};

// Travel cost for one report =
//   staff mileage rate x total miles  +  total travel time x hourly rate.
// The hourly travel rate is the staff's dedicated per-hour travel rate
// (mileageRatePerHour) when set; otherwise it falls back to the working rate.
// The travel rate REPLACES the working rate for travel hours (it is not added
// on top), matching how labour cost now pays travel.
const travelCostForReport = (r) => {
  const staff = r?.staffRef || {};
  const miles = toNumber(r?.mileageLogged);
  const th = travelHours(r?.travelTime);
  const mileageRate = Number(staff.mileageRate) || 0;
  const perHourTravel = Number(staff.mileageRatePerHour) || 0;
  const hourly = perHourTravel > 0 ? perHourTravel : Number(staff.rates) || 0;
  return miles * mileageRate + th * hourly;
};

// Did the staff actually record a delay on this report? (delay time entered,
// a delay reason, or a logged issue/delay).
const reportHasDelay = (r) =>
  travelHours(r?.delayTime) > 0 ||
  Boolean(String(r?.delayReasons || "").trim()) ||
  Boolean(String(r?.issueOrDelays || "").trim());

// The app has no dedicated "additional job number" field — it appends the value
// to the additional-notes text as "Additional job reference: <ref>".
const extractJobRef = (notes) => {
  if (!notes) return null;
  const m = String(notes).match(/Additional job reference:\s*(.+)/i);
  return m ? m[1].trim() : null;
};

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

// One field per row. `block` stacks the value on its own line below the label.
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

// Full per-report detail — used in the modal and the per-report PDF export
// for the All Reports list.
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
      <Row label="Variations" value={r?.variations || extractJobRef(r?.addAdditionalNotes)} block />
      <Row label="Travel Time" value={r?.travelTime} />
      <Row label="Delay / Standing Time" value={r?.delayTime} />
      <Row label="Mileage Logged" value={r?.mileageLogged} />
      <Row label="Stay Away From Home" value={r?.stayAwayFromHome ? "Yes" : "No"} />

      <SectionTitle>Expenses & Cost</SectionTitle>
      <Row label="Travel" value={amt(r?.expenseBreakdown?.travel)} />
      <Row label="Accommodation" value={amt(r?.expenseBreakdown?.accommodation)} />
      <Row label="Subsistence" value={amt(r?.expenseBreakdown?.subsistence)} />
      <Row label="Other" value={amt(r?.expenseBreakdown?.other)} />
      <Row label="Total Expenses" value={amt(r?.expenseTotal)} />
      <Row label="Delay Cost (staff)" value={amt(r?.delayCost)} />
      <Row label="Delay Chargeable (client)" value={amt(r?.delayChargeable)} />
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

// Productivity detail — ONE consolidated report per day per job. Everyone on
// that job that day is added together into a single report (no per-staff pages,
// no client / project number / actual hours / variations / H&S / access /
// weather, per the brief).
const ProductivityDetail = ({ g }) => {
  if (!g) return null;
  return (
    <div className="text-sm bg-white p-2">
      <SectionTitle>Productivity — {fmtDate(g?.date)}</SectionTitle>
      <Row label="Date" value={fmtDate(g?.date)} />
      <Row label="Total Teams" value={g?.totalTeams} />
      <Row label="Total Hours" value={`${(g?.totalHours || 0).toFixed(2)}h`} />

      <SectionTitle>Costs</SectionTitle>
      {/* Travel = staff mileage rate x total miles + total travel time x hourly rate */}
      <Row label="Travel" value={amt(g?.travel)} />
      {/* Subsistence = staff additional stop-out cost */}
      <Row label="Subsistence" value={amt(g?.subsistence)} />
      {/* Other = expenses inputted on the app */}
      <Row label="Other" value={amt(g?.other)} />

      <SectionTitle>Delay</SectionTitle>
      <Row label="Delay" value={g?.hasDelay ? "Yes" : "No"} />
      <Row label="Delay Time" value={g?.delayHours ? fmtHours(g.delayHours) : "N/A"} />
      <Row label="Delay Reasons" value={g?.delayReasons} block />

      <SectionTitle>Notes</SectionTitle>
      <Row label="Additional Notes" value={g?.additionalNotes} block />
      <Row label="Work Completed" value={g?.workCompleted} block />
    </div>
  );
};

// Cost PDF — every parameter totalled into ONE document (not a page per report).
// Shows a line per report plus a bold TOTAL row.
const CostSummary = ({ data, totals, dateRange }) => {
  const th = { border: "1px solid #999", padding: "4px 6px", background: "#f0f0f0", textAlign: "left" };
  const td = { border: "1px solid #ccc", padding: "4px 6px", textAlign: "right" };
  const tdL = { ...td, textAlign: "left" };
  return (
    <div className="bg-white p-4" style={{ width: 1040, fontSize: 11 }}>
      <div className="font-bold text-lg mb-1">Cost Report</div>
      <div className="text-gray-600 mb-3">
        {dateRange?.[0] && dateRange?.[1]
          ? `${fmtDate(dateRange[0])} – ${fmtDate(dateRange[1])}`
          : "All dates"}{" "}
        · {data.length} report(s)
      </div>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={th}>#</th>
            <th style={th}>Date</th>
            <th style={th}>User ID</th>
            <th style={th}>Job No.</th>
            <th style={{ ...th, textAlign: "right" }}>Travel</th>
            <th style={{ ...th, textAlign: "right" }}>Accom.</th>
            <th style={{ ...th, textAlign: "right" }}>Subs.</th>
            <th style={{ ...th, textAlign: "right" }}>Other</th>
            <th style={{ ...th, textAlign: "right" }}>Expenses</th>
            <th style={{ ...th, textAlign: "right" }}>Delay Time</th>
            <th style={{ ...th, textAlign: "right" }}>Delay Cost</th>
            <th style={{ ...th, textAlign: "right" }}>Delay Charge</th>
            <th style={{ ...th, textAlign: "right" }}>Labour</th>
            <th style={{ ...th, textAlign: "right" }}>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={r._id || i}>
              <td style={td}>{i + 1}</td>
              <td style={tdL}>{fmtDate(r?.date)}</td>
              <td style={tdL}>{r?.staffRef?.staffId || "N/A"}</td>
              <td style={tdL}>{r?.job?.jobNumber || r?.jobNumber || "N/A"}</td>
              <td style={td}>{amt(r?.expenseBreakdown?.travel)}</td>
              <td style={td}>{amt(r?.expenseBreakdown?.accommodation)}</td>
              <td style={td}>{amt(r?.expenseBreakdown?.subsistence)}</td>
              <td style={td}>{amt(r?.expenseBreakdown?.other)}</td>
              <td style={td}>{amt(r?.expenseTotal)}</td>
              <td style={td}>{travelHours(r?.delayTime) ? fmtHours(travelHours(r?.delayTime)) : "—"}</td>
              <td style={td}>{amt(r?.delayCost)}</td>
              <td style={td}>{amt(r?.delayChargeable)}</td>
              <td style={td}>{amt(r?.labourCost)}</td>
              <td style={td}>{amt(r?.invoiceCost)}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold", background: "#fafafa" }}>
            <td style={tdL} colSpan={4}>TOTAL ({data.length})</td>
            <td style={td}>{amt(totals.travel)}</td>
            <td style={td}>{amt(totals.accommodation)}</td>
            <td style={td}>{amt(totals.subsistence)}</td>
            <td style={td}>{amt(totals.other)}</td>
            <td style={td}>{amt(totals.expenseTotal)}</td>
            <td style={td}>{fmtHours(totals.delayHours)}</td>
            <td style={td}>{amt(totals.delayCost)}</td>
            <td style={td}>{amt(totals.delayChargeable)}</td>
            <td style={td}>{amt(totals.labourCost)}</td>
            <td style={td}>{amt(totals.invoiceCost)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// Sum every cost parameter across a list of reports.
const sumCost = (list) =>
  (list || []).reduce(
    (a, r) => ({
      travel: a.travel + toNumber(r?.expenseBreakdown?.travel),
      accommodation: a.accommodation + toNumber(r?.expenseBreakdown?.accommodation),
      subsistence: a.subsistence + toNumber(r?.expenseBreakdown?.subsistence),
      other: a.other + toNumber(r?.expenseBreakdown?.other),
      expenseTotal: a.expenseTotal + (Number(r?.expenseTotal) || 0),
      delayHours: a.delayHours + travelHours(r?.delayTime),
      delayCost: a.delayCost + (Number(r?.delayCost) || 0),
      delayChargeable: a.delayChargeable + (Number(r?.delayChargeable) || 0),
      labourCost: a.labourCost + (Number(r?.labourCost) || 0),
      invoiceCost: a.invoiceCost + (Number(r?.invoiceCost) || 0),
    }),
    {
      travel: 0,
      accommodation: 0,
      subsistence: 0,
      other: 0,
      expenseTotal: 0,
      delayHours: 0,
      delayCost: 0,
      delayChargeable: 0,
      labourCost: 0,
      invoiceCost: 0,
    }
  );

const Reports = () => {
  const printRef = useRef();
  const exportRef = useRef();
  const costExportRef = useRef();
  const [reportType, setReportType] = useState("reports");
  const [ownerId, setOwnerId] = useState();
  const [clientId, setClientId] = useState();
  const [jobId, setJobId] = useState();
  const [dateRange, setDateRange] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const [singleDownloading, setSingleDownloading] = useState(false);
  // Cost page: reports the admin ticks to total up (keys = report _id).
  const [costSelectedKeys, setCostSelectedKeys] = useState([]);
  const pageSize = 10;

  // Build query params from the active filters. There is no longer a
  // daily/weekly/monthly default period — the single report list shows
  // everything and the date range narrows it to any period.
  const params = useMemo(() => {
    const p = {};
    if (ownerId) p.ownerId = ownerId;
    if (clientId) p.clientId = clientId;
    if (jobId) p.jobId = jobId;
    if (search) p.search = search;
    if (dateRange?.[0] && dateRange?.[1]) {
      p.dateFrom = dateRange[0].format("YYYY-MM-DD");
      p.dateTo = dateRange[1].format("YYYY-MM-DD");
    }
    return p;
  }, [ownerId, clientId, jobId, search, dateRange]);

  const { data: reportRes, isFetching } = useGetReportsQuery(params);
  const rows = reportRes?.data || [];

  // Companies (owner accounts) for the "Filter by Company" dropdown.
  const { data: companyRes } = useGetCompaniesQuery();
  const companyOptions = useMemo(
    () =>
      (companyRes?.data || []).map((c) => ({
        value: c._id,
        label: c.companyName,
      })),
    [companyRes]
  );

  // Fetch purely to populate the Client / Project dropdowns.
  const { data: allRes } = useGetReportsQuery(ownerId ? { ownerId } : {});

  const { data: companyClientsRes } = useGetClientsByCompanyQuery(ownerId, {
    skip: !ownerId,
  });
  const clientOptions = useMemo(() => {
    if (ownerId) {
      return (companyClientsRes?.data || []).map((c) => ({
        value: c._id,
        label: c.name || c._id,
      }));
    }
    const map = new Map();
    (allRes?.data || []).forEach((r) => {
      const c = r.clientId;
      if (c?._id && !map.has(c._id)) map.set(c._id, c.name || c._id);
    });
    return [...map].map(([value, label]) => ({ value, label }));
  }, [ownerId, companyClientsRes, allRes]);
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

  // --- Productivity: ONE report per day per job, all staff added together ---
  const productivitySummary = useMemo(() => {
    const map = new Map();
    rows.forEach((r) => {
      const day = r?.date ? dayjs(r.date).format("YYYY-MM-DD") : "N/A";
      const jobKey = r?.job?._id || r?.job?.jobNumber || r?.jobNumber || "no-job";
      const key = `${day}|${jobKey}`;
      const cur =
        map.get(key) ||
        {
          key,
          date: r?.date,
          staffSet: new Set(),
          totalHours: 0,
          travel: 0,
          subsistence: 0,
          other: 0,
          delayHours: 0,
          hasDelay: false,
          delayReasons: [],
          additionalNotes: [],
          workCompleted: [],
        };
      const sid = r?.staffRef?.staffId;
      if (sid) cur.staffSet.add(sid);
      (Array.isArray(r?.additionalUserId) ? r.additionalUserId : []).forEach((id) =>
        cur.staffSet.add(id)
      );
      cur.totalHours += Number(r?.workedHours) || 0;
      cur.travel += travelCostForReport(r);
      cur.subsistence += Number(r?.staffRef?.additionalStopOutCost) || 0;
      cur.other += toNumber(r?.expenseBreakdown?.other);
      cur.delayHours += travelHours(r?.delayTime);
      if (reportHasDelay(r)) cur.hasDelay = true;
      if (String(r?.delayReasons || "").trim()) cur.delayReasons.push(r.delayReasons.trim());
      if (String(r?.addAdditionalNotes || "").trim())
        cur.additionalNotes.push(r.addAdditionalNotes.trim());
      if (String(r?.workDescription || "").trim())
        cur.workCompleted.push(
          `${sid ? `[${sid}] ` : ""}${r.workDescription.trim()}`
        );
      map.set(key, cur);
    });
    return [...map.values()].map((g) => ({
      ...g,
      totalTeams: g.staffSet.size,
      delayReasons: g.delayReasons.join("\n"),
      additionalNotes: g.additionalNotes.join("\n"),
      workCompleted: g.workCompleted.join("\n\n"),
    }));
  }, [rows]);

  const productivityColumns = [
    colIndex,
    colDate,
    { title: "Total Teams", key: "teams", render: (_, g) => g?.totalTeams ?? 0 },
    { title: "Total Hours", key: "hours", render: (_, g) => `${(g?.totalHours || 0).toFixed(2)}h` },
    { title: "Travel", key: "travel", render: (_, g) => amt(g?.travel) },
    { title: "Subsistence", key: "subs", render: (_, g) => amt(g?.subsistence) },
    { title: "Other", key: "other", render: (_, g) => amt(g?.other) },
    { title: "Delay", key: "delay", render: (_, g) => (g?.hasDelay ? "Yes" : "No") },
    { title: "Delay Time", key: "delayTime", render: (_, g) => (g?.delayHours ? fmtHours(g.delayHours) : "—") },
    {
      title: "Delay Reasons",
      key: "delayReasons",
      render: (_, g) => (
        <div className="max-w-xs whitespace-pre-wrap break-words">{g?.delayReasons || "—"}</div>
      ),
    },
    {
      title: "Additional Notes",
      key: "notes",
      render: (_, g) => (
        <div className="max-w-xs whitespace-pre-wrap break-words">{g?.additionalNotes || "—"}</div>
      ),
    },
    colView,
  ];

  const costColumns = [
    colIndex, colDate, colUserId, colProject,
    { title: "Travel", key: "travel", render: (_, r) => amt(r?.expenseBreakdown?.travel) },
    { title: "Accommodation", key: "accom", render: (_, r) => amt(r?.expenseBreakdown?.accommodation) },
    { title: "Subsistence", key: "subs", render: (_, r) => amt(r?.expenseBreakdown?.subsistence) },
    { title: "Other", key: "other", render: (_, r) => amt(r?.expenseBreakdown?.other) },
    { title: "Expenses Total", key: "total", render: (_, r) => amt(r?.expenseTotal) },
    { title: "Delay Time", key: "delayTime", render: (_, r) => (travelHours(r?.delayTime) ? fmtHours(travelHours(r?.delayTime)) : "—") },
    { title: "Delay Labour Cost", key: "delayCost", render: (_, r) => amt(r?.delayCost) },
    { title: "Delay Chargeable", key: "delayChargeable", render: (_, r) => amt(r?.delayChargeable) },
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
      const cur = map.get(id) || { userId: id, trade: r?.staffRef?.designation || "N/A", reports: 0, hours: 0, overtime: 0, travel: 0, delay: 0, mileage: 0, expenses: 0, labour: 0 };
      cur.reports += 1;
      cur.hours += Number(r?.workedHours) || 0;
      cur.overtime += toNumber(r?.overtimeHours);
      cur.travel += travelHours(r?.travelTime);
      cur.delay += travelHours(r?.delayTime);
      cur.mileage += toNumber(r?.mileageLogged);
      cur.expenses += Number(r?.expenseTotal) || 0;
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
    { title: "Total Travel Time", key: "travel", render: (_, r) => fmtHours(r.travel) },
    { title: "Total Delay Time", key: "delay", render: (_, r) => fmtHours(r.delay) },
    { title: "Mileage Booked", key: "mileage", render: (_, r) => r.mileage.toFixed(2) },
    { title: "Total Expenses", key: "expenses", render: (_, r) => amt(r.expenses) },
    { title: "Labour Cost", key: "labour", render: (_, r) => amt(r.labour) },
  ];

  const { columns, dataSource } = useMemo(() => {
    switch (reportType) {
      case "client":
        return { columns: clientColumns, dataSource: clientSummary };
      case "labour":
        return { columns: labourColumns, dataSource: labourSummary };
      case "productivity":
        return { columns: productivityColumns, dataSource: productivitySummary };
      case "cost":
        return { columns: costColumns, dataSource: rows };
      default:
        return { columns: listColumns, dataSource: rows };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType, rows, clientSummary, labourSummary, productivitySummary]);

  // Cost totals — sum ONLY the reports ticked on the cost table.
  const costTotals = useMemo(
    () => sumCost(rows.filter((r) => costSelectedKeys.includes(r._id))),
    [rows, costSelectedKeys]
  );

  // Reports feeding the single cost PDF: the ticked ones, or all if none ticked.
  const costPdfRows = useMemo(() => {
    const ticked = rows.filter((r) => costSelectedKeys.includes(r._id));
    return ticked.length ? ticked : rows;
  }, [rows, costSelectedKeys]);
  const costPdfTotals = useMemo(() => sumCost(costPdfRows), [costPdfRows]);

  // Views that export one detailed page per report (All Reports + Productivity).
  const isPerReportPdf = !GROUPED.includes(reportType) && reportType !== "cost";

  // Rows on the page currently shown — these are what the detailed PDF exports.
  const pageRows = useMemo(
    () => dataSource.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [dataSource, currentPage]
  );

  // Add a (possibly tall) node onto the PDF, slicing it across pages so nothing
  // is squashed.
  const addNodePaged = async (pdf, node, margin = 10) => {
    const canvas = await html2canvas(node, { scale: 2, useCORS: true });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const usableWidth = pdfWidth - margin * 2;
    const usableHeight = pdfHeight - margin * 2;
    const pxPerMm = canvas.width / usableWidth;
    const pageHeightPx = usableHeight * pxPerMm;
    let rendered = 0;
    let first = true;
    while (rendered < canvas.height) {
      const slicePx = Math.min(pageHeightPx, canvas.height - rendered);
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = slicePx;
      const ctx = pageCanvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(canvas, 0, rendered, canvas.width, slicePx, 0, 0, canvas.width, slicePx);
      const imgData = pageCanvas.toDataURL("image/png");
      if (!first) pdf.addPage();
      pdf.addImage(imgData, "PNG", margin, margin, usableWidth, slicePx / pxPerMm);
      rendered += slicePx;
      first = false;
    }
  };

  const handleDownloadPdf = async () => {
    if (downloading) return;
    setDownloading(true);
    const hide = message.loading("Generating PDF, please wait…", 0);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const margin = 10;

      // Grouped tables (client / labour) → screenshot the on-screen table.
      if (GROUPED.includes(reportType)) {
        if (!printRef.current) return;
        await addNodePaged(pdf, printRef.current, margin);
        pdf.save(`${reportType}-report.pdf`);
        return;
      }

      // Cost → one PDF with every parameter totalled up (not a page per report).
      if (reportType === "cost") {
        if (!costExportRef.current) return;
        await addNodePaged(pdf, costExportRef.current, margin);
        pdf.save("cost-report.pdf");
        return;
      }

      // All Reports + Productivity → one detailed page per report on this page.
      const nodes = exportRef.current?.querySelectorAll(".pdf-report");
      if (!nodes || !nodes.length) {
        message.info("No reports to download on this page.");
        return;
      }
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const usableWidth = pdfWidth - margin * 2;
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
    setOwnerId(undefined);
    setClientId(undefined);
    setJobId(undefined);
    setDateRange(null);
    setSearch("");
  };

  // Reset to page 1 (and clear cost ticks) whenever the data set changes.
  useEffect(() => {
    setCurrentPage(1);
    setCostSelectedKeys([]);
  }, [reportType, ownerId, clientId, jobId, dateRange, search]);

  const costLabelBox = (label, value) => (
    <div key={label} className="px-3 py-2 rounded-md bg-gray-100 border">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );

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

      {/* Filters: Company / Client / Project / Date range / Search */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select allowClear showSearch optionFilterProp="label" placeholder="Filter by Company"
          style={{ minWidth: 200 }} value={ownerId}
          onChange={(v) => {
            setOwnerId(v);
            setClientId(undefined);
            setJobId(undefined);
          }}
          options={companyOptions} />
        <Select allowClear showSearch optionFilterProp="label" placeholder="Filter by Client"
          style={{ minWidth: 180 }} value={clientId} onChange={setClientId} options={clientOptions} />
        <Select allowClear showSearch optionFilterProp="label" placeholder="Filter by Project"
          style={{ minWidth: 180 }} value={jobId} onChange={setJobId} options={projectOptions} />
        <RangePicker value={dateRange} onChange={setDateRange} />
        <Input allowClear placeholder="Search User ID / Role" style={{ width: 200 }}
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={resetFilters} className="px-3 py-1 border rounded text-sm">Reset</button>
      </div>

      {/* Cost page: totals for every parameter across the ticked reports. */}
      {reportType === "cost" && (
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-2">
            Tick reports to total their costs. {costSelectedKeys.length} report(s) selected.
          </div>
          <div className="flex flex-wrap gap-2">
            {costLabelBox("Travel", amt(costTotals.travel))}
            {costLabelBox("Accommodation", amt(costTotals.accommodation))}
            {costLabelBox("Subsistence", amt(costTotals.subsistence))}
            {costLabelBox("Other", amt(costTotals.other))}
            {costLabelBox("Expenses Total", amt(costTotals.expenseTotal))}
            {costLabelBox("Delay Time", fmtHours(costTotals.delayHours))}
            {costLabelBox("Delay Labour Cost", amt(costTotals.delayCost))}
            {costLabelBox("Delay Chargeable", amt(costTotals.delayChargeable))}
            {costLabelBox("Labour Cost", amt(costTotals.labourCost))}
            {costLabelBox("Invoice Cost", amt(costTotals.invoiceCost))}
          </div>
        </div>
      )}

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
              title={reportType === "cost" ? "Download totalled cost PDF" : "Download detailed PDF (current page)"}
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
            rowKey={(r) => r._id || r.key || r.userId || r.client}
            rowSelection={
              reportType === "cost"
                ? { selectedRowKeys: costSelectedKeys, onChange: setCostSelectedKeys }
                : undefined
            }
            expandable={
              reportType === "productivity"
                ? {
                    // "Work completed" opens up on the page instead of cluttering
                    // the row.
                    expandedRowRender: (g) => (
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="font-semibold mb-1">Work Completed</div>
                        <div className="whitespace-pre-wrap break-words">
                          {g?.workCompleted || "—"}
                        </div>
                      </div>
                    ),
                    rowExpandable: () => true,
                  }
                : undefined
            }
          />
        </ConfigProvider>
      </div>

      {/* Off-screen detailed render of the current page — source for the
          per-report PDF (All Reports + Productivity). */}
      {isPerReportPdf && (
        <div style={{ position: "absolute", left: -99999, top: 0, width: 760 }} ref={exportRef}>
          {pageRows.map((r) => (
            <div key={r._id || r.key} className="pdf-report" style={{ width: 760 }}>
              {reportType === "productivity" ? (
                <ProductivityDetail g={r} />
              ) : (
                <ReportDetail r={r} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Off-screen cost summary — source for the single totalled cost PDF. */}
      {reportType === "cost" && (
        <div style={{ position: "absolute", left: -99999, top: 0 }} ref={costExportRef}>
          <CostSummary data={costPdfRows} totals={costPdfTotals} dateRange={dateRange} />
        </div>
      )}

      <Modal open={isModalOpen} onCancel={handleCancel} footer={null} title="Report Detail" width={720}>
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
                    pdf.save(
                      `report-${selected?.staffRef?.staffId || (selected?.date ? dayjs(selected.date).format("YYYY-MM-DD") : "detail")}.pdf`
                    );
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
              {reportType === "productivity" ? (
                <ProductivityDetail g={selected} />
              ) : (
                <ReportDetail r={selected} />
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Reports;
