const BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem("token");

  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handle(res) {
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.details || data?.error || data?.message || "Request failed";
    throw new Error(msg);
  }

  return data;
}

export async function listPlans(eventType) {
  const qs = eventType ? `?eventType=${encodeURIComponent(eventType)}` : "";

  const res = await fetch(`${BASE}/api/plans${qs}`, {
    headers: getAuthHeaders(),
  });

  return handle(res);
}

export async function getPlan(id) {
  const res = await fetch(`${BASE}/api/plans/${id}`, {
    headers: getAuthHeaders(),
  });

  return handle(res);
}

export async function createPlan(payload) {
  const res = await fetch(`${BASE}/api/plans`, {
    method: "POST",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return handle(res);
}

export async function updatePlan(id, patch) {
  const res = await fetch(`${BASE}/api/plans/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(patch),
  });

  return handle(res);
}

export async function deletePlan(id) {
  const res = await fetch(`${BASE}/api/plans/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handle(res);
}

export async function generatePlan(payload) {
  const res = await fetch(`${BASE}/api/plans/generate`, {
    method: "POST",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return handle(res);
}