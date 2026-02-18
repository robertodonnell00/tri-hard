import express from "express";
import {
  listPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  generatePlan
} from "../controllers/plansController.js";

const router = express.Router();

router.get("/", listPlans);
router.get("/:id", getPlan);
router.post("/", createPlan);
router.patch("/:id", updatePlan);
router.delete("/:id", deletePlan);
router.post("/generate", generatePlan);

export default router;
