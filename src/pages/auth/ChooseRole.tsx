import { Link } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import RoleCard from "../../components/auth/RoleCard";

function ChooseRole() {
  return (
    <AuthLayout>

      <section className="role-selection">

        <div className="role-selection-heading">

          <span className="auth-eyebrow">
            GET STARTED
          </span>

          <h1>
            How will you use CargoLink?
          </h1>

          <p>
            Choose the account type that best describes you.
            You can start using CargoLink in just a few steps.
          </p>

        </div>

        <div className="role-cards">

          <RoleCard
            number="01"
            title="I'm an exporter"
            description="I have cargo to move and want to find available container capacity."
            to="/register/exporter"
          />

          <RoleCard
            number="02"
            title="I'm a provider"
            description="I have unused container capacity and want to fill it with cargo."
            to="/register/provider"
          />

        </div>

        <p className="auth-existing">
          Already have an account?{" "}
          <Link to="/login">
            Sign in
          </Link>
        </p>

      </section>

    </AuthLayout>
  );
}

export default ChooseRole;