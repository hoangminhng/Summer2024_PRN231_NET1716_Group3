import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const account = localStorage.getItem("token");

  if (account) {
    // If the user is logged in, redirect to the Home page
    return <Navigate to="/" replace />;
  }

  // If the user is not logged in, render the children (Register component)
  return <>{children}</>;
};

export default ProtectedRoute;
