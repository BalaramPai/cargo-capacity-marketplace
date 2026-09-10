import { useEffect, useState, type ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { roleNavMap } from "../../config/navigation";
import type { UserRole } from "../../types";

interface AppShellProps {
  role: UserRole;
  children: ReactNode;
}

const roleTitleMap: Record<UserRole, string> = {
  EXPORTER: "Exporter workspace",
  PROVIDER: "Provider workspace",
  ADMIN: "Admin workspace",
};

export default function AppShell({ role, children }: AppShellProps) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems = roleNavMap[role];

  return (
    <div className="app-shell">
      <aside className={`app-sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">C</div>
          <div>
            <strong>CargoLink</strong>
            <small>{roleTitleMap[role]}</small>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Application navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="sidebar-logout"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <span aria-hidden="true">↩</span>
          Logout
        </button>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-left">
            <button type="button" className="mobile-toggle" onClick={() => setMobileOpen((value) => !value)}>
              {mobileOpen ? "✕" : "☰"}
            </button>
            <div>
              <p className="topbar-label">Workspace</p>
              <h2>{roleTitleMap[role]}</h2>
            </div>
          </div>

          <div className="topbar-right">
            <button type="button" className="icon-button" aria-label="Notifications">
              <span aria-hidden="true">🔔</span>
              <span className="notification-dot" />
            </button>
            <div className="profile-menu">
              <div className="profile-avatar">{currentUser?.name?.[0] ?? "U"}</div>
              <div>
                <strong>{currentUser?.name ?? "User"}</strong>
                <small>{currentUser?.companyName ?? currentUser?.role}</small>
              </div>
              <span aria-hidden="true">▾</span>
            </div>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
