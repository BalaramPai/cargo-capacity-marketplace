import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter your email address and password.");
      return;
    }

    const result = login(form.email.trim(), form.password);
    if (!result.ok || !result.user) {
      setError(result.message ?? "Invalid email or password.");
      return;
    }

    const redirectMap = {
      EXPORTER: "/exporter/dashboard",
      PROVIDER: "/provider/dashboard",
      ADMIN: "/admin/dashboard",
    };

    navigate(redirectMap[result.user.role]);
  };

  return (
    <AuthLayout>
      <section className="auth-form-page">
        <div className="auth-form-heading">
          <span className="auth-eyebrow">WELCOME BACK</span>
          <h1>Sign in to CargoLink</h1>
          <p>Access your shipments, capacity, and marketplace activity.</p>
        </div>

        <form className="coming-form auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="login-email">Work email</label>
            <input
              id="login-email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="exporter@cargolink.test"
            />
          </div>

          <div className="form-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="Enter your password"
            />
          </div>

          {error ? <div className="form-error">{error}</div> : null}

          <Button type="submit" variant="primary" className="auth-submit-button">
            Sign in
          </Button>

          <div className="auth-form-help-row">
            <span>Demo accounts:</span>
            <strong>exporter@cargolink.test / password123</strong>
          </div>
        </form>

        <p className="auth-existing">
          Don&apos;t have an account? <Link to="/register">Get started</Link>
        </p>
      </section>
    </AuthLayout>
  );
}