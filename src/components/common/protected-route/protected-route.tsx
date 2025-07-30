// src/routes/ProtectedRoute.tsx

import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../state/use-auth-store";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
