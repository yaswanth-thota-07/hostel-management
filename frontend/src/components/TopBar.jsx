import { Link } from "react-router-dom";

export function TopBar({ username, roleLabel, onLogout }) {
  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <Link className="wordmark" to="/login">
          <span className="wordmark__dot" />
          <div>
            <div className="wordmark__text">Hostel</div>
            <div className="wordmark__sub">complaint desk</div>
          </div>
        </Link>

        <div className="row row--wrap">
          {username ? (
            <span className="caption" style={{ marginRight: 4 }}>
              {roleLabel} — {username}
            </span>
          ) : null}
          <button className="btn btn--ghost btn--sm" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}