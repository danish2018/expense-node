import mongoose from "mongoose";

// Define the Bill schema
const billSchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  date: { type: Date, required: true },
  billing_address: { type: String, required: true },
  shipping_address: { type: String },
  invoice_no: { type: String, required: true, unique: true },
  contact_no: { type: String },
  products: [
    {
      sNo: { type: Number },
      product_name: { type: String, required: true },
      qty: { type: Number, required: true },
      unit: { type: String },
      price: { type: Number, required: true },
      gst: { type: Number, default: 0 },
      total: { type: Number, default: 0.0 },
    },
  ],
});

// Create the Bill model
const Bill = mongoose.model("Bill", billSchema);

export default Bill;
