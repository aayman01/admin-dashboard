import { createContext, useContext, useState, useEffect } from "react";
// import { redirect, Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
// import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (email, password) => {
    setLoading(true);
    if (email === "admin@gmail.com" && password === "admin123") {
      localStorage.setItem("user", email);
      setUser(email);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
