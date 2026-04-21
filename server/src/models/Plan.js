import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  day: { type: String, required: true },
  type: {
    type: String,
    enum: ["swim", "bike", "run"],
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  duration: { type: Number, default: 0 },
});

const WeekSchema = new mongoose.Schema({
  week: { type: Number, required: true },
  focus: { type: String, default: "" },
  notes: { type: String, default: "" },
  sessions: [SessionSchema],
});

const PlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, 
    },

    name: { type: String, required: true },

    eventType: {
      type: String,
      enum: ["sprint", "olympic", "half-iron", "ironman"],
      required: true,
    },

    raceDate: { type: Date, required: true },

    daysPerWeek: {
      type: Number,
      min: 1,
      max: 7,
      required: true,
    },

    swimLevel: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    bikeLevel: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    runLevel: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    startDate: { type: Date },

    outline: [WeekSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Plan", PlanSchema);