import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("naruto_user") || "null"));
  const [token, setToken] = useState(() => localStorage.getItem("naruto_token") || "");

  useEffect(() => {
    if (user) {
      localStorage.setItem("naruto_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("naruto_user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("naruto_token", token);
    } else {
      localStorage.removeItem("naruto_token");
    }
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      setUser,
      setToken,
      logout: () => {
        setUser(null);
        setToken("");
      },
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
