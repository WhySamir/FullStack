// Components/AuthGuard.tsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../Redux/store";

const AuthGuard: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthGuard;
