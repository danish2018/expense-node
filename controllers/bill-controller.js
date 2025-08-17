import Bill from "../models/bill-model.js";
// import User from "../models/user-model.js";
const addBill = async (req, res, next) => {
  try {
    const data = req.body;
    await Bill.create(data);
    return res
      .status(201)
      .json({ statusCode: 201, error: false, message: "Added Successfully" });
  } catch (error) {
    next(error);
  }
};

const getAllBill = async (req, res, next) => {
  try {
    let {
      page = 0,
      count = 10,
      start_date,
      end_date,
      customer_name,
      invoice_no,
    } = req.query;

    page = parseInt(page);
    count = parseInt(count);

    let filter = {};

    if (customer_name) {
      filter.customer_name = { $regex: customer_name, $options: "i" };
    }
    if (invoice_no) {
      filter.invoice_no = { $regex: invoice_no, $options: "i" };
    }

    if (start_date && end_date) {
      const start = new Date(start_date);
      start.setHours(0, 0, 0, 0); // beginning of the day

      const end = new Date(end_date);
      end.setHours(23, 59, 59, 999); // end of the day

      filter.date = { $gte: start, $lte: end };
    } else if (start_date) {
      const start = new Date(start_date);
      start.setHours(0, 0, 0, 0);
      filter.date = { $gte: start };
    } else if (end_date) {
      const end = new Date(end_date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $lte: end };
    }

    const expense = await Bill.find(filter)
      .skip(page * count)
      .limit(count)
      .sort({ date: -1 });

    const total = await Bill.countDocuments(filter);
    return res.status(200).json({
      statusCode: 200,
      error: false,
      data: expense,
      totalCount: total,
    });
  } catch (error) {
    next(error);
  }
};

const getBillById = async (req, res, next) => {
  try {
    const expense = await Bill.findOne({ _id: req.params.id });
    return res
      .status(200)
      .json({ statusCode: 200, error: false, data: expense });
  } catch (error) {
    next(error);
  }
};

const getInvoiceDetails = async (req, res, next) => {
  try {
    const expense = await Bill.findOne({ _id: req.params.id });

    if (!expense) {
      return res.status(404).json({
        statusCode: 404,
        error: true,
        message: "Bill not found",
      });
    }

    // 🔹 Calculate totals
    let totalAmount = 0;
    let totalGST = 0;
    let grandTotal = 0;

    if (expense?.products && expense?.products?.length > 0) {
      expense?.products?.forEach((item) => {
        totalAmount += item?.total || 0;
        totalGST += item?.gst || 0;
      });
    }

    return res.status(200).json({
      statusCode: 200,
      error: false,
      data: expense,
      totalAmount,
      totalGST,
      grandTotal: totalAmount + totalGST,
    });
  } catch (error) {
    next(error);
  }
};

const updateBillById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const expenses = await Bill.updateOne({ _id: id }, { $set: updatedData });

    return res.status(200).json({
      statusCode: 200,
      error: false,
      message: "Data updated Successfully",
      data: expenses,
    });
  } catch (error) {
    res.status(400).json({ error });
    next(error);
  }
};

const deleteBillById = async (req, res, next) => {
  try {
    await Bill.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .json({ statusCode: 200, error: false, message: "Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

export {
  addBill,
  getAllBill,
  updateBillById,
  getBillById,
  deleteBillById,
  getInvoiceDetails,
};
