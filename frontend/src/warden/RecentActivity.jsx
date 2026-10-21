export default function RecentActivity({ activity }) {
  return (
    <section className="warden-panel" aria-labelledby="activity-heading">
      <h2 id="activity-heading" className="warden-panel-title">
        Recent activity
      </h2>

      <ul className="activity-list">
        {activity.map((event) => (
          <li className="activity-item" key={`${event.time}-${event.text}`}>
            <span className="activity-time">{event.time}</span>
            <span className="activity-text">{event.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
