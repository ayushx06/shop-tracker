import { useAuth, AuthProvider } from "./lib/AuthContext";
import LoginPage from "./components/LoginPage";
import OwnerDashboard from "./components/OwnerDashboard";
import StaffDashboard from "./components/StaffDashboard";
import "./App.css";

function AppInner() {
  const { user, logout } = useAuth();

  if (!user) return <LoginPage />;

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-left">
          <span className="app-logo">🛒</span>
          <span className="app-title">Shop Tracker</span>
          {user.role === "owner" && <span className="role-pill owner">Owner</span>}
          {user.role === "staff" && <span className="role-pill staff">Staff · {user.name}</span>}
        </div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </header>
      <main className="app-main">
        {user.role === "owner" ? <OwnerDashboard /> : <StaffDashboard />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
