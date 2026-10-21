import ComplaintQueueItem from "./ComplaintQueueItem.jsx";

export default function LiveComplaintQueue({ complaints }) {
  return (
    <section className="warden-panel queue-panel" aria-labelledby="queue-heading">
      <div className="warden-panel-head">
        <div>
          <h2 id="queue-heading" className="warden-panel-title">
            Live complaint queue
          </h2>
          <p className="warden-panel-sub">
            Recent complaints requiring attention or currently in progress.
          </p>
        </div>
      </div>

      <ul className="queue-list">
        {complaints.map((complaint) => (
          <ComplaintQueueItem key={complaint.id} complaint={complaint} />
        ))}
      </ul>

      <a
        href="#"
        className="link-muted queue-view-all"
        onClick={(event) => event.preventDefault()}
      >
        View all complaints <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
