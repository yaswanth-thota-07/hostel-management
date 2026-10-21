const STATUS_CLASS = {
  Assigned: "status-pill-progress",
  "In Progress": "status-pill-progress",
  Pending: "status-pill-open",
  Resolved: "status-pill-resolved",
};

export default function ComplaintQueueItem({ complaint }) {
  const { id, title, room, category, priority, time, status } = complaint;

  return (
    <li className="queue-row">
      <div className="queue-row-main">
        <span className="queue-id">{id}</span>
        <span className="queue-title">{title}</span>
      </div>

      <span className="queue-meta">
        {room} · {priority} · {category}
      </span>

      <span className="queue-time">{time}</span>

      <span className={`status-pill ${STATUS_CLASS[status] ?? ""}`}>{status}</span>
    </li>
  );
}
