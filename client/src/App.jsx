import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

import PlansListPage from "./pages/PlansListPage.jsx";
import PlanCreatePage from "./pages/PlanCreatePage.jsx";
import PlanEditPage from "./pages/PlanEditPage.jsx";
import PlanViewPage from "./pages/PlanViewPage.jsx";import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/plans" replace />} />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/plans"
          element={
            <ProtectedRoute>
              <PlansListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/plans/new"
          element={
            <ProtectedRoute>
              <PlanCreatePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/plans/:id"
          element={
            <ProtectedRoute>
              <PlanViewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/plans/:id/edit"
          element={
            <ProtectedRoute>
              <PlanEditPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}