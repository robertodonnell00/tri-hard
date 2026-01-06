import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PlansListPage from "./pages/PlansListPage.jsx";
import PlanCreatePage from "./pages/PlanCreatePage.jsx";
import PlanEditPage from "./pages/PlanEditPage.jsx";
import PlanViewPage from "./pages/PlanViewPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/plans" replace />} />
        <Route path="/plans" element={<PlansListPage />} />
        <Route path="/plans/new" element={<PlanCreatePage />} />
        <Route path="/plans/:id" element={<PlanViewPage />} />
        <Route path="/plans/:id/edit" element={<PlanEditPage />} />
      </Routes>
    </BrowserRouter>
  );
}
