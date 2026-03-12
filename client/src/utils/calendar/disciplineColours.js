export function getDisciplineColor(type) {
  const normalised = type?.toLowerCase();

  switch (normalised) {
    case "swim":
      return "#3b82f6";   // blue
    case "bike":
      return "#22c55e";   // green
    case "run":
      return "#f97316";   // orange
    default:
      return "#6b7280";   // grey fallback
  }
}