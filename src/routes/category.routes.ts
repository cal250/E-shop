import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { requireRole } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllCategories);

router.get("/:id", getCategoryById);

router.post("/", requireRole("ADMIN"), createCategory);

router.put("/:id", requireRole("ADMIN"), updateCategory);

router.delete("/:id", requireRole("ADMIN"), deleteCategory);

export default router;
