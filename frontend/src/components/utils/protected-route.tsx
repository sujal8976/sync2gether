import { Navigate, Outlet } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteInterface {
  isAuthenticated: boolean;
  children?: ReactNode;
  redirect?: string;
}

export default function ProtectedRoute({
  isAuthenticated,
  children,
  redirect = "/",
}: ProtectedRouteInterface) {
  if (!isAuthenticated) {
    return <Navigate to={redirect} />;
  }
  return children ? children : <Outlet />;
}
