import { useMemo, useState } from "react";

const defaultPlan = {
  name: "",
  eventType: "sprint",
  raceDate: "",
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
  const initial = useMemo(() => ({ ...defaultPlan, ...(initialValue ?? {}) }), [initialValue]);
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  function set(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function addOutlineRow() {
    const nextWeek =
      form.outline.length > 0 ? Math.max(...form.outline.map((w) => w.week ?? 0)) + 1 : 1;

    set("outline", [...form.outline, { week: nextWeek, focus: "", notes: "" }]);
  }

  function updateOutlineRow(idx, key, value) {
    const next = form.outline.map((row, i) => (i === idx ? { ...row, [key]: value } : row));
    set("outline", next);
  }

  function removeOutlineRow(idx) {
    const next = form.outline.filter((_, i) => i !== idx);
    set("outline", next);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // minimal client-side validation 
    if (!form.name.trim()) return setError("Name is required.");
    if (!form.raceDate) return setError("Race date is required.");
    if (!form.daysPerWeek) return setError("Days per week is required.");

    try {
      // send raceDate as ISO string or date string then server handles casting
      await onSubmit({
        ...form,
        daysPerWeek: Number(form.daysPerWeek),
        swimLevel: Number(form.swimLevel),
        bikeLevel: Number(form.bikeLevel),
        runLevel: Number(form.runLevel),
      });
    } catch (err) {
      setError(err.message || "Failed to save plan");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 720 }}>
      {error && (
        <div style={{ padding: 10, border: "1px solid #f5c2c7", background: "#f8d7da" }}>
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
        <select value={form.eventType} onChange={(e) => set("eventType", e.target.value)}>
          <option value="sprint">Sprint</option>
          <option value="olympic">Olympic</option>
          <option value="70.3">70.3</option>
          <option value="140.6">140.6</option>
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
        Days / Week
        <input
          type="number"
          min={1}
          max={7}
          value={form.daysPerWeek}
          onChange={(e) => set("daysPerWeek", e.target.value)}
        />
      </label>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <label>
          Swim Level (1-5)
          <input
            type="number"
            min={1}
            max={5}
            value={form.swimLevel}
            onChange={(e) => set("swimLevel", e.target.value)}
          />
        </label>
        <label>
          Bike Level (1-5)
          <input
            type="number"
            min={1}
            max={5}
            value={form.bikeLevel}
            onChange={(e) => set("bikeLevel", e.target.value)}
          />
        </label>
        <label>
          Run Level (1-5)
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
        <h3 style={{ margin: "8px 0" }}>Outline</h3>
        <button type="button" onClick={addOutlineRow}>
          + Add week
        </button>
      </div>

      {form.outline.length === 0 ? (
        <div style={{ opacity: 0.7 }}>No outline rows yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {form.outline.map((row, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ddd",
                padding: 10,
                borderRadius: 8,
                display: "grid",
                gap: 8,
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 10 }}>
                <label>
                  Week
                  <input
                    type="number"
                    min={1}
                    value={row.week ?? ""}
                    onChange={(e) => updateOutlineRow(idx, "week", Number(e.target.value))}
                  />
                </label>
                <label>
                  Focus
                  <input
                    value={row.focus ?? ""}
                    onChange={(e) => updateOutlineRow(idx, "focus", e.target.value)}
                    placeholder="e.g. Build aerobic base"
                    style={{ width: "100%" }}
                  />
                </label>
              </div>

              <label>
                Notes
                <textarea
                  value={row.notes ?? ""}
                  onChange={(e) => updateOutlineRow(idx, "notes", e.target.value)}
                  rows={2}
                  style={{ width: "100%" }}
                />
              </label>

              <button type="button" onClick={() => removeOutlineRow(idx)} style={{ width: "fit-content" }}>
                Remove
              </button>
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
