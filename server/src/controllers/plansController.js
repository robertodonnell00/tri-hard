import Plan from "../models/Plan.js";
import mongoose from "mongoose";
import { generateOutline } from "../services/planGenerator.js";

const isId = (id) => mongoose.Types.ObjectId.isValid(id);

export async function listPlans(req, res) {
  try {
    const { eventType } = req.query;

    const filter = {
      user: req.user.id,
    };

    if (eventType) {
      filter.eventType = eventType;
    }

    const plans = await Plan.find(filter).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch plans",
      details: err.message,
    });
  }
}

export async function getPlan(req, res) {
  try {
    const { id } = req.params;

    if (!isId(id)) {
      return res.status(400).json({ error: "Invalid plan id" });
    }

    const plan = await Plan.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    res.json(plan);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch plan",
      details: err.message,
    });
  }
}

export async function createPlan(req, res) {
  console.log("CREATE PLAN BODY:", req.body);
  console.log("REQ.USER:", req.user);
  try {
    const {
      name,
      eventType,
      raceDate,
      startDate,
      daysPerWeek,
      swimLevel,
      bikeLevel,
      runLevel,
      outline,
    } = req.body;

    if (!name || !eventType || !raceDate || !daysPerWeek) {
      return res.status(400).json({
        error: "name, eventType, raceDate, daysPerWeek are required",
      });
    }

    const plan = await Plan.create({
      user: req.user.id,
      name,
      eventType,
      raceDate,
      startDate,
      daysPerWeek,
      swimLevel,
      bikeLevel,
      runLevel,
      outline,
    });

    res.status(201).json(plan);
  } catch (err) {
    console.error("CREATE PLAN ERROR:", err);
    
    const status = err?.name === "ValidationError" ? 400 : 500;

    res.status(status).json({
      error: "Failed to create plan",
      details: err.message,
    });
  }
}

export async function updatePlan(req, res) {
  try {
    const { id } = req.params;

    if (!isId(id)) {
      return res.status(400).json({ error: "Invalid plan id" });
    }

    const plan = await Plan.findOneAndUpdate(
      {
        _id: id,
        user: req.user.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    res.json(plan);
  } catch (err) {
    res.status(500).json({
      error: "Failed to update plan",
      details: err.message,
    });
  }
}

export async function deletePlan(req, res) {
  try {
    const { id } = req.params;

    if (!isId(id)) {
      return res.status(400).json({ error: "Invalid plan id" });
    }

    const deleted = await Plan.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Plan not found" });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete plan",
      details: err.message,
    });
  }
}

export async function generatePlan(req, res) {
  try {
    const {
      eventType,
      raceDate,
      daysPerWeek,
      swimLevel,
      bikeLevel,
      runLevel,
      startDate,
    } = req.body;

    if (!eventType || !raceDate) {
      return res.status(400).json({
        error: "eventType and raceDate are required",
      });
    }

    const result = generateOutline({
      eventType,
      raceDate,
      daysPerWeek,
      swimLevel,
      bikeLevel,
      runLevel,
      startDate,
    });

    return res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: "Failed to generate plan",
      details: err.message,
    });
  }
}