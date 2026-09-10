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
  companyType: "Logistics provider",
  registrationId: "",
  gstNumber: "",
  address: "",
  city: "",
  country: "",
  yearsInOperation: "",
  serviceDescription: "",
  operatingRegions: "",
  primaryRoutes: "",
  password: "",
  confirmPassword: "",
};

export default function ProviderRegister() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const requiredFields = [form.fullName, form.workEmail, form.phoneNumber, form.companyName, form.registrationId, form.address, form.city, form.country, form.password];
    if (requiredFields.some((value) => !value.trim())) {
      setError("Please complete all required provider details.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = authService.registerProvider({
      fullName: form.fullName,
      workEmail: form.workEmail,
      phoneNumber: form.phoneNumber,
      companyName: form.companyName,
      companyType: form.companyType,
      registrationId: form.registrationId,
      gstNumber: form.gstNumber,
      address: form.address,
      city: form.city,
      country: form.country,
      yearsInOperation: form.yearsInOperation,
      serviceDescription: form.serviceDescription,
      operatingRegions: form.operatingRegions,
      primaryRoutes: form.primaryRoutes,
      password: form.password,
    });

    if (!result.ok || !result.user) {
      setError(result.message ?? "We couldn’t create your provider account.");
      return;
    }

    setCurrentUser(result.user);
    navigate("/provider/dashboard");
  };

  return (
    <AuthLayout>
      <section className="auth-form-page">
        <div className="auth-form-heading">
          <span className="auth-eyebrow">PROVIDER ACCOUNT</span>
          <h1>Create your provider account</h1>
          <p>Tell us about your business and the container capacity you have available.</p>
        </div>

        <form className="coming-form auth-form" onSubmit={handleSubmit}>
          <div className="form-grid two-col">
            <div className="form-field">
              <label htmlFor="provider-name">Full name</label>
              <input id="provider-name" value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} />
            </div>
            <div className="form-field">
              <label htmlFor="provider-email">Work email</label>
              <input id="provider-email" type="email" value={form.workEmail} onChange={(event) => setForm((current) => ({ ...current, workEmail: event.target.value }))} />
            </div>
          </div>

          <div className="form-grid two-col">
            <div className="form-field">
              <label htmlFor="provider-phone">Phone number</label>
              <input id="provider-phone" value={form.phoneNumber} onChange={(event) => setForm((current) => ({ ...current, phoneNumber: event.target.value }))} />
            </div>
            <div className="form-field">
              <label htmlFor="provider-company">Company name</label>
              <input id="provider-company" value={form.companyName} onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))} />
            </div>
          </div>

          <div className="form-grid two-col">
            <div className="form-field">
              <label htmlFor="provider-type">Company type</label>
              <select id="provider-type" value={form.companyType} onChange={(event) => setForm((current) => ({ ...current, companyType: event.target.value }))}>
                <option>Logistics provider</option>
                <option>Freight forwarder</option>
                <option>Carrier</option>
                <option>Warehouse operator</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="provider-registration">Registration ID</label>
              <input id="provider-registration" value={form.registrationId} onChange={(event) => setForm((current) => ({ ...current, registrationId: event.target.value }))} />
            </div>
          </div>

          <div className="form-grid two-col">
            <div className="form-field">
              <label htmlFor="provider-gst">GST number</label>
              <input id="provider-gst" value={form.gstNumber} onChange={(event) => setForm((current) => ({ ...current, gstNumber: event.target.value }))} />
            </div>
            <div className="form-field">
              <label htmlFor="provider-years">Years in operation</label>
              <input id="provider-years" value={form.yearsInOperation} onChange={(event) => setForm((current) => ({ ...current, yearsInOperation: event.target.value }))} />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="provider-address">Business address</label>
            <input id="provider-address" value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} />
          </div>

          <div className="form-grid two-col">
            <div className="form-field">
              <label htmlFor="provider-city">City</label>
              <input id="provider-city" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
            </div>
            <div className="form-field">
              <label htmlFor="provider-country">Country</label>
              <input id="provider-country" value={form.country} onChange={(event) => setForm((current) => ({ ...current, country: event.target.value }))} />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="provider-service">Service description</label>
            <textarea id="provider-service" value={form.serviceDescription} onChange={(event) => setForm((current) => ({ ...current, serviceDescription: event.target.value }))} rows={3} />
          </div>

          <div className="form-grid two-col">
            <div className="form-field">
              <label htmlFor="provider-regions">Operating regions</label>
              <input id="provider-regions" value={form.operatingRegions} onChange={(event) => setForm((current) => ({ ...current, operatingRegions: event.target.value }))} />
            </div>
            <div className="form-field">
              <label htmlFor="provider-routes">Primary routes</label>
              <input id="provider-routes" value={form.primaryRoutes} onChange={(event) => setForm((current) => ({ ...current, primaryRoutes: event.target.value }))} />
            </div>
          </div>

          <div className="form-grid two-col">
            <div className="form-field">
              <label htmlFor="provider-password">Password</label>
              <input id="provider-password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
            </div>
            <div className="form-field">
              <label htmlFor="provider-confirm">Confirm password</label>
              <input id="provider-confirm" type="password" value={form.confirmPassword} onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))} />
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