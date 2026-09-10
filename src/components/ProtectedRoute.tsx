import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    const redirectMap: Record<UserRole, string> = {
      EXPORTER: "/exporter/dashboard",
      PROVIDER: "/provider/dashboard",
      ADMIN: "/admin/dashboard",
    };

    return <Navigate to={redirectMap[currentUser.role]} replace />;
  }

  return <Outlet />;
}
