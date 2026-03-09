function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function weeksBetween(fromDate, toDate) {
  const ms = toDate.getTime() - fromDate.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24 * 7)));
}

function pickPhase(weekIndex, totalWeeks) {
  const taperWeeks = totalWeeks >= 6 ? 2 : 1;
  if (weekIndex > totalWeeks - taperWeeks) return "taper";

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
  const base = { swim: 0.33, bike: 0.33, run: 0.34 };
  base[weakest] += 0.12;

  const sum = base.swim + base.bike + base.run;
  base.swim /= sum;
  base.bike /= sum;
  base.run /= sum;

  const s = Math.round(base.swim * daysPerWeek);
  const b = Math.round(base.bike * daysPerWeek);
  let r = daysPerWeek - s - b;
  if (r < 0) r = 0;

  return `Suggested weekly split (~${daysPerWeek} sessions): Swim ${s}, Bike ${b}, Run ${r}. Extra focus on ${weakest}.`;
}

function getSessionCounts(daysPerWeek, weakest) {
  const counts = { swim: 1, bike: 1, run: 1 };

  let remaining = daysPerWeek - 3;

  while (remaining > 0) {
    counts[weakest] += 1;
    remaining--;

    if (remaining > 0) {
      if (weakest !== "bike") {
        counts.bike += 1;
      } else {
        counts.run += 1;
      }
      remaining--;
    }

    if (remaining > 0) {
      if (weakest !== "run") {
        counts.run += 1;
      } else {
        counts.swim += 1;
      }
      remaining--;
    }
  }

  return counts;
}

function getTrainingDays(daysPerWeek) {
  const templates = {
    1: ["Sunday"],
    2: ["Wednesday", "Saturday"],
    3: ["Tuesday", "Thursday", "Sunday"],
    4: ["Monday", "Wednesday", "Friday", "Sunday"],
    5: ["Monday", "Tuesday", "Thursday", "Saturday", "Sunday"],
    6: ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday", "Sunday"],
    7: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  };

  return templates[daysPerWeek] || templates[4];
}

function buildSession(type, phase, week, durationBase = 45) {
  if (type === "swim") {
    if (phase === "base") {
      return {
        type: "swim",
        title: "Technique Swim",
        description: "Drills, form work, and easy aerobic swimming.",
        duration: durationBase
      };
    }
    if (phase === "build") {
      return {
        type: "swim",
        title: "Threshold Swim",
        description: "Structured swim with moderate intensity efforts.",
        duration: durationBase + 10
      };
    }
    if (phase === "peak") {
      return {
        type: "swim",
        title: "Race Pace Swim",
        description: "Race-specific pace practice with steady efforts.",
        duration: durationBase + 15
      };
    }
    return {
      type: "swim",
      title: "Easy Swim",
      description: "Reduced volume swim focused on feel and confidence.",
      duration: Math.max(30, durationBase - 10)
    };
  }

  if (type === "bike") {
    if (phase === "base") {
      return {
        type: "bike",
        title: "Endurance Ride",
        description: "Steady aerobic bike session in zone 2.",
        duration: durationBase + 15
      };
    }
    if (phase === "build") {
      return {
        type: "bike",
        title: "Bike Intervals",
        description: "Bike workout with tempo or interval efforts.",
        duration: durationBase + 20
      };
    }
    if (phase === "peak") {
      return {
        type: "bike",
        title: "Race Specific Ride",
        description: "Race-pace segments and fueling practice.",
        duration: durationBase + 30
      };
    }
    return {
      type: "bike",
      title: "Easy Spin",
      description: "Short easy ride to stay sharp without fatigue.",
      duration: Math.max(35, durationBase)
    };
  }

  if (phase === "base") {
    return {
      type: "run",
      title: "Easy Run",
      description: "Aerobic run at comfortable conversational pace.",
      duration: durationBase
    };
  }
  if (phase === "build") {
    return {
      type: "run",
      title: "Tempo Run",
      description: "Moderate sustained effort to build threshold.",
      duration: durationBase + 10
    };
  }
  if (phase === "peak") {
    return {
      type: "run",
      title: "Race Pace Run",
      description: "Specific pacing and controlled effort work.",
      duration: durationBase + 15
    };
  }

  return {
    type: "run",
    title: "Short Easy Run",
    description: "Reduced volume run to stay loose during taper.",
    duration: Math.max(30, durationBase - 10)
  };
}

function generateWeekSessions(daysPerWeek, weakest, phase) {
  const counts = getSessionCounts(daysPerWeek, weakest);
  const trainingDays = getTrainingDays(daysPerWeek);

  const plannedTypes = [];

  Object.entries(counts).forEach(([type, count]) => {
    for (let i = 0; i < count; i++) {
      plannedTypes.push(type);
    }
  });

  const sessions = trainingDays.map((day, index) => {
    const type = plannedTypes[index % plannedTypes.length];
    const session = buildSession(type, phase, index + 1);

    return {
      day,
      type: session.type,
      title: session.title,
      description: session.description,
      duration: session.duration
    };
  });

  return sessions;
}

export function generateOutline({
  eventType,
  raceDate,
  daysPerWeek = 4,
  swimLevel = 3,
  bikeLevel = 3,
  runLevel = 3,
  startDate,
}) {
  const rd = new Date(raceDate);
  if (Number.isNaN(rd.getTime())) {
    throw new Error("Invalid raceDate");
  }

  const sd = startDate ? new Date(startDate) : new Date();
  sd.setHours(0, 0, 0, 0);

  const safeDaysPerWeek = clamp(Number(daysPerWeek), 1, 7);
  const totalWeeks = clamp(weeksBetween(sd, rd), 1, 52);
  const weakest = weakestDiscipline({ swimLevel, bikeLevel, runLevel });
  const split = distributionNote(weakest, safeDaysPerWeek);

  const distanceHint =
    eventType === "sprint" ? "shorter, sharper efforts" :
    eventType === "olympic" ? "balanced endurance + tempo" :
    eventType === "half-iron" ? "endurance-heavy with steady pacing" :
    "long endurance & fueling practice";

  const outline = [];

  for (let week = 1; week <= totalWeeks; week++) {
    const phase = pickPhase(week, totalWeeks);

    let focus = "";
    let notes = "";

    if (phase === "base") {
      focus = "Base building";
      notes = `Build aerobic fitness and routine. Prioritise technique (especially ${weakest}). Include 1 easy long session. ${split}`;
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

    const sessions = generateWeekSessions(safeDaysPerWeek, weakest, phase);

    outline.push({
      week,
      focus,
      notes,
      sessions
    });
  }

  return {
    totalWeeks,
    startDate: sd.toISOString().slice(0, 10),
    raceDate: rd.toISOString().slice(0, 10),
    outline,
  };
}