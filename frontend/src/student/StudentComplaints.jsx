import { useState, useEffect, useCallback } from "react";
import StudentLayout from "./StudentLayout.jsx";
import ComplaintSummary from "./ComplaintSummary.jsx";
import EmptyComplaints from "./EmptyComplaints.jsx";
import ComplaintDetailModal from "./ComplaintDetailModal.jsx";
import { api } from "../api/client.js";
import { navigate } from "../router.jsx";

export default function StudentComplaints() {
  const [pendingList, setPendingList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [pendingRes, completedRes] = await Promise.allSettled([
        api.complaints.pending(),
        api.complaints.completed(),
      ]);

      if (pendingRes.status === "fulfilled" && pendingRes.value?.complaints) {
        setPendingList(pendingRes.value.complaints);
      } else {
        setPendingList([]);
      }

      if (completedRes.status === "fulfilled" && completedRes.value?.complaints) {
        setCompletedList(completedRes.value.complaints);
      } else {
        setCompletedList([]);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to load complaints from backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const allComplaints = [...pendingList, ...completedList].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const filteredComplaints = allComplaints.filter((item) => {
    if (statusFilter === "Pending" && item.status !== "pending") return false;
    if (statusFilter === "Completed" && item.status !== "completed") return false;
    return true;
  });

  const summary = {
    total: allComplaints.length,
    pending: pendingList.length,
    completed: completedList.length,
  };

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <StudentLayout>
      <header className="complaints-header">
        <div className="complaints-header-text">
          <span className="pill-label">Student Complaints</span>
          <h1 className="complaints-title">My Complaints</h1>
        </div>

        <button
          type="button"
          className="pill-btn pill-btn-primary complaints-raise-btn"
          onClick={() => navigate("/student/raise-complaint")}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Raise Complaint</span>
        </button>
      </header>

      <ComplaintSummary summary={summary} />

      <section className="complaints-list-section">
        <div className="complaints-list-head">
          <div>
            <h2 className="complaints-list-title">My Complaint Requests</h2>
            <p className="complaints-list-sub">
              Your reported maintenance and hostel complaints.
            </p>
          </div>

          <div className="complaint-filter-tabs">
            {["All", "Pending", "Completed"].map((filter) => (
              <button
                key={filter}
                type="button"
                className={`complaint-filter-btn ${
                  statusFilter === filter ? "complaint-filter-btn-active" : ""
                }`}
                onClick={() => setStatusFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {errorMsg && <div className="form-alert form-alert-error">{errorMsg}</div>}

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-secondary)" }}>
            Loading complaints...
          </div>
        ) : filteredComplaints.length > 0 ? (
          <div className="complaint-list">
            {filteredComplaints.map((item) => (
              <article
                key={item._id}
                className="complaint-card"
                onClick={() => setSelectedComplaint(item)}
                style={{ cursor: "pointer" }}
              >
                <div className="complaint-card-top">
                  <div className="complaint-card-heading">
                    <span className="complaint-id">
                      COMPLAINT #{item._id.slice(-6).toUpperCase()}
                    </span>
                    <h3 className="complaint-title">
                      {item.category} — {item.description?.slice(0, 48)}
                      {item.description?.length > 48 ? "..." : ""}
                    </h3>
                  </div>
                  <span
                    className={`status-pill ${
                      item.status === "completed"
                        ? "status-pill-resolved"
                        : "status-pill-progress"
                    }`}
                  >
                    {item.status === "completed" ? "Resolved" : "Pending"}
                  </span>
                </div>

                <div className="complaint-card-meta" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "12px", padding: "12px", background: "var(--color-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "15px", color: "var(--color-text)" }}>
                      <span style={{ fontWeight: 600, width: "75px", display: "inline-block" }}>Hostel</span> : {item.hostel}
                    </span>
                    <span style={{ fontSize: "14px", color: "var(--color-text)", whiteSpace: "nowrap" }}>
                      <span style={{ fontWeight: 600, width: "75px", display: "inline-block" }}>Room no</span> : {item.roomNo}
                      <span style={{ fontWeight: 600, marginLeft: "16px" }}>Flank</span> : {item.wing}
                    </span>
                  </div>
                  <div className="complaint-meta-time-col">
                    <span>Submitted {formatRelativeTime(item.createdAt)}</span>
                    {(item.resolvedAt || (item.status === "completed" && item.updatedAt)) && (
                      <span className="complaint-meta-updated">
                        Resolved {formatRelativeTime(item.resolvedAt || item.updatedAt)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="complaint-card-bottom">
                  <span className="complaint-meta-secondary">
                    Category: {item.category}
                  </span>

                  <button
                    type="button"
                    className="complaint-view-link"
                    style={{ background: "transparent", border: "none", cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedComplaint(item);
                    }}
                  >
                    View details <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyComplaints />
        )}
      </section>

      <ComplaintDetailModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onRefresh={fetchComplaints}
      />
    </StudentLayout>
  );
}
