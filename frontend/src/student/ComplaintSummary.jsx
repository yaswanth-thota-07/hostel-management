export default function ComplaintSummary({ summary = {} }) {
  const stats = [
    { label: "Total Complaints", value: summary?.total ?? 0, type: "total" },
    { label: "Pending", value: summary?.pending ?? summary?.open ?? 0, type: "pending" },
    { label: "Completed", value: summary?.completed ?? summary?.resolved ?? 0, type: "resolved" },
  ];

  return (
    <section className="complaint-summary" aria-label="Complaint status overview">
      {stats.map((stat) => (
        <div
          className={`complaint-summary-item complaint-summary-item--${stat.type || "default"}`}
          key={stat.label}
        >
          <div className="complaint-summary-header">
            <span className="complaint-summary-label">{stat.label}</span>
            <span
              className={`complaint-summary-dot complaint-summary-dot--${stat.type || "default"}`}
              aria-hidden="true"
            />
          </div>
          <span className="complaint-summary-value">
            {String(stat.value ?? 0).padStart(2, "0")}
          </span>
        </div>
      ))}
    </section>
  );
}

