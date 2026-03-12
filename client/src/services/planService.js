const BASE_URL = "http://localhost:4000/api/plans";

//Get all plans
export async function getAllPlans() {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch plans");
  }

  return response.json();
}

// Get a single plan by ID
export async function getPlanById(planId) {
  const response = await fetch(`${BASE_URL}/${planId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch plan");
  }

  return response.json();
}