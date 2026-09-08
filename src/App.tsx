import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import LandingPage from "./features/landing/LandingPage";

import ChooseRole from "./pages/auth/ChooseRole";
import ExporterRegister from "./pages/auth/ExporterRegister";
import ProviderRegister from "./pages/auth/ProviderRegister";
import Login from "./pages/auth/Login";

import "./App.css";

function App() {
  return (
    <Routes>
      {/* Landing */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <LandingPage />
          </>
        }
      />

      {/* Authentication */}
      <Route
        path="/register"
        element={<ChooseRole />}
      />

      <Route
        path="/register/exporter"
        element={<ExporterRegister />}
      />

      <Route
        path="/register/provider"
        element={<ProviderRegister />}
      />

      <Route
        path="/login"
        element={<Login />}
      />
    </Routes>
  );
}

export default App;