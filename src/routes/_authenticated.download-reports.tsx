import { createFileRoute } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { downloadSelfReport, downloadAllReports } from "@/lib/api/api";
import PageHeader from "@/components/lms/PageHeader";

export const Route = createFileRoute("/_authenticated/download-reports")({
  head: () => ({ meta: [{ title: "Download Reports — LMS" }] }),
  component: DownloadReportsPage,
});

function DownloadReportsPage() {
  const handleDownload = async (type: "self" | "all") => {
    try {
      const response = type === "all" ? await downloadAllReports() : await downloadSelfReport();
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const disposition = response.headers["content-disposition"] as string | undefined;
      let filename = type === "all" ? "all_reports.xlsx" : "my_report.xlsx";
      if (disposition) {
        const m = disposition.match(/filename="?([^"]+)"?/);
        if (m && m[1]) filename = m[1];
      }
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Download failed");
    }
  };

  return (
    <div className="reports-page">
      <PageHeader title="Download Reports" description="Generate and download LMS reports." />
      <div className="reports-grid">
        <div className="report-card">
          <h3>My Report</h3>
          <p>Download your attendance, leave, complaints and personal LMS data.</p>
          <button className="excel-btn" onClick={() => handleDownload("self")}>Download Report</button>
        </div>
        <div className="report-card">
          <h3>Complete LMS Report</h3>
          <p>Download complete employee, leave, attendance and complaint data.</p>
          <button className="excel-btn" onClick={() => handleDownload("all")}>Download All Reports</button>
        </div>
      </div>
    </div>
  );
}