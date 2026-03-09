export function getDisciplineColor(type) {
  const normalised = type?.toLowerCase();

  switch (normalised) {
    case "swim":
      return "#3b82f6";
    case "bike":
      return "#22c55e";
    case "run":
      return "#f97316";
    default:
      return "#6b7280";
  }
}