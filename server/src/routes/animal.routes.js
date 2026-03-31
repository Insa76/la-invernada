import { Router } from "express";
import {
  createAnimal,
  getAnimals,
  getAnimalById,
  deleteAnimal,
  updateAnimal,
  toggleFeatured,
  getMyAnimals,
  getStats,
  markAsSold
} from "../controllers/animal.controller.js";

import upload from "../middlewares/upload.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// 🔓 PUBLICO (sin login)
router.get("/", getAnimals);
router.get("/stats", getStats);
router.get("/:id", getAnimalById);

// 🔒 PRIVADO (requiere login)
router.post("/", authMiddleware, upload.array("images",3), createAnimal);
router.put("/:id", authMiddleware, updateAnimal);
router.delete("/:id", authMiddleware, deleteAnimal);
router.patch("/:id/featured", authMiddleware, toggleFeatured);
router.get("/me", authMiddleware, getMyAnimals);
router.patch("/:id/sold", authMiddleware, markAsSold);

export default router;