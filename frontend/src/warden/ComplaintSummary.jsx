export default function ComplaintSummary({ summary = {}, stats: customStats }) {
  const stats = customStats || [
    {
      label: "Total",
      value: summary?.total ?? 0,
      sub: "All complaints",
      type: "total",
    },
    {
      label: "Pending",
      value: summary?.pending ?? 0,
      sub: "Need attention",
      type: "pending",
    },
    ...(summary?.inProgress !== undefined
      ? [
          {
            label: "In Progress",
            value: summary.inProgress,
            sub: "Being handled",
            type: "progress",
          },
        ]
      : []),
    {
      label: "Resolved",
      value: summary?.resolved ?? summary?.completed ?? 0,
      sub: "Closed",
      type: "resolved",
    },
  ];

  return (
    <section
      className="complaint-summary"
      aria-label="Hostel-wide complaint overview"
    >
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
          {stat.sub && (
            <span className="complaint-summary-item-sub">{stat.sub}</span>
          )}
        </div>
      ))}
    </section>
  );
}

