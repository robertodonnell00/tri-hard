import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPlan } from "../api/plansApi.js";
import { mapPlanToEvents } from "../utils/calendar/mapPlanToEvents.js";
import PlanCalendar from "../components/PlanCalendar.jsx";

export default function PlanViewPage() {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getPlan(id);
        setPlan(data);
        setEvents(mapPlanToEvents(data));
      } catch (err) {
        setError(err.message || "Failed to load plan");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

    const levelCardStyle = {
      minWidth: "90px",
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "12px 14px",
      textAlign: "center",
    };

    const levelLabelStyle = {
      display: "block",
      fontSize: "13px",
      color: "#6b7280",
      fontWeight: 600,
      marginBottom: "4px",
    };

    const levelValueStyle = {
      fontSize: "22px",
      color: "#111827",
    };

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
          marginBottom: "20px",
        }}
      >
      <Link
        to="/plans"
        style={{
          color: "#2563eb",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Back to plans
      </Link>

      <Link
        to={`/plans/${id}/edit`}
        style={{
          background: "#2563eb",
          color: "white",
          padding: "10px 16px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Edit Plan
      </Link>
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
      <>
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "28px",
            marginBottom: "24px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "24px",
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "32px",
                  color: "#111827",
                }}
              >
                {plan.name}
              </h1>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "#6b7280",
                  fontSize: "15px",
                }}
              >
                {plan.eventType} • {String(plan.raceDate).slice(0, 10)} •{" "}
                {plan.daysPerWeek} days/week
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <div style={levelCardStyle}>
                <span style={levelLabelStyle}>Swim</span>
                <strong style={levelValueStyle}>{plan.swimLevel}</strong>
              </div>

              <div style={levelCardStyle}>
                <span style={levelLabelStyle}>Bike</span>
                <strong style={levelValueStyle}>{plan.bikeLevel}</strong>
              </div>

              <div style={levelCardStyle}>
                <span style={levelLabelStyle}>Run</span>
                <strong style={levelValueStyle}>{plan.runLevel}</strong>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ marginBottom: "18px" }}>
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                color: "#111827",
              }}
            >
              Training Calendar
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#6b7280",
              }}
            >
              Review your weekly swim, bike, and run sessions.
            </p>
          </div>

          {events.length ? (
            <PlanCalendar
              events={events}
              onEventClick={(info) => {
                console.log("Clicked event:", info.event);
              }}
              onEventDrop={(info) => {
                console.log("Moved event:", info.event.id, "to", info.event.startStr);
              }}
            />
          ) : (
            <div
              style={{
                background: "#f9fafb",
                border: "1px dashed #d1d5db",
                borderRadius: "12px",
                padding: "28px",
                textAlign: "center",
                color: "#6b7280",
              }}
            >
              No calendar sessions available yet.
            </div>
          )}
        </div>
      </>
    )}
  </div>
</div>
  );
}