import HealthMetric from "./HealthMetric.jsx";

export default function HostelHealth({ metrics }) {
  return (
    <section className="warden-panel" aria-labelledby="health-heading">
      <div className="warden-panel-head">
        <div>
          <h2 id="health-heading" className="warden-panel-title">
            Hostel health
          </h2>
          <p className="warden-panel-sub">
            An overview of recurring maintenance patterns and service
            performance.
          </p>
        </div>
      </div>

      <div className="health-metric-grid">
        <HealthMetric label="Most reported" value={metrics.mostReported} />
        <HealthMetric label="Worst hotspot" value={metrics.worstHotspot} />
        <HealthMetric label="Avg. resolution" value={metrics.avgResolution} />
        <HealthMetric label="SLA compliance" value={metrics.slaCompliance} />
      </div>
    </section>
  );
}
