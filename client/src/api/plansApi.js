const BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

async function handle(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = data?.error || data?.message || "Request failed";
    throw new Error(msg);
  }
  return data;
}

export async function listPlans(eventType) {
  const qs = eventType ? `?eventType=${encodeURIComponent(eventType)}` : "";
  const res = await fetch(`${BASE}/api/plans${qs}`);
  return handle(res);
}

export async function getPlan(id) {
  const res = await fetch(`${BASE}/api/plans/${id}`);
  return handle(res);
}

export async function createPlan(payload) {
  const res = await fetch(`${BASE}/api/plans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function updatePlan(id, patch) {
  const res = await fetch(`${BASE}/api/plans/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return handle(res);
}

export async function deletePlan(id) {
  const res = await fetch(`${BASE}/api/plans/${id}`, { method: "DELETE" });
  return handle(res);
}

export async function generatePlan(payload) {
  const res = await fetch(`${BASE}/api/plans/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}
