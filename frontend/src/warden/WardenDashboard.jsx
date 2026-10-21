import { useState, useEffect, useCallback } from "react";
import WardenLayout from "./WardenLayout.jsx";
import DashboardHeader from "./DashboardHeader.jsx";
import ComplaintSummary from "./ComplaintSummary.jsx";
import SlaOverview from "./SlaOverview.jsx";
import OperationalInsight from "./OperationalInsight.jsx";
import WardenComplaintDetailModal from "./WardenComplaintDetailModal.jsx";
import { Link } from "../router.jsx";
import { api } from "../api/client.js";

const normalizeComplaint = (item) => {
  if (!item) return null;
  if (item.complaint) {
    return {
      ...item.complaint,
      resolvedBy: item.solvedBy || item.complaint.resolvedBy,
      resolvedByModel: item.complaint.resolvedByModel || (item.solvedBy?.staffName ? "SubAdmin" : "Admin"),
    };
  }
  return item;
};

const normalizeList = (list) => {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeComplaint).filter(Boolean);
};

export default function WardenDashboard() {
  const [todayList, setTodayList] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [resolvingComplaint, setResolvingComplaint] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [todayRes, pendingRes, completedRes] = await Promise.allSettled([
        api.subadmin.todayComplaints(),
        api.subadmin.pendingComplaints(),
        api.subadmin.completedComplaints(),
      ]);

      if (todayRes.status === "fulfilled" && todayRes.value?.complaints) {
        setTodayList(normalizeList(todayRes.value.complaints));
      }
      if (pendingRes.status === "fulfilled" && pendingRes.value?.complaints) {
        setPendingList(normalizeList(pendingRes.value.complaints));
      }
      if (completedRes.status === "fulfilled" && completedRes.value?.complaints) {
        setCompletedList(normalizeList(completedRes.value.complaints));
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to fetch warden dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const summary = {
    total: pendingList.length + completedList.length,
    pending: pendingList.length,
    inProgress: todayList.length,
    resolved: completedList.length,
  };

  const hostelHealth = {
    mostReported: "Electrical & Plumbing",
    worstHotspot: "Hostel B & Flank A",
    avgResolution: "2h 45m",
    slaCompliance: "96.4%",
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diffMin = Math.round((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diffMin < 60) return `${diffMin} min`;
    const diffHr = Math.round(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hr`;
    return `${Math.round(diffHr / 24)} d`;
  };

  return (
    <WardenLayout>
      <DashboardHeader />

      {errorMsg && <div className="form-alert form-alert-error">{errorMsg}</div>}

      <ComplaintSummary summary={summary} />

      <div className="warden-content-grid">
        <section className="warden-panel queue-panel" aria-labelledby="queue-heading">
          <div className="warden-panel-head">
            <div>
              <h2 id="queue-heading" className="warden-panel-title">
                Live Complaint Queue
              </h2>
              <p className="warden-panel-sub">
                Complaints requiring immediate attention or room inspection.
              </p>
            </div>
            <Link to="/staff/complaints" className="pill-btn pill-btn-ghost pill-btn-sm">
              Full Queue ({pendingList.length})
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: "30px", textAlign: "center", color: "var(--color-text-secondary)" }}>
              Fetching active queue...
            </div>
          ) : pendingList.length > 0 ? (
            <ul className="queue-list">
              {pendingList.slice(0, 6).map((item) => (
                <li
                  key={item._id || Math.random()}
                  className="queue-row"
                  onClick={() => setResolvingComplaint(item)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="queue-row-main">
                    <span className="queue-id">
                      #{item._id ? item._id.slice(-6).toUpperCase() : "COMPLAINT"}
                    </span>
                    <span className="queue-title">{item.description || item.category}</span>
                  </div>
                  <span className="queue-meta">
                    {item.hostel} • {item.wing}-{item.roomNo}
                  </span>
                  <span className="queue-time">{formatTimeAgo(item.createdAt)}</span>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button
                      type="button"
                      className="pill-btn pill-btn-primary pill-btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setResolvingComplaint(item);
                      }}
                    >
                      Resolve
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ padding: "30px", textAlign: "center", color: "var(--color-text-secondary)" }}>
              No pending complaints in queue. All clear!
            </div>
          )}

          <Link to="/staff/complaints" className="link-muted queue-view-all">
            View all complaints & resolution history <span aria-hidden="true">→</span>
          </Link>
        </section>

        <div className="warden-side-column">
          <SlaOverview compliance={hostelHealth.slaCompliance} />
          <section className="warden-panel">
            <h3 className="warden-panel-title">Staff Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link to="/staff/complaints" className="pill-btn pill-btn-primary pill-btn-block">
                Manage All Complaints
              </Link>
              <Link to="/staff/profile" className="pill-btn pill-btn-ghost pill-btn-block">
                Staff Profile
              </Link>
            </div>
          </section>
        </div>
      </div>

      <OperationalInsight metrics={hostelHealth} />

      <WardenComplaintDetailModal
        complaint={resolvingComplaint}
        role="subadmin"
        onClose={() => setResolvingComplaint(null)}
        onSuccess={fetchDashboardData}
      />
    </WardenLayout>
  );
}
