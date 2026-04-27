import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  generatePlan
} from "../controllers/plansController.js";

const router = express.Router();

router.get("/", protect, listPlans);
router.post("/", protect, createPlan);
router.post("/generate", protect, generatePlan);
router.get("/:id", protect, getPlan);
router.put("/:id", protect, updatePlan);
router.delete("/:id", protect, deletePlan);


export default router;
