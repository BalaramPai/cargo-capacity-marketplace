import { Link } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";

function Login() {
  return (
    <AuthLayout>

      <section className="auth-form-page">

        <div className="auth-form-heading">

          <span className="auth-eyebrow">
            WELCOME BACK
          </span>

          <h1>
            Sign in to CargoLink
          </h1>

          <p>
            Access your shipments, capacity and marketplace activity.
          </p>

        </div>

        <div className="coming-form">

          <div className="form-placeholder">
            Login form
          </div>

        </div>

        <p className="auth-existing">
          Don't have an account?{" "}
          <Link to="/register">
            Get started
          </Link>
        </p>

      </section>

    </AuthLayout>
  );
}

export default Login;