export function CodeBlock({ label, lines }) {
  return (
    <div className="code-block">
      <span className="code-block__label">{label}</span>
      <pre className="mono">
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </pre>
    </div>
  );
}