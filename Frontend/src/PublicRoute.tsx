import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "./Redux/store";

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};
