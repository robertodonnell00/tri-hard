import { getDayOffset, formatDateToYYYYMMDD } from "./dateHelpers";
import { getDisciplineColor } from "./disciplineColors";

export function mapPlanToEvents(plan) {
  if (!plan || !plan.startDate || !plan.outline) return [];

  const planStartDate = new Date(plan.startDate);
  const events = [];

  plan.outline.forEach((weekBlock, weekIndex) => {
    if (!weekBlock.sessions || !Array.isArray(weekBlock.sessions)) return;

    weekBlock.sessions.forEach((session, sessionIndex) => {
      const eventDate = new Date(planStartDate);

      eventDate.setDate(
        planStartDate.getDate() +
          weekIndex * 7 +
          getDayOffset(session.day)
      );

      const color = getDisciplineColor(session.type);

      events.push({
        id: `${weekBlock.week}-${sessionIndex}`,
        title: `${session.type} - ${session.title}`,
        start: formatDateToYYYYMMDD(eventDate),
        allDay: true,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          description: session.description || "",
          duration: session.duration || "",
          discipline: session.type || "",
          week: weekBlock.week,
          day: session.day || "",
        },
      });
    });
  });

  return events;
}