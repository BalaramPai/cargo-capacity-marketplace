import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import "../../styles/auth.css";

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <header className="auth-navbar">
        <div className="auth-navbar-inner">

          <Link to="/" className="auth-brand">
            <span className="auth-brand-mark">c</span>
            <span>CargoLink</span>
          </Link>

          <Link to="/" className="auth-back-link">
            Back to home
          </Link>

        </div>
      </header>

      <main className="auth-main">
        {children}
      </main>
    </div>
  );
}

export default AuthLayout;