import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const OWNER_PIN = process.env.REACT_APP_OWNER_PIN || "1234";
const STAFF_PIN = process.env.REACT_APP_STAFF_PIN || "0000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("groceryUser");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (pin, staffName = "") => {
    if (pin === OWNER_PIN) {
      const u = { role: "owner", name: "Owner" };
      localStorage.setItem("groceryUser", JSON.stringify(u));
      setUser(u);
      return { success: true, role: "owner" };
    } else if (pin === STAFF_PIN) {
      if (!staffName.trim()) return { success: false, error: "Enter your name" };
      const u = { role: "staff", name: staffName.trim() };
      localStorage.setItem("groceryUser", JSON.stringify(u));
      setUser(u);
      return { success: true, role: "staff" };
    }
    return { success: false, error: "Wrong PIN" };
  };

  const logout = () => {
    localStorage.removeItem("groceryUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);