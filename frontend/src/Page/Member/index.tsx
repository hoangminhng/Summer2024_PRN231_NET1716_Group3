import { Outlet } from "react-router-dom";
import Header from "../../Component/User/Header";

const MemberLayout: React.FC = () => {
  return (
    <>
      <div className="relative flex flex-wrap justify-between p-6 gap-4 mb-4"></div>
      <Header />
      <Outlet />
    </>
  );
};

export default MemberLayout;
