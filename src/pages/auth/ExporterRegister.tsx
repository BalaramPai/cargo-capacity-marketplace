import { Link } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";

function ExporterRegister() {
  return (
    <AuthLayout>

      <section className="auth-form-page">

        <div className="auth-form-heading">

          <span className="auth-eyebrow">
            EXPORTER ACCOUNT
          </span>

          <h1>
            Create your exporter account
          </h1>

          <p>
            Tell us a little about yourself and the cargo
            you want to move.
          </p>

        </div>

        <div className="coming-form">

          <div className="form-placeholder">
            Exporter registration form
          </div>

        </div>

        <p className="auth-existing">
          Want to choose a different account?{" "}
          <Link to="/register">
            Go back
          </Link>
        </p>

      </section>

    </AuthLayout>
  );
}

export default ExporterRegister;