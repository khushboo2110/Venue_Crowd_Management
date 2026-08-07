import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("crowd_flow_user");
    return saved ? JSON.parse(saved) : { id: "u-demo", name: "Hackathon Judge", email: "judge@sih.in", role: "Admin" };
  });

  const [token, setToken] = useState(() => localStorage.getItem("crowd_flow_token") || "demo_token_jwt");

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("crowd_flow_user", JSON.stringify(userData));
    localStorage.setItem("crowd_flow_token", jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("crowd_flow_user");
    localStorage.removeItem("crowd_flow_token");
  };

  const switchRole = (newRole) => {
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem("crowd_flow_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
