import { Navigate, Outlet, useLocation } from "react-router-dom";
import useUser from "../hooks/useUser";

export default function RequireAuth() {
  const { user, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) return null; // or a full-page spinner
  if (!user) {
    // send to /login and remember where they tried to go
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />; // render the protected child route
}
