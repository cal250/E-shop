import { Router } from "express";
import {
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  getAllUsers,
  getLoggedInUser,
  getCustomers,
} from "../controllers/user.controller";
import { requireRole } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me", getLoggedInUser);

// Get all users with pagination
router.get("/", requireRole("ADMIN"), getAllUsers);
router.get("/customers", requireRole("ADMIN"), getCustomers);

// Get user by ID
router.get("/:id", getUserById);

// Get user by email
router.get("/email/:email", getUserByEmail);

// Update user
router.put("/:id", updateUser);

// Delete user
router.delete("/:id", deleteUser);

export default router;
