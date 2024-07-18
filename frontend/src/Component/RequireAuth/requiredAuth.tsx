import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ValidateStatusAccount } from "../../api/checkStatus";

interface RequiredAuthProps {
  allowedRoles: number[];
}

const RequiredAuth = ({ allowedRoles }: RequiredAuthProps) => {
  const { userRole, userId } = useContext(UserContext);
  const location = useLocation();
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const fetchApiStatusCheck = async () => {
      try {
        if(userId == 0){
          setHasPermission(true);
        }
        else if (userId !== undefined) {
          await ValidateStatusAccount(userId);
          setHasPermission(true);
        } else {
          setHasPermission(false);
        }
      } catch (error: any) {
        setHasPermission(false);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    fetchApiStatusCheck();
  }, [userId, location.pathname]);

  if (isCheckingStatus) {
    return <div>Loading...</div>;
  }

  if (!hasPermission) {
    return <Navigate to="/invalid" state={{ from: location }} replace />;
  }

  if (userRole === undefined) {
    return <Navigate to="/permission" state={{ from: location }} replace />;
  }

  if (allowedRoles.includes(userRole)) {
    return <Outlet />;
  } else {
    return <Navigate to="/permission" state={{ from: location }} replace />;
  }
};

export default RequiredAuth;
