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
        gap: "20px",
        maxWidth: "760px",
        margin: "0 auto",
      }}>
      {error && (
        <div
          style={{
            padding: "12px 14px",
            border: "1px solid #fecaca",
            background: "#fee2e2",
            color: "#b91c1c",
            borderRadius: "10px",
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <label className="form-field" style={{ alignItems: "center" }}>
          <span>Name</span>
          <input
            className="form-input"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Sprint Plan - March"
            style={{ textAlign: "center" }}
          />
        </label>
      </div>

      <div className="form-row" style={{ justifyContent: "center" }}>
        <label className="form-field" style={{ alignItems: "center" }}>
          <span>Event Type</span>
          <select
            className="form-input"
            value={form.eventType}
            onChange={(e) => set("eventType", e.target.value)}
          >
            <option value="sprint">Sprint</option>
            <option value="olympic">Olympic</option>
            <option value="half-iron">70.3</option>
            <option value="ironman">140.6</option>
          </select>
        </label>

        <label className="form-field">
          <span>Race Date</span>
          <input
            className="form-input"
            type="date"
            value={form.raceDate ? String(form.raceDate).slice(0, 10) : ""}
            onChange={(e) => set("raceDate", e.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Training Start Date</span>
          <input
                className="form-input"
                type="date"
                value={form.startDate ? String(form.startDate).slice(0, 10) : ""}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </label>
          </div>

          <label className="form-field" style={{ alignItems: "center" }}>
            <span>Days per Week</span>
            <input
              className="form-input number-input"
              type="number"
              min={1}
              max={7}
              value={form.daysPerWeek}
              onChange={(e) => set("daysPerWeek", e.target.value)}
            />
          </label>

          <div
            className="form-row"
            style={{ justifyContent: "center" }}
          >
          <label className="form-field" style={{ alignItems: "center" }}>
            <span>Swim Level</span>
            <input
              className="form-input number-input"
              type="number"
              min={1}
              max={5}
              value={form.swimLevel}
              onChange={(e) => set("swimLevel", e.target.value)}
              style={{ textAlign: "center" }}
            />
          </label>

          <label className="form-field" style={{ alignItems: "center" }}>
            <span>Bike Level</span>
            <input
              className="form-input number-input"
              type="number"
              min={1}
              max={5}
              value={form.bikeLevel}
              onChange={(e) => set("bikeLevel", e.target.value)}
              style={{ textAlign: "center" }}
            />
          </label>

          <label className="form-field" style={{ alignItems: "center" }}>
            <span>Run Level</span>
            <input
              className="form-input number-input"
              type="number"
              min={1}
              max={5}
              value={form.runLevel}
              onChange={(e) => set("runLevel", e.target.value)}
              style={{ textAlign: "center" }}
            />
          </label>
        </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              marginTop: "8px",
              paddingTop: "20px",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <div>
              <h3 style={{ margin: 0, color: "#111827" }}>Outline</h3>
              <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>
                Generate or review the weekly training structure.
              </p>
            </div>

            <button
              type="button"
              onClick={onGenerate}
              disabled={generating}
              className="secondary-button"
            >
          {generating ? "Generating..." : "Generate outline"}
        </button>
      </div>

      {form.startDate ? (
        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            padding: "10px 12px",
            borderRadius: "10px",
            color: "#374151",
            fontSize: "14px",
          }}
        >
          Plan starts: {String(form.startDate).slice(0, 10)}
        </div>
      ) : null}

      {form.outline.length === 0 ? (
        <div
          style={{
            background: "#f9fafb",
            border: "1px dashed #d1d5db",
            borderRadius: "10px",
            padding: "20px",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          No generated outline yet.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {form.outline.map((row, idx) => (
            <div
              key={row._id ?? idx}
              style={{
                border: "1px solid #e5e7eb",
                background: "#ffffff",
                padding: "16px",
                borderRadius: "12px",
                display: "grid",
                gap: "8px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontWeight: 700, color: "#111827" }}>
                Week {row.week}: {row.focus}
              </div>

              {row.notes ? (
                <div style={{ color: "#4b5563", lineHeight: 1.5 }}>{row.notes}</div>
              ) : null}

              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                Sessions: {row.sessions?.length ?? 0}
              </div>
            </div>
          ))}
        </div>
      )}

      <button disabled={submitting} type="submit" className="primary-button">
        {submitting ? "Saving..." : submitLabel}
      </button>
</form>
  );
}