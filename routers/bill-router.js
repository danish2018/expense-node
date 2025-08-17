import express from "express";
import {
  addBill,
  deleteBillById,
  getAllBill,
  getBillById,
  getInvoiceDetails,
  updateBillById,
} from "../controllers/bill-controller.js";
import authMiddleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllBill);
router.get("/:id", authMiddleware, getBillById);
router.get("/invoice/:id", authMiddleware, getInvoiceDetails);
router.post("/add", authMiddleware, addBill);
router.put("/update/:id", authMiddleware, updateBillById);
router.delete("/delete/:id", authMiddleware, deleteBillById);

export default router;
