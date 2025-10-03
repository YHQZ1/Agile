import { Outlet } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";

export default function AppLayout({ onLogout, userType }) {
  return (
    <div className="app-layout">
      <StudentSidebar />
      <div className="main-content">
        <Outlet context={{ onLogout, userType }} />
      </div>
    </div>
  );
}
