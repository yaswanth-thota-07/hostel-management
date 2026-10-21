import { navigate } from "../router.jsx";

export default function EmptyComplaints() {
  return (
    <div className="complaint-empty">
      <div className="complaint-empty-emblem">
        <div className="complaint-empty-emblem-inner" />
      </div>
      <h3 className="complaint-empty-title">No complaints yet.</h3>
      <p className="complaint-empty-sub">
        When you report an issue, it will appear here.
      </p>
      <button
        type="button"
        className="pill-btn pill-btn-primary"
        onClick={() => navigate("/student/raise-complaint")}
      >
        + Raise Complaint
      </button>
    </div>
  );
}
