import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/mock/authService";

const initialState = {
  fullName: "",
  workEmail: "",
  phoneNumber: "",
  companyName: "",
  companyType: "Manufacturer",
  businessIdentifier: "",
  businessAddress: "",
  city: "",
  country: "",
  password: "",
  confirmPassword: "",
};

export default function ExporterRegister() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const requiredFields = [form.fullName, form.workEmail, form.phoneNumber, form.companyName, form.businessIdentifier, form.businessAddress, form.city, form.country, form.password];
    if (requiredFields.some((value) => !value.trim())) {
      setError("Please complete all required export business details.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = authService.registerExporter({
      fullName: form.fullName,
      workEmail: form.workEmail,
      phoneNumber: form.phoneNumber,
      companyName: form.companyName,
      companyType: form.companyType,
      businessIdentifier: form.businessIdentifier,
      businessAddress: form.businessAddress,
      city: form.city,
      country: form.country,
      password: form.password,
    });

    if (!result.ok || !result.user) {
      setError(result.message ?? "We couldn’t create your account.");
      return;
    }

    setCurrentUser(result.user);
    navigate("/exporter/dashboard");
  };

  return (
    <AuthLayout>
      <section className="auth-form-page">
        <div className="auth-form-heading">
          <span className="auth-eyebrow">EXPORTER ACCOUNT</span>
          <h1>Create your exporter account</h1>
          <p>Tell us about your business and the cargo you want to move.</p>
        </div>

        <form className="coming-form auth-form" onSubmit={handleSubmit}>
          <div className="form-grid two-col">
            <div className="form-field">
              <label htmlFor="exporter-name">Full name</label>
              <input id="exporter-name" value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} />
            </div>
            <div className="form-field">
              <label htmlFor="exporter-email">Work email</label>
              <input id="exporter-email" type="email" value={form.workEmail} onChange={(event) => setForm((current) => ({ ...current, workEmail: event.target.value }))} />
            </div>
          </div>

          <div className="form-grid two-col">
            <div className="form-field">
              <label htmlFor="exporter-phone">Phone number</label>
              <input id="exporter-phone" value={form.phoneNumber} onChange={(event) => setForm((current) => ({ ...current, phoneNumber: event.target.value }))} />
            </div>
            <div className="form-field">
              <label htmlFor="exporter-company">Company name</label>
              <input id="exporter-company" value={form.companyName} onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))} />
            </div>
          </div>

          <div className="form-grid two-col">
            <div className="form-field">
              <label htmlFor="exporter-company-type">Company type</label>
              <select id="exporter-company-type" value={form.companyType} onChange={(event) => setForm((current) => ({ ...current, companyType: event.target.value }))}>
                <option>Manufacturer</option>
                <option>Trading house</option>
                <option>Importer</option>
                <option>Retailer</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="exporter-business-id">Business identifier</label>
              <input id="exporter-business-id" value={form.businessIdentifier} onChange={(event) => setForm((current) => ({ ...current, businessIdentifier: event.target.value }))} />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="exporter-address">Business address</label>
            <input id="exporter-address" value={form.businessAddress} onChange={(event) => setForm((current) => ({ ...current, businessAddress: event.target.value }))} />
          </div>

          <div className="form-grid two-col">
            <div className="form-field">
              <label htmlFor="exporter-city">City</label>
              <input id="exporter-city" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
            </div>
            <div className="form-field">
              <label htmlFor="exporter-country">Country</label>
              <input id="exporter-country" value={form.country} onChange={(event) => setForm((current) => ({ ...current, country: event.target.value }))} />
            </div>
          </div>

          <div className="form-grid two-col">
            <div className="form-field">
              <label htmlFor="exporter-password">Password</label>
              <input id="exporter-password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
            </div>
            <div className="form-field">
              <label htmlFor="exporter-confirm">Confirm password</label>
              <input id="exporter-confirm" type="password" value={form.confirmPassword} onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))} />
            </div>
          </div>

          {error ? <div className="form-error">{error}</div> : null}

          <Button type="submit" variant="primary" className="auth-submit-button">
            Create account
          </Button>
        </form>

        <p className="auth-existing">
          Want to choose a different account? <Link to="/register">Go back</Link>
        </p>
      </section>
    </AuthLayout>
  );
}