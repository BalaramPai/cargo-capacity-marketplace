import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LandingPage from "./features/landing/LandingPage";
import {
  ExporterBookingDetailPage,
  ExporterBookingNewPage,
  ExporterBookingsPage,
  ExporterCapacityDetailPage,
  ExporterCapacityPage,
  ExporterDashboardPage,
  ExporterMessagesPage,
  ExporterSettingsPage,
  ExporterShipmentDetailPage,
  ExporterShipmentFormPage,
  ExporterShipmentsPage,
  ExporterTrackingDetailPage,
  ExporterTrackingPage,
} from "./features/exporter/ExporterPages";
import {
  AdminBookingsPage,
  AdminContainersPage,
  AdminDashboardPage,
  AdminDisputeDetailPage,
  AdminDisputesPage,
  AdminProviderDetailPage,
  AdminProvidersPage,
  AdminSettingsPage,
  AdminShipmentsPage,
  AdminUsersPage,
} from "./features/admin/AdminPages";
import {
  ProviderAddCapacityPage,
  ProviderBookingsPage,
  ProviderContainersPage,
  ProviderDashboardPage,
  ProviderMessagesPage,
  ProviderOperationsPage,
  ProviderSettingsPage,
} from "./features/provider/ProviderPages";
import { AuthProvider } from "./context/AuthContext";

import ChooseRole from "./pages/auth/ChooseRole";
import ExporterRegister from "./pages/auth/ExporterRegister";
import ProviderRegister from "./pages/auth/ProviderRegister";
import Login from "./pages/auth/Login";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <LandingPage />
            </>
          }
        />

        <Route path="/register" element={<ChooseRole />} />
        <Route path="/register/exporter" element={<ExporterRegister />} />
        <Route path="/register/provider" element={<ProviderRegister />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute allowedRoles={["EXPORTER"]} />}>
          <Route path="/exporter/dashboard" element={<ExporterDashboardPage />} />
          <Route path="/exporter/shipments" element={<ExporterShipmentsPage />} />
          <Route path="/exporter/shipments/new" element={<ExporterShipmentFormPage />} />
          <Route path="/exporter/shipments/:shipmentId" element={<ExporterShipmentDetailPage />} />
          <Route path="/exporter/capacity" element={<ExporterCapacityPage />} />
          <Route path="/exporter/capacity/:capacityId" element={<ExporterCapacityDetailPage />} />
          <Route path="/exporter/bookings" element={<ExporterBookingsPage />} />
          <Route path="/exporter/bookings/new" element={<ExporterBookingNewPage />} />
          <Route path="/exporter/bookings/:bookingId" element={<ExporterBookingDetailPage />} />
          <Route path="/exporter/tracking" element={<ExporterTrackingPage />} />
          <Route path="/exporter/tracking/:shipmentId" element={<ExporterTrackingDetailPage />} />
          <Route path="/exporter/messages" element={<ExporterMessagesPage />} />
          <Route path="/exporter/settings" element={<ExporterSettingsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["PROVIDER"]} />}>
          <Route path="/provider/dashboard" element={<ProviderDashboardPage />} />
          <Route path="/provider/containers" element={<ProviderContainersPage />} />
          <Route path="/provider/containers/new" element={<ProviderAddCapacityPage />} />
          <Route path="/provider/bookings" element={<ProviderBookingsPage />} />
          <Route path="/provider/operations" element={<ProviderOperationsPage />} />
          <Route path="/provider/messages" element={<ProviderMessagesPage />} />
          <Route path="/provider/settings" element={<ProviderSettingsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/providers" element={<AdminProvidersPage />} />
          <Route path="/admin/providers/:providerId" element={<AdminProviderDetailPage />} />
          <Route path="/admin/shipments" element={<AdminShipmentsPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/admin/containers" element={<AdminContainersPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/disputes" element={<AdminDisputesPage />} />
          <Route path="/admin/disputes/:disputeId" element={<AdminDisputeDetailPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;