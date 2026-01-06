import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import PlanForm from "../components/PlanForm.jsx";
import { getPlan, updatePlan } from "../api/plansApi.js";

export default function PlanEditPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getPlan(id);
        // raceDate: yyyy-mm-dd for the date input
        setPlan({ ...data, raceDate: String(data.raceDate).slice(0, 10) });
      } catch (err) {
        setError(err.message || "Failed to load plan");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function onSubmit(patch) {
    setSubmitting(true);
    await updatePlan(id, patch);
    nav(`/plans/${id}`);
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 12 }}>
        <Link to={`/plans/${id}`}>← Back</Link>
      </div>

      <h1>Edit Plan</h1>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {!loading && plan && (
        <PlanForm
          initialValue={plan}
          onSubmit={onSubmit}
          submitting={submitting}
          submitLabel="Save changes"
        />
      )}
    </div>
  );
}
