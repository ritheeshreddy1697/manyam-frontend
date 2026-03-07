import { Navigate, useLocation } from "react-router-dom";

export default function RoleGuard({ allowedRole, children }) {
  const location = useLocation();
  const role = String(localStorage.getItem("role") || "")
    .trim()
    .toLowerCase();

  if (!role) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: `${location.pathname}${location.search}${location.hash}`,
        }}
      />
    );
  }

  if (role !== allowedRole) {
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "hotel") return <Navigate to="/hotel/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
