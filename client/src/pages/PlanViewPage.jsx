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

          <h3 style={{ marginTop: 18 }}>Training Calendar</h3>

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
            <p>No calendar sessions available yet.</p>
          )}
        </>
      )}
    </div>
  );
}