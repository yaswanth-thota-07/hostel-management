import { usePath } from "./router.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import StudentComplaints from "./student/StudentComplaints.jsx";
import StudentRaiseComplaint from "./student/StudentRaiseComplaint.jsx";
import StudentProfile from "./student/StudentProfile.jsx";
import StaffDashboard from "./warden/WardenDashboard.jsx";
import StaffComplaints from "./warden/WardenComplaints.jsx";
import StaffProfile from "./warden/WardenProfile.jsx";
import WardenDashboard from "./admin/AdminDashboard.jsx";
import WardenStaffManagement from "./admin/AdminSubAdmins.jsx";

function AppContent() {
  const path = usePath();

  if (path === "/student/complaints") {
    return <StudentComplaints />;
  }

  if (path === "/student/raise-complaint") {
    return <StudentRaiseComplaint />;
  }

  if (path === "/student/profile") {
    return <StudentProfile />;
  }

  if (
    path === "/staff" ||
    path === "/staff/complaints" ||
    path === "/staff/dashboard" ||
    path === "/subadmin/dashboard" ||
    path === "/warden/complaints" ||
    path === "/subadmin/complaints" ||
    path === "/subadmin"
  ) {
    return <StaffComplaints />;
  }

  if (path === "/staff/profile" || path === "/warden/profile" || path === "/subadmin/profile") {
    return <StaffProfile />;
  }

  if (
    path === "/warden/dashboard" ||
    path === "/admin/dashboard" ||
    path === "/admin" ||
    path === "/warden"
  ) {
    return <WardenDashboard />;
  }

  if (
    path === "/warden/staff" ||
    path === "/warden/subadmins" ||
    path === "/admin/subadmins" ||
    path === "/admin/staff" ||
    path === "/staff/management"
  ) {
    return <WardenStaffManagement />;
  }

  return <LandingPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

