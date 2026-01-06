import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },            // e.g. "first olympic tri plan"
    eventType: { type: String, enum: ["sprint","olympic","half-iron","ironman"], required: true },
    raceDate: { type: Date, required: true },

    // how many training days per week
    daysPerWeek: { type: Number, min: 1, max: 7, required: true },

    // user’s relative strengths (0–5) for now, later replace with userId + per-discipline history
    swimLevel: { type: Number, min: 0, max: 5, default: 0 },
    bikeLevel: { type: Number, min: 0, max: 5, default: 0 },
    runLevel:  { type: Number, min: 0, max: 5, default: 0 },

    // will compute later
    outline: [{ 
      week: Number,
      focus: String,        // "Swim form + aerobic build"
      notes: String
    }]
  },
  { timestamps: true }
);

export default mongoose.model("Plan", PlanSchema);
