export default function HealthMetric({ label, value }) {
  return (
    <div className="health-metric">
      <span className="health-metric-label">{label}</span>
      <span className="health-metric-value">{value}</span>
    </div>
  );
}
