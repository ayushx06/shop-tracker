import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Simple PIN-based role system (no Firebase Auth needed for small shop)
// Owner PIN: set in .env as REACT_APP_OWNER_PIN (default: 1234)
// Staff PIN: set in .env as REACT_APP_STAFF_PIN (default: 0000)

const OWNER_PIN = process.env.REACT_APP_OWNER_PIN || "1234";
const STAFF_PIN = process.env.REACT_APP_STAFF_PIN || "0000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("groceryUser");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (pin, staffName = "") => {
    if (pin === OWNER_PIN) {
      const u = { role: "owner", name: "Owner" };
      sessionStorage.setItem("groceryUser", JSON.stringify(u));
      setUser(u);
      return { success: true, role: "owner" };
    } else if (pin === STAFF_PIN) {
      if (!staffName.trim()) return { success: false, error: "Enter your name" };
      const u = { role: "staff", name: staffName.trim() };
      sessionStorage.setItem("groceryUser", JSON.stringify(u));
      setUser(u);
      return { success: true, role: "staff" };
    }
    return { success: false, error: "Wrong PIN" };
  };

  const logout = () => {
    sessionStorage.removeItem("groceryUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
