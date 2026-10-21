const STATUS_CLASS = {
  Open: "status-pill-open",
  "In Progress": "status-pill-progress",
  Resolved: "status-pill-resolved",
  Reopened: "status-pill-reopened",
};

export default function ComplaintCard({ complaint }) {
  const {
    id,
    title,
    category,
    asset,
    room,
    priority,
    status,
    raised,
    updated,
    updatedLabel,
  } = complaint;

  const metaLine = [room, asset].filter(Boolean).join("  •  ");

  return (
    <article className="complaint-card">
      <div className="complaint-card-top">
        <div className="complaint-card-heading">
          <span className="complaint-id">{id}</span>
          <h3 className="complaint-title">{title}</h3>
        </div>
        <span className={`status-pill ${STATUS_CLASS[status] ?? ""}`}>{status}</span>
      </div>

      <div className="complaint-card-meta">
        <span className="complaint-meta-primary">{metaLine || room}</span>
        <div className="complaint-meta-time-col">
          <span>Raised {raised}</span>
          {updated && (
            <span className="complaint-meta-updated">
              {updatedLabel} {updated}
            </span>
          )}
        </div>
      </div>

      <div className="complaint-card-bottom">
        <span className="complaint-meta-secondary">
          {priority} • {category}
        </span>

        <a href="#" className="complaint-view-link" onClick={(event) => event.preventDefault()}>
          View details <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
