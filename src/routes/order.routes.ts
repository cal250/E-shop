import { Router } from "express";
import {
  createOrder,
  getOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller";
import { requireRole } from "../middlewares/auth.middleware";

const router = Router();
router.post("/", createOrder);
router.get("/:id", getOrder);
router.get("/", requireRole("ADMIN"), getAllOrders);
router.put("/:id/status", requireRole("ADMIN"), updateOrderStatus);

export default router;
