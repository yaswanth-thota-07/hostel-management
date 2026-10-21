import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TopBar } from "../components/TopBar";
import { ComplaintTriage } from "../components/ComplaintTriage";

export function SubAdminDashboard() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <TopBar
        username={auth?.identity?.staffEmail || "Staff"}
        roleLabel="Staff"
        onLogout={onLogout}
      />

      <main className="container dash">
        <div className="dash__head">
          <div>
            <div className="caption dash__kicker">Maintenance desk</div>
            <h1 className="heading-lg">The queue</h1>
            <div className="dash__role">
              <span className="dot" />
              your wings · signed in as {auth?.identity?.staffEmail || "staff"}
            </div>
          </div>
        </div>

        <div className="dash__body dash__body--single">
          <ComplaintTriage base="/api/subadmin" token={auth?.token} showStudent={true} />
        </div>
      </main>
    </>
  );
}