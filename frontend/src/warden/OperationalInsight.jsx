export default function OperationalInsight({ metrics }) {
  return (
    <section className="warden-panel" aria-labelledby="insight-heading">
      <h2 id="insight-heading" className="warden-panel-title">
        Operational insight
      </h2>

      <ul className="insight-list">
        <li className="insight-item">
          <strong>{metrics.mostReported}</strong> issues are currently the
          most reported category.
        </li>
        <li className="insight-item">
          <strong>{metrics.worstHotspot}</strong> has the highest
          concentration of reported issues.
        </li>
      </ul>

      <div className="insight-future">
        <span className="insight-future-label">Future insight</span>
        <p className="insight-future-text">
          Repeated asset failures could be surfaced here for preventive
          maintenance.
        </p>
      </div>
    </section>
  );
}
