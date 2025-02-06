import { useAuth } from "../context/AuthProvider";
import { useLocation, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import Loading from "@/components/Loading";

export const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
