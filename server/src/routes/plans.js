import express from "express";
import Plan from "../models/Plan.js";
import mongoose from "mongoose";

const router = express.Router();

// helper, check ObjectId
const isId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/plans  (lists with basic filter)
router.get("/", async (req, res) => {
  try {
    const { eventType } = req.query;
    const filter = {};
    if (eventType) filter.eventType = eventType;
    const plans = await Plan.find(filter).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch plans", details: err.message });
  }
});

// GET /api/plans/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ error: "Invalid plan id" });
    const plan = await Plan.findById(id);
    if (!plan) return res.status(404).json({ error: "Plan not found" });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch plan", details: err.message });
  }
});

// POST /api/plans
router.post("/", async (req, res) => {
  try {
    const { name, eventType, raceDate, daysPerWeek, swimLevel, bikeLevel, runLevel, outline } = req.body;

    // minimal validation (lightweight for now)
    if (!name || !eventType || !raceDate || !daysPerWeek) {
      return res.status(400).json({ error: "name, eventType, raceDate, daysPerWeek are required" });
    }

    const plan = await Plan.create({
      name,
      eventType,
      raceDate,
      daysPerWeek,
      swimLevel,
      bikeLevel,
      runLevel,
      outline
    });

    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ error: "Failed to create plan", details: err.message });
  }
});

// PATCH /api/plans/:id  (partial update)
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ error: "Invalid plan id" });

    const updated = await Plan.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: "Plan not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update plan", details: err.message });
  }
});

// DELETE /api/plans/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ error: "Invalid plan id" });

    const deleted = await Plan.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Plan not found" });

    res.json({ ok: true, id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete plan", details: err.message });
  }
});

export default router;
