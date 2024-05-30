import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface RequiredAuthProps {
  allowedRoles: number[];
}

const RequiredAuth = ({ allowedRoles }: RequiredAuthProps) => {
  const { userRole } = useContext(UserContext);
  const location = useLocation();

  if (userRole === undefined) {
    return <Navigate to="/permission" state={{ from: location }} replace />;; 
  }

  if (allowedRoles.includes(userRole)) {
    return <Outlet />;
  } else {
    return <Navigate to="/permission" state={{ from: location }} replace />;
  }
};

export default RequiredAuth;
