import Expense from "../models/expense-model.js";
// import User from "../models/user-model.js";
const addExpense = async (req, res, next) => {
  try {
    const data = req.body;
    await Expense.create(data);
    return res.status(201).json({ message: "Added Succesdfully" });
  } catch (error) {
    next(error);
  }
};

const getAllExpense = async (req, res, next) => {
  try {
    // Fetch all expenses and populate user details
    const expenses = await Expense.find().populate("addedBy", "username");

    if (!expenses || expenses.length === 0) {
      return res.status(400).json({ message: "No expenses found" });
    }

    // Calculate the total amount of all expenses
    const totalAmount = expenses.reduce(
      (accumulator, exp) => accumulator + parseFloat(exp.amount),
      0
    );

    // Get the unique user IDs from the expenses
    const uniqueUserIds = [
      ...new Set(expenses.map((exp) => exp.addedBy._id.toString())),
    ];

    // Calculate the per-head amount based on the number of unique users
    const perHeadAmount =
      uniqueUserIds.length > 0 ? totalAmount / uniqueUserIds.length : 0;

    // Group expenses by user and calculate totals
    const userExpenseTotals = expenses.reduce((accumulator, exp) => {
      // Use the user ID of the person who added the expense
      

      const userId = exp.addedBy._id.toString();
      const userName = exp.addedBy.username;
     

      if (!accumulator[userId]) {
        accumulator[userId] = {
          userName: userName,
          yourDues: perHeadAmount, // Assuming perHeadAmount is defined earlier
          yourAmount: 0,
        };
      }

      // Update the user's totals
      accumulator[userId].yourDues -= parseFloat(exp.amount);
      accumulator[userId].yourAmount += parseFloat(exp.amount);

      return accumulator;
    }, {});

    // Convert the grouped results to an array
    const userExpenseDetails = userExpenseTotals[req.userID];
    const userExpensesArray = Object.values(userExpenseTotals);

    // Send response with expenses, total amount, per-head amount, and user expense details
    return res.status(200).json({
      data: {
        expenses: expenses,
        totalAmount: totalAmount.toFixed(2),
        perHeadAmount: perHeadAmount.toFixed(2),
        yourDetails: userExpenseDetails,
        userExpenses: userExpensesArray,
      },
    });
  } catch (error) {
    // Pass error to the error handling middleware
    next(error);
  }
};

const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id });
    return res.status(200).json({ data: expense });
  } catch (error) {
    next(error);
  }
};

const updateExpenseById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const expenses = await Expense.updateOne(
      { _id: id },
      { $set: updatedData }
    );

    return res
      .status(200)
      .json({ message: "Data updated Successfully", data: expenses });
  } catch (error) {
    res.status(400).json({ error });
    next(error);
  }
};

const deleteExpenseById = async (req, res, next) => {
  try {
    await Expense.deleteOne({ _id: req.params.id });
    return res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

const expenseByUserId = async (req, res, next) => {
  try {
    const data = await Expense.find({ addedBy: req.params.id });
    if (data) {
      return res.status(200).json({ data });
    }
    return res.status(404).json({ message: "No Data Found" });
  } catch (error) {
    next(error);
  }
};

export {
  addExpense,
  getAllExpense,
  updateExpenseById,
  getExpenseById,
  deleteExpenseById,
  expenseByUserId,
};
