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
  setError("");

  try {
    await updatePlan(id, patch);
    nav(`/plans/${id}`);
  } catch (err) {
    setError(err.message || "Request failed");
    throw err;
  } finally {
    setSubmitting(false);
  }
}

  return (
    <div
        style={{
          minHeight: "100vh",
          background: "#f5f7fb",
          padding: "32px",
        }}
      >
  <div
    style={{
      maxWidth: "900px",
      margin: "0 auto",
    }}
  >
    <div style={{ marginBottom: "20px" }}>
      <Link
        to={`/plans/${id}`}
        style={{
          color: "#2563eb",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
         Back to plan
      </Link>
    </div>

    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "28px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "30px",
            color: "#111827",
          }}
        >
          Edit Plan
        </h1>

        <p
          style={{
            margin: "8px 0 0",
            color: "#6b7280",
          }}
        >
          Update your race details, training availability, and generated outline.
        </p>
      </div>

      {loading && (
        <p
          style={{
            background: "#eff6ff",
            color: "#1d4ed8",
            padding: "12px 14px",
            borderRadius: "10px",
            fontWeight: 600,
          }}
        >
          Loading plan…
        </p>
      )}

      {error && (
        <p
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            padding: "12px 14px",
            borderRadius: "10px",
            fontWeight: 600,
          }}
        >
          {error}
        </p>
      )}

      {!loading && plan && (
        <PlanForm
          initialValue={plan}
          onSubmit={onSubmit}
          submitting={submitting}
          submitLabel="Save changes"
        />
      )}
    </div>
  </div>
</div>
  );
}
