import { useState } from "react";

export function HelpButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="help"
        aria-label="Help"
        onClick={() => setOpen((o) => !o)}
      >
        ?
      </button>
      {open ? (
        <div
          style={{
            position: "fixed",
            right: 66,
            bottom: 24,
            maxWidth: 260,
            background: "var(--color-warm-ink)",
            color: "var(--color-paper)",
            borderRadius: "var(--radius-lg)",
            padding: "16px 18px",
            fontSize: "13.5px",
            lineHeight: 1.55,
            boxShadow: "var(--shadow-sm)",
            zIndex: 59
          }}
        >
          The desk runs on three logins — students, admins, and staff. Wrong
          portal? Sign out and pick another from the sign-in page.
          <div style={{ marginTop: 8, opacity: 0.7 }}>
            Questions go to the hostel office.
          </div>
        </div>
      ) : null}
    </>
  );
}