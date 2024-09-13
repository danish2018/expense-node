import mongoose from "mongoose";

// Define the Expense schema
const expenseSchema = new mongoose.Schema({
  date: { type: String, required: true },
  amount: { type: String, required: true },
  goods: { type: String, required: true },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Define the Expense model
const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
