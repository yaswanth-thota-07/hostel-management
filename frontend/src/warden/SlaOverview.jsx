export default function SlaOverview({ compliance }) {
  return (
    <section className="warden-panel sla-panel" aria-labelledby="sla-heading">
      <h2 id="sla-heading" className="warden-panel-title">
        SLA compliance
      </h2>

      <span className="sla-value">{compliance}</span>
      <p className="warden-panel-sub">Current hostel performance</p>

      <div
        className="sla-bar"
        role="progressbar"
        aria-valuenow={parseFloat(compliance)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="SLA compliance"
      >
        <div className="sla-bar-fill" style={{ width: compliance }} />
      </div>
    </section>
  );
}
