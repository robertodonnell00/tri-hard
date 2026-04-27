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
    <div
  style={{
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "32px",
  }}
>
  <div
    style={{
      maxWidth: "1100px",
      margin: "0 auto",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: "32px", color: "#111827" }}>
          Training Plans
        </h1>
        <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
          View, manage, and create your triathlon training plans.
        </p>
      </div>

      <Link
        to="/plans/new"
        style={{
          background: "#2563eb",
          color: "white",
          padding: "10px 16px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        + New Plan
      </Link>
    </div>

    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        display: "flex",
        gap: "12px",
        alignItems: "center",
      }}
    >
      <label style={{ fontWeight: 600, color: "#374151" }}>
        Filter by event type
      </label>

      <select
        value={eventType}
        onChange={(e) => setEventType(e.target.value)}
        style={{
          padding: "9px 12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          background: "#f9fafb",
        }}
      >
        <option value="">All</option>
        <option value="sprint">Sprint</option>
        <option value="olympic">Olympic</option>
        <option value="70.3">70.3</option>
        <option value="140.6">140.6</option>
      </select>

      <button
        onClick={load}
        style={{
          padding: "9px 14px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          background: "white",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Refresh
      </button>
    </div>

    {loading && <p>Loading…</p>}

    {error && (
      <p
        style={{
          color: "#b91c1c",
          background: "#fee2e2",
          padding: "12px",
          borderRadius: "8px",
        }}
      >
        {error}
      </p>
    )}

    {!loading && !error && plans.length === 0 && (
      <div
        style={{
          background: "white",
          padding: "32px",
          borderRadius: "12px",
          textAlign: "center",
          color: "#6b7280",
        }}
      >
        No plans yet.
      </div>
    )}

    {!loading && !error && plans.length > 0 && (
      <div style={{ display: "grid", gap: "14px" }}>
        {plans.map((p) => (
          <div
            key={p._id}
            style={{
              background: "white",
              borderRadius: "14px",
              padding: "18px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: "6px",
                }}
              >
                {p.name}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  color: "#4b5563",
                  fontSize: "14px",
                }}
              >
                <span
                  style={{
                    background: "#dbeafe",
                    color: "#1d4ed8",
                    padding: "4px 8px",
                    borderRadius: "999px",
                    fontWeight: 600,
                  }}
                >
                  {p.eventType}
                </span>

                <span>{String(p.raceDate).slice(0, 10)}</span>
                <span>•</span>
                <span>{p.daysPerWeek} days/wk</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Link
                to={`/plans/${p._id}`}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "#2563eb",
                  fontWeight: 600,
                  background: "#eff6ff",
                }}
              >
                View
              </Link>

              <Link
                to={`/plans/${p._id}/edit`}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "#374151",
                  fontWeight: 600,
                  background: "#f3f4f6",
                }}
              >
                Edit
              </Link>

              <button
                onClick={() => onDelete(p._id)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#fee2e2",
                  color: "#b91c1c",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
  );
}
