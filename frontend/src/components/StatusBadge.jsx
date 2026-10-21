export function StatusBadge({ status }) {
  if (status === "completed") {
    return (
      <span className="badge">
        <span className="badge__dot" />
        Resolved
      </span>
    );
  }

  return (
    <span className="badge">
      <span className="badge__dot badge__dot--live" />
      Pending
    </span>
  );
}