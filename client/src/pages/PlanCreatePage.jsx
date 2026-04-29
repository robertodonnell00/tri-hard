import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PlanForm from "../components/PlanForm.jsx";
import { createPlan } from "../api/plansApi.js";

export default function PlanCreatePage() {
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(payload) {
    setSubmitting(true);
    const created = await createPlan(payload);
    nav(`/plans/${created._id}`);
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 12 }}>
        <Link to="/plans"> Back</Link>
      </div>
      <h1>Create Plan</h1>
      <PlanForm onSubmit={onSubmit} submitting={submitting} submitLabel="Create" />
    </div>
  );
}
