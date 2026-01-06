import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPlan } from "../api/plansApi.js";

export default function PlanViewPage() {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getPlan(id);
        setPlan(data);
      } catch (err) {
        setError(err.message || "Failed to load plan");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
        <Link to="/plans">← Back</Link>
        <Link to={`/plans/${id}/edit`}>Edit</Link>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && plan && (
        <>
          <h1 style={{ marginBottom: 6 }}>{plan.name}</h1>
          <div style={{ opacity: 0.85 }}>
            {plan.eventType} • {String(plan.raceDate).slice(0, 10)} • {plan.daysPerWeek} days/week
          </div>

          <h3 style={{ marginTop: 18 }}>Levels</h3>
          <ul>
            <li>Swim: {plan.swimLevel}</li>
            <li>Bike: {plan.bikeLevel}</li>
            <li>Run: {plan.runLevel}</li>
          </ul>

          <h3 style={{ marginTop: 18 }}>Outline</h3>
          {plan.outline?.length ? (
            <div style={{ display: "grid", gap: 10 }}>
              {plan.outline.map((w) => (
                <div key={w._id ?? `${w.week}-${w.focus}`} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
                  <div style={{ fontWeight: 700 }}>Week {w.week}: {w.focus}</div>
                  {w.notes ? <div style={{ marginTop: 6, opacity: 0.85 }}>{w.notes}</div> : null}
                </div>
              ))}
            </div>
          ) : (
            <p>No outline yet.</p>
          )}
        </>
      )}
    </div>
  );
}
