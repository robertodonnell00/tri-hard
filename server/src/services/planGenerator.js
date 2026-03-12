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
    { key: "swim", v: Number(swimLevel ?? 3) },
    { key: "bike", v: Number(bikeLevel ?? 3) },
    { key: "run", v: Number(runLevel ?? 3) },
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

  let s = Math.round(base.swim * daysPerWeek);
  let b = Math.round(base.bike * daysPerWeek);
  let r = daysPerWeek - s - b;

  if (r < 0) r = 0;

  // Ensure total still equals daysPerWeek
  while (s + b + r < daysPerWeek) {
    if (weakest === "swim") s++;
    else if (weakest === "bike") b++;
    else r++;
  }

  while (s + b + r > daysPerWeek) {
    if (r > 0) r--;
    else if (b > 0) b--;
    else if (s > 0) s--;
  }

  return `Suggested weekly split (~${daysPerWeek} sessions): Swim ${s}, Bike ${b}, Run ${r}. Extra focus on ${weakest}.`;
}

function getSessionCounts(daysPerWeek, weakest) {
  const safeDays = clamp(Number(daysPerWeek) || 4, 1, 7);

  // Handle very low-frequency weeks explicitly
  if (safeDays === 1) {
    return {
      swim: weakest === "swim" ? 1 : 0,
      bike: weakest === "bike" ? 1 : 0,
      run: weakest === "run" ? 1 : 0,
    };
  }

  if (safeDays === 2) {
    const counts = { swim: 0, bike: 0, run: 0 };
    counts[weakest] += 1;

    const others = ["swim", "bike", "run"].filter((d) => d !== weakest);
    counts[others[0]] += 1;

    return counts;
  }

  const counts = { swim: 1, bike: 1, run: 1 };
  let remaining = safeDays - 3;

  const rotation =
    weakest === "swim"
      ? ["swim", "bike", "run"]
      : weakest === "bike"
      ? ["bike", "run", "swim"]
      : ["run", "bike", "swim"];

  let i = 0;
  while (remaining > 0) {
    counts[rotation[i % rotation.length]] += 1;
    remaining--;
    i++;
  }

  return counts;
}

function getTrainingDays(daysPerWeek) {
  const templates = {
    1: ["Sunday"],
    2: ["Wednesday", "Sunday"],
    3: ["Tuesday", "Thursday", "Sunday"],
    4: ["Monday", "Wednesday", "Friday", "Sunday"],
    5: ["Monday", "Tuesday", "Thursday", "Saturday", "Sunday"],
    6: ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday", "Sunday"],
    7: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  };

  return templates[daysPerWeek] || templates[4];
}

function pickFromPool(pool, week) {
  if (!Array.isArray(pool) || pool.length === 0) {
    throw new Error("Session pool is empty");
  }

  if (!Number.isInteger(week) || week < 1) {
    throw new Error(`Invalid week passed to pickFromPool: ${week}`);
  }

  return pool[(week - 1) % pool.length];
}

function buildSession(type, phase, week) {
  const sessionPools = {
    swim: {
      base: [
        {
          title: "Technique Swim",
          description: "Drills, form work, and easy aerobic swimming.",
          duration: 45,
        },
        {
          title: "Aerobic Swim",
          description: "Steady continuous swimming focused on relaxed effort.",
          duration: 50,
        },
        {
          title: "Pull + Form Swim",
          description: "Pull buoy work with technique focus.",
          duration: 45,
        },
      ],
      build: [
        {
          title: "Threshold Swim",
          description: "Structured swim with moderate intensity efforts.",
          duration: 55,
        },
        {
          title: "CSS Swim",
          description: "Sustained efforts around threshold pace.",
          duration: 60,
        },
        {
          title: "Pace Change Swim",
          description: "Alternating steady and harder efforts.",
          duration: 55,
        },
      ],
      peak: [
        {
          title: "Race Pace Swim",
          description: "Race-specific pace practice with steady efforts.",
          duration: 60,
        },
        {
          title: "Open Water Skills",
          description: "Sighting, rhythm, and race-specific confidence work.",
          duration: 50,
        },
        {
          title: "Race Simulation Swim",
          description: "Controlled race effort with short recoveries.",
          duration: 60,
        },
      ],
      taper: [
        {
          title: "Easy Swim",
          description: "Reduced volume swim focused on feel and confidence.",
          duration: 35,
        },
        {
          title: "Sharpening Swim",
          description: "Short controlled efforts with plenty of recovery.",
          duration: 35,
        },
      ],
    },

    bike: {
      base: [
        {
          title: "Endurance Ride",
          description: "Steady aerobic bike session in zone 2.",
          duration: 60,
        },
        {
          title: "Cadence Ride",
          description: "Easy aerobic ride with cadence focus.",
          duration: 55,
        },
        {
          title: "Long Endurance Ride",
          description: "Longer steady ride building aerobic durability.",
          duration: 90,
        },
      ],
      build: [
        {
          title: "Bike Intervals",
          description: "Bike workout with tempo or interval efforts.",
          duration: 70,
        },
        {
          title: "Tempo Ride",
          description: "Sustained moderate effort to build bike strength.",
          duration: 75,
        },
        {
          title: "Brick Ride",
          description: "Steady ride designed to flow into a short run.",
          duration: 75,
        },
      ],
      peak: [
        {
          title: "Race Specific Ride",
          description: "Race-pace segments and fueling practice.",
          duration: 90,
        },
        {
          title: "Long Brick Ride",
          description: "Longer ride with race-specific pacing and transition practice.",
          duration: 100,
        },
        {
          title: "Threshold Ride",
          description: "Harder sustained efforts with controlled recovery.",
          duration: 80,
        },
      ],
      taper: [
        {
          title: "Easy Spin",
          description: "Short easy ride to stay sharp without fatigue.",
          duration: 40,
        },
        {
          title: "Race Prep Ride",
          description: "Short controlled ride with a few race-pace efforts.",
          duration: 45,
        },
      ],
    },

    run: {
      base: [
        {
          title: "Easy Run",
          description: "Aerobic run at comfortable conversational pace.",
          duration: 40,
        },
        {
          title: "Steady Run",
          description: "Smooth aerobic run building consistency.",
          duration: 45,
        },
        {
          title: "Long Run",
          description: "Longer easy run to build endurance.",
          duration: 60,
        },
      ],
      build: [
        {
          title: "Tempo Run",
          description: "Moderate sustained effort to build threshold.",
          duration: 50,
        },
        {
          title: "Intervals Run",
          description: "Shorter harder efforts with easy recovery.",
          duration: 45,
        },
        {
          title: "Hill Repeats",
          description: "Uphill efforts to build strength and running economy.",
          duration: 50,
        },
      ],
      peak: [
        {
          title: "Race Pace Run",
          description: "Specific pacing and controlled effort work.",
          duration: 50,
        },
        {
          title: "Brick Run",
          description: "Short run off the bike to practise race feel.",
          duration: 35,
        },
        {
          title: "Race Simulation Run",
          description: "Controlled efforts near intended race pace.",
          duration: 55,
        },
      ],
      taper: [
        {
          title: "Short Easy Run",
          description: "Reduced volume run to stay loose during taper.",
          duration: 30,
        },
        {
          title: "Sharpening Run",
          description: "Short controlled run with a few quicker efforts.",
          duration: 30,
        },
      ],
    },
  };

  const pool = sessionPools[type]?.[phase];

  if (!pool?.length) {
    throw new Error(`Unsupported session type or phase: type=${type}, phase=${phase}`);
  }

  const selected = pickFromPool(pool, week);

  return {
    type,
    title: selected.title,
    description: selected.description,
    duration: selected.duration,
  };
}

function expandCountsToTypes(counts) {
  const order = ["swim", "bike", "run"];
  const result = [];
  const remaining = { ...counts };

  let added = true;
  while (added) {
    added = false;
    for (const type of order) {
      if ((remaining[type] || 0) > 0) {
        result.push(type);
        remaining[type] -= 1;
        added = true;
      }
    }
  }

  return result;
}

function generateWeekSessions(daysPerWeek, weakest, phase, week) {
  const safeDays = clamp(Number(daysPerWeek) || 4, 1, 7);
  const counts = getSessionCounts(safeDays, weakest);
  const trainingDays = getTrainingDays(safeDays);

  const plannedTypes = expandCountsToTypes(counts);

  const sessions = trainingDays.map((day, index) => {
    const type = plannedTypes[index % plannedTypes.length];
    const session = buildSession(type, phase, week);

    return {
      day,
      type: session.type,
      title: session.title,
      description: session.description,
      duration: session.duration,
    };
  });

  if (phase === "base" || phase === "build" || phase === "peak") {
    const longSessionIndex = sessions.findIndex(
      (s) => s.title.includes("Long") || s.type === "bike"
    );

    if (longSessionIndex !== -1) {
      sessions[longSessionIndex] = {
        ...sessions[longSessionIndex],
        duration: sessions[longSessionIndex].duration + 15,
      };
    }
  }

  if ((phase === "build" || phase === "peak") && week % 2 === 0) {
    const bikeIndex = sessions.findIndex((s) => s.type === "bike");
    const runIndex = sessions.findIndex((s) => s.type === "run");

    if (bikeIndex !== -1 && runIndex !== -1) {
      sessions[bikeIndex] = {
        ...sessions[bikeIndex],
        title: phase === "peak" ? "Long Brick Ride" : "Brick Ride",
        description: "Bike session designed to prepare for a short transition run.",
      };

      sessions[runIndex] = {
        ...sessions[runIndex],
        title: "Brick Run",
        description: "Short run off the bike to practise transition legs.",
        duration: Math.min(sessions[runIndex].duration, 35),
      };
    }
  }

  return sessions;
}

function normaliseEventType(eventType) {
  const value = String(eventType || "").trim().toLowerCase();

  if (value === "70.3" || value === "half iron" || value === "half ironman") {
    return "half-iron";
  }

  if (value === "140.6" || value === "full ironman" || value === "ironman") {
    return "ironman";
  }

  if (value === "sprint" || value === "olympic" || value === "half-iron") {
    return value;
  }

  return "olympic";
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
  rd.setHours(0, 0, 0, 0);

  const sd = startDate ? new Date(startDate) : new Date();
  if (Number.isNaN(sd.getTime())) {
    throw new Error("Invalid startDate");
  }
  sd.setHours(0, 0, 0, 0);

  const safeDaysPerWeek = clamp(Number(daysPerWeek) || 4, 1, 7);
  const totalWeeks = clamp(weeksBetween(sd, rd), 1, 52);
  const weakest = weakestDiscipline({ swimLevel, bikeLevel, runLevel });
  const split = distributionNote(weakest, safeDaysPerWeek);
  const safeEventType = normaliseEventType(eventType);

  const distanceHint =
    safeEventType === "sprint"
      ? "shorter, sharper efforts"
      : safeEventType === "olympic"
      ? "balanced endurance + tempo"
      : safeEventType === "half-iron"
      ? "endurance-heavy with steady pacing"
      : "long endurance & fueling practice";

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

    const sessions = generateWeekSessions(safeDaysPerWeek, weakest, phase, week);

    outline.push({
      week,
      focus,
      notes,
      sessions,
    });
  }

  return {
    totalWeeks,
    startDate: sd.toISOString().slice(0, 10),
    raceDate: rd.toISOString().slice(0, 10),
    outline,
  };
}