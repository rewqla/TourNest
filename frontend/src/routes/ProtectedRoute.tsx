import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/useAuth";

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isLoggedIn } = useAuthContext();

  return isLoggedIn() ? (
    <>{children}</>
  ) : (
    <Navigate to="/sign-in" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
