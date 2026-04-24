import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";
import { UserRole } from "../../types/user";

export function RequireAdmin() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== UserRole.Admin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}