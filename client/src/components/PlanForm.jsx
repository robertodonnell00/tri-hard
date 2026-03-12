import { useEffect, useMemo, useState } from "react";
import { generatePlan } from "../api/plansApi.js";

const defaultPlan = {
  name: "",
  eventType: "sprint",
  raceDate: "",
  startDate: "",
  daysPerWeek: 4,
  swimLevel: 3,
  bikeLevel: 3,
  runLevel: 3,
  outline: [],
};

export default function PlanForm({
  initialValue,
  onSubmit,
  submitting = false,
  submitLabel = "Save",
}) {
  const initial = useMemo(
    () => ({ ...defaultPlan, ...(initialValue ?? {}) }),
    [initialValue]
  );

  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onGenerate() {
    setError("");

    if (!form.eventType) return setError("Event type is required to generate.");
    if (!form.raceDate) return setError("Race date is required to generate.");

    setGenerating(true);

    try {
      const result = await generatePlan({
        eventType: form.eventType,
        raceDate: form.raceDate,
        startDate: form.startDate || undefined,
        daysPerWeek: Number(form.daysPerWeek),
        swimLevel: Number(form.swimLevel),
        bikeLevel: Number(form.bikeLevel),
        runLevel: Number(form.runLevel),
      });

      setForm((prev) => ({
        ...prev,
        startDate: result.startDate ?? "",
        outline: result.outline ?? [],
      }));
    } catch (err) {
      setError(err.message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Name is required.");
    if (!form.raceDate) return setError("Race date is required.");
    if (!form.daysPerWeek) return setError("Days per week is required.");
    if (!form.startDate) return setError("Generate the plan first so a start date is created.");
    if (!form.outline?.length) return setError("Generate the outline before saving.");

    try {
      const payload = {
        ...form,
        daysPerWeek: Number(form.daysPerWeek),
        swimLevel: Number(form.swimLevel),
        bikeLevel: Number(form.bikeLevel),
        runLevel: Number(form.runLevel),
      };

      console.log("Submitting plan payload:", payload);

      await onSubmit(payload);
    } catch (err) {
      setError(err.message || "Failed to save plan");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: 16,
        maxWidth: 760,
      }}
    >
      {error && (
        <div
          style={{
            padding: 10,
            border: "1px solid #f5c2c7",
            background: "#f8d7da",
            borderRadius: 8,
          }}
        >
          {error}
        </div>
      )}

      <label>
        Name
        <input
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. Sprint Plan - March"
          style={{ width: "100%" }}
        />
      </label>

      <label>
        Event Type
        <select
          value={form.eventType}
          onChange={(e) => set("eventType", e.target.value)}
        >
          <option value="sprint">Sprint</option>
          <option value="olympic">Olympic</option>
          <option value="half-iron">70.3</option>
          <option value="ironman">140.6</option>
        </select>
      </label>

      <label>
        Race Date
        <input
          type="date"
          value={form.raceDate ? String(form.raceDate).slice(0, 10) : ""}
          onChange={(e) => set("raceDate", e.target.value)}
        />
      </label>

      <label>
        Training Start Date (optional)
        <input
          type="date"
          value={form.startDate ? String(form.startDate).slice(0, 10) : ""}
          onChange={(e) => set("startDate", e.target.value)}
        />
      </label>

      <label>
        Days / Week
        <input
          type="number"
          min={1}
          max={7}
          value={form.daysPerWeek}
          onChange={(e) => set("daysPerWeek", e.target.value)}
        />
      </label>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
        }}
      >
        <label>
          Swim Level
          <input
            type="number"
            min={1}
            max={5}
            value={form.swimLevel}
            onChange={(e) => set("swimLevel", e.target.value)}
          />
        </label>

        <label>
          Bike Level
          <input
            type="number"
            min={1}
            max={5}
            value={form.bikeLevel}
            onChange={(e) => set("bikeLevel", e.target.value)}
          />
        </label>

        <label>
          Run Level
          <input
            type="number"
            min={1}
            max={5}
            value={form.runLevel}
            onChange={(e) => set("runLevel", e.target.value)}
          />
        </label>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Outline</h3>
        <button type="button" onClick={onGenerate} disabled={generating}>
          {generating ? "Generating..." : "Generate outline"}
        </button>
      </div>

      {form.startDate ? (
        <div style={{ opacity: 0.8 }}>
          Plan starts: {String(form.startDate).slice(0, 10)}
        </div>
      ) : null}

      {form.outline.length === 0 ? (
        <div style={{ opacity: 0.7 }}>No generated outline yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {form.outline.map((row, idx) => (
            <div
              key={row._id ?? idx}
              style={{
                border: "1px solid #ddd",
                padding: 12,
                borderRadius: 8,
                display: "grid",
                gap: 6,
              }}
            >
              <div style={{ fontWeight: 700 }}>
                Week {row.week}: {row.focus}
              </div>

              {row.notes ? (
                <div style={{ opacity: 0.85 }}>{row.notes}</div>
              ) : null}

              <div style={{ fontSize: 14, opacity: 0.75 }}>
                Sessions: {row.sessions?.length ?? 0}
              </div>
            </div>
          ))}
        </div>
      )}

      <button disabled={submitting} type="submit">
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}