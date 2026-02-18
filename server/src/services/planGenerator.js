function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function weeksBetween(fromDate, toDate) {
  const ms = toDate.getTime() - fromDate.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24 * 7)));
}

function pickPhase(weekIndex, totalWeeks) {
  // last 2 weeks taper (or last 1 if plan v short)
  const taperWeeks = totalWeeks >= 6 ? 2 : 1;
  if (weekIndex > totalWeeks - taperWeeks) return "taper";

  // rough phases
  const baseEnd = Math.ceil(totalWeeks * 0.45);
  const buildEnd = Math.ceil(totalWeeks * 0.8);

  if (weekIndex <= baseEnd) return "base";
  if (weekIndex <= buildEnd) return "build";
  return "peak";
}

function weakestDiscipline({ swimLevel, bikeLevel, runLevel }) {
  const levels = [
    { key: "swim", v: swimLevel ?? 3 },
    { key: "bike", v: bikeLevel ?? 3 },
    { key: "run", v: runLevel ?? 3 },
  ];
  levels.sort((a, b) => a.v - b.v);
  return levels[0].key;
}

function distributionNote(weakest, daysPerWeek) {
  // simple bias toward weakest one
  const base = { swim: 0.33, bike: 0.33, run: 0.34 };
  base[weakest] += 0.12;
  // normalise
  const sum = base.swim + base.bike + base.run;
  base.swim /= sum; base.bike /= sum; base.run /= sum;

  const s = Math.round(base.swim * daysPerWeek);
  const b = Math.round(base.bike * daysPerWeek);
  let r = daysPerWeek - s - b;
  // keep non-negative
  if (r < 0) r = 0;

  return `Suggested weekly split (~${daysPerWeek} sessions): Swim ${s}, Bike ${b}, Run ${r}. Extra focus on ${weakest}.`;
}

export function generateOutline({
  eventType,
  raceDate,
  daysPerWeek = 4,
  swimLevel = 3,
  bikeLevel = 3,
  runLevel = 3,
  startDate, // optional
}) {
  const rd = new Date(raceDate);
  if (Number.isNaN(rd.getTime())) {
    throw new Error("Invalid raceDate");
  }

  const sd = startDate ? new Date(startDate) : new Date();
  // start at beginning of today for cleaner weekly calculations
  sd.setHours(0, 0, 0, 0);

  const totalWeeks = clamp(weeksBetween(sd, rd), 1, 52);
  const weakest = weakestDiscipline({ swimLevel, bikeLevel, runLevel });
  const split = distributionNote(weakest, clamp(Number(daysPerWeek), 1, 7));

  const distanceHint =
    eventType === "sprint" ? "shorter, sharper efforts" :
    eventType === "olympic" ? "balanced endurance + tempo" :
    eventType === "70.3" ? "endurance-heavy with steady pacing" :
    "long endurance & fueling practice";

  const outline = [];
  for (let week = 1; week <= totalWeeks; week++) {
    const phase = pickPhase(week, totalWeeks);

    let focus = "";
    let notes = "";

    if (phase === "base") {
      focus = "Base building";
      notes = `Build aerobic fitness and routine. Priori]tise technique (especially ${weakest}). Include 1 easy long session. ${split}`;
    } else if (phase === "build") {
      focus = "Build + intensity";
      notes = `Add 1 quality session (tempo/intervals) per week while keeping volume steady. Brick session every 1–2 weeks. ${split}`;
    } else if (phase === "peak") {
      focus = "Peak specificity";
      notes = `Race-specific workouts: pacing, transitions, and fueling. Include a longer brick. Keep recovery tight. ${distanceHint} ${split}`;
    } else {
      focus = "Taper + sharpen";
      notes = `Reduce volume, keep a little intensity. Prioritise sleep, mobility, and confidence. Practice race kit + transitions. ${distanceHint}`;
    }

    outline.push({ week, focus, notes });
  }

  return {
    totalWeeks,
    startDate: sd.toISOString().slice(0, 10),
    raceDate: rd.toISOString().slice(0, 10),
    outline,
  };
}
