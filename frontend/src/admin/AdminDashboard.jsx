import { useState, useEffect, useCallback } from "react";
import AdminLayout from "./AdminLayout.jsx";
import WardenComplaintDetailModal from "../warden/WardenComplaintDetailModal.jsx";
import ComplaintSummary from "../warden/ComplaintSummary.jsx";
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

const HOSTEL_WINGS = {
  "All Hostels": [],
  "Vishweswaraiya": ["A", "B", "C", "D"],
  "Abdul Kalam": ["E", "F", "G"],
  "Homi Bhabha": ["H"],
  "SN Bose": [],
  "Sarabhai": [],
  "Capt Gurbir Singh": [],
  "Ramanujan": [],
  "Kalpana Chawla": [],
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedHostel, setSelectedHostel] = useState("All Hostels");
  const [selectedFlank, setSelectedFlank] = useState("All");
  const [pendingList, setPendingList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const handleHostelFilterChange = (e) => {
    setSelectedHostel(e.target.value);
    setSelectedFlank("All");
  };

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [pendingRes, completedRes] = await Promise.allSettled([
        api.admin.pendingComplaints(),
        api.admin.completedComplaints(),
      ]);

      if (pendingRes.status === "fulfilled" && pendingRes.value?.complaints) {
        setPendingList(normalizeList(pendingRes.value.complaints));
      } else {
        setPendingList([]);
      }

      if (completedRes.status === "fulfilled" && completedRes.value?.complaints) {
        setCompletedList(normalizeList(completedRes.value.complaints));
      } else {
        setCompletedList([]);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to fetch admin complaints data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const allComplaints = [...pendingList, ...completedList].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );

  const filteredComplaints = allComplaints.filter((item) => {
    if (activeTab === "Pending" && item.status !== "pending") return false;
    if ((activeTab === "Solved" || activeTab === "Completed") && item.status !== "completed") return false;

    if (selectedHostel && selectedHostel !== "All Hostels") {
      if ((item.hostel || "").toLowerCase() !== selectedHostel.toLowerCase()) return false;
    }

    if (selectedFlank && selectedFlank !== "All") {
      if ((item.wing || "").toLowerCase() !== selectedFlank.toLowerCase()) return false;
    }

    if (selectedCategory && selectedCategory !== "All") {
      const catFilter = selectedCategory.toLowerCase();
      const itemCat = (item.category || "").toLowerCase();
      const matches =
        itemCat === catFilter ||
        itemCat.includes(catFilter) ||
        catFilter.includes(itemCat) ||
        (catFilter.includes("electr") && itemCat.includes("electr")) ||
        (catFilter.includes("plumb") && itemCat.includes("plumb")) ||
        (catFilter.includes("clean") && itemCat.includes("clean")) ||
        (catFilter.includes("wifi") && itemCat.includes("wifi")) ||
        (catFilter.includes("internet") && itemCat.includes("internet"));
      if (!matches) return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.category?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.roomNo?.toLowerCase().includes(q) ||
      item.hostel?.toLowerCase().includes(q) ||
      item.wing?.toLowerCase().includes(q) ||
      item.student?.name?.toLowerCase().includes(q) ||
      item.student?.regNo?.toLowerCase().includes(q)
    );
  });

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
    <AdminLayout>
      <header className="complaints-header">
        <div className="complaints-header-text">
          <span className="pill-label">Admin Portal</span>
          <h1 className="complaints-title">Hostel Complaint Register</h1>
          <p className="complaints-sub">
            Campus-wide maintenance complaints, staff performance, and service tracking.
          </p>
        </div>
      </header>

      <ComplaintSummary
        summary={{
          pending: pendingList.length,
          resolved: completedList.length,
          total: allComplaints.length,
        }}
      />

      <section className="complaints-list-section">
        <div className="complaints-list-head complaints-filter-bar">
          <div className="complaint-filter-tabs">
            {["Pending", "Solved", "All"].map((filter) => (
              <button
                key={filter}
                type="button"
                className={`complaint-filter-btn ${
                  activeTab === filter ? "complaint-filter-btn-active" : ""
                }`}
                style={{ padding: "10px 22px", fontSize: "14.5px", height: "42px", flexShrink: 0 }}
                onClick={() => setActiveTab(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <input
            type="search"
            className="field-input"
            style={{
              flex: "1 1 200px",
              minWidth: "180px",
              maxWidth: "320px",
              height: "42px",
              padding: "9px 14px",
              fontSize: "14px",
            }}
            placeholder="Search Reg No, Room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="complaints-filter-group">
            <select
              className="field-input"
              style={{
                width: "155px",
                height: "40px",
                padding: "6px 10px",
                fontSize: "13.5px",
                fontWeight: 500,
                cursor: "pointer",
                flexShrink: 0,
              }}
              value={selectedHostel}
              onChange={handleHostelFilterChange}
            >
              {Object.keys(HOSTEL_WINGS).map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>

            <select
              className="field-input"
              style={{
                width: "115px",
                height: "40px",
                padding: "6px 10px",
                fontSize: "13.5px",
                fontWeight: 500,
                cursor: "pointer",
                flexShrink: 0,
              }}
              value={selectedFlank}
              onChange={(e) => setSelectedFlank(e.target.value)}
            >
              <option value="All">All Flanks</option>
              {selectedHostel !== "All Hostels" && HOSTEL_WINGS[selectedHostel].map((f) => (
                <option key={f} value={f}>Flank {f}</option>
              ))}
            </select>

            <select
              className="field-input"
              style={{
                width: "165px",
                height: "40px",
                padding: "6px 10px",
                fontSize: "13.5px",
                fontWeight: 500,
                cursor: "pointer",
                flexShrink: 0,
              }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Furniture">Furniture</option>
              <option value="Cleanliness">Cleanliness</option>
              <option value="Internet / WiFi">Internet / WiFi</option>
              <option value="Civil / Wall / Window">Civil / Wall / Window</option>
              <option value="Appliance">Appliance</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {errorMsg && <div className="form-alert form-alert-error">{errorMsg}</div>}

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-secondary)" }}>
            Loading complaints data...
          </div>
        ) : filteredComplaints.length > 0 ? (
          <div className="complaint-list">
            {filteredComplaints.map((item) => {
              const isPending = item.status === "pending";

              return (
                <article
                  key={item._id}
                  className="complaint-card"
                  onClick={() => setSelectedComplaint(item)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="complaint-card-top">
                    <div className="complaint-card-heading">
                      <span className="complaint-id">
                        COMPLAINT #{item._id ? item._id.slice(-6).toUpperCase() : "COMPLAINT"}
                      </span>
                      <h3 className="complaint-title">
                        {item.category} — {item.description?.slice(0, 50)}
                        {item.description?.length > 50 ? "..." : ""}
                      </h3>
                    </div>
                    <span
                      className={`status-pill ${item.status === "completed"
                          ? "status-pill-resolved"
                          : "status-pill-progress"
                        }`}
                    >
                      {item.status === "completed" ? "Resolved" : "Pending"}
                    </span>
                  </div>

                  <div className="complaint-card-meta complaint-card-meta-box" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "12px", padding: "12px", background: "var(--color-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <span style={{ fontSize: "14px", color: "var(--color-text)" }}>
                        <span style={{ fontWeight: 600, width: "70px", display: "inline-block" }}>Hostel</span> : {item.hostel}
                      </span>
                      <span style={{ fontSize: "14px", color: "var(--color-text)" }}>
                        <span style={{ fontWeight: 600, width: "70px", display: "inline-block" }}>Room no</span> : {item.roomNo}
                        <span style={{ fontWeight: 600, marginLeft: "24px" }}>Flank</span> : {item.wing}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <span style={{ fontSize: "14px", color: "var(--color-text)" }}>
                        <span style={{ fontWeight: 600, width: "60px", display: "inline-block" }}>Name</span> : {item.student?.name || "Resident"}
                      </span>
                      {item.student?.regNo && (
                        <span style={{ fontSize: "14px", color: "var(--color-text)" }}>
                          <span style={{ fontWeight: 600, width: "60px", display: "inline-block" }}>Reg no.</span> : {item.student.regNo}
                        </span>
                      )}
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

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {isPending && (
                        <button
                          type="button"
                          className="pill-btn pill-btn-primary pill-btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedComplaint(item);
                          }}
                        >
                          Resolve Complaint
                        </button>
                      )}

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
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="complaint-empty">
            <div className="complaint-empty-emblem">
              <div className="complaint-empty-emblem-inner" />
            </div>
            <h3 className="complaint-empty-title">No complaints found</h3>
            <p className="complaint-empty-sub">
              There are no complaints matching the selected filter.
            </p>
          </div>
        )}
      </section>

      <WardenComplaintDetailModal
        complaint={selectedComplaint}
        role="admin"
        onClose={() => setSelectedComplaint(null)}
        onSuccess={fetchComplaints}
      />
    </AdminLayout>
  );
}
