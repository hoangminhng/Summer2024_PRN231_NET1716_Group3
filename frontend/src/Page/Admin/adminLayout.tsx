import React from "react";
import Sidebar from "./Sidebar/index";

export const AdminLayout: React.FC = () => (
  <nav className="fixed w-full z-20 top-0 start-0" style={{textAlign: "left"}}>
    <Sidebar />
  </nav>
);
export default AdminLayout
