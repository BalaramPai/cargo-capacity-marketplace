import { Link } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";

function ProviderRegister() {
  return (
    <AuthLayout>

      <section className="auth-form-page">

        <div className="auth-form-heading">

          <span className="auth-eyebrow">
            PROVIDER ACCOUNT
          </span>

          <h1>
            Create your provider account
          </h1>

          <p>
            Tell us about your business and the container
            capacity you have available.
          </p>

        </div>

        <div className="coming-form">

          <div className="form-placeholder">
            Provider registration form
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

export default ProviderRegister;