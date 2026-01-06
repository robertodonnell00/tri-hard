import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deletePlan, listPlans } from "../api/plansApi.js";

export default function PlansListPage() {
  const [plans, setPlans] = useState([]);
  const [eventType, setEventType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await listPlans(eventType || undefined);
      setPlans(data);
    } catch (err) {
      setError(err.message || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventType]);

  async function onDelete(id) {
    const ok = window.confirm("Delete this plan?");
    if (!ok) return;
    try {
      await deletePlan(id);
      setPlans((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Plans</h1>
        <Link to="/plans/new">+ New Plan</Link>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
        <label>
          Filter by eventType:{" "}
          <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
            <option value="">All</option>
            <option value="sprint">Sprint</option>
            <option value="olympic">Olympic</option>
            <option value="70.3">70.3</option>
            <option value="140.6">140.6</option>
          </select>
        </label>
        <button onClick={load}>Refresh</button>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && plans.length === 0 && <p>No plans yet.</p>}

      {!loading && !error && plans.length > 0 && (
        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {plans.map((p) => (
            <div
              key={p._id}
              style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, display: "flex", justifyContent: "space-between", gap: 12 }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div style={{ opacity: 0.8 }}>
                  {p.eventType} • {String(p.raceDate).slice(0, 10)} • {p.daysPerWeek} days/wk
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Link to={`/plans/${p._id}`}>View</Link>
                <Link to={`/plans/${p._id}/edit`}>Edit</Link>
                <button onClick={() => onDelete(p._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
