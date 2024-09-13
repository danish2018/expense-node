import express from "express";
import {
  addExpense,
  deleteExpenseById,
  expenseByUserId,
  getAllExpense,
  getExpenseById,
  updateExpenseById,
} from "../controllers/expense-controller.js";
import authMiddleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllExpense);
router.get("/:id", authMiddleware, getExpenseById);
router.get("/user/:id", authMiddleware, expenseByUserId);
router.post("/add", authMiddleware, addExpense);
router.patch("/update/:id", authMiddleware, updateExpenseById);
router.delete("/delete/:id", authMiddleware, deleteExpenseById);

export default router;
