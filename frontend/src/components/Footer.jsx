export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src="/logo11.png"
          alt="Hostel Management Logo"
          style={{ width: "22px", height: "22px", objectFit: "contain" }}
        />
        <span className="footer-brand">HOSTEL MANAGEMENT</span>
      </div>
      <div className="footer-right">
        <span className="footer-copy">© 2025–26 CIDC</span>
      </div>
    </footer>
  );
}
