import dotenv from "dotenv";
dotenv.config();
import express from "express";
import expenseRoute from './routers/expense-router.js'
import authRoute from "./routers/auth-router.js";
// import adminRoute from "./routers/admin-router.js"
import conn from "./utils/db.js";
import errorMiddleware from "./middleware/error-middleware.js";
import cors from "cors";
const app = express();

app.use(express.json());

const corsOptions = {
  origin: '*', // Allow all origins; adjust this to be more restrictive as needed
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

// Use the CORS middleware
app.use(cors(corsOptions));

// const URI = "mongodb://localhost:27017/expenditure";
const URI = process.env.MONGODB_URI
app.use("/api/auth", authRoute);
app.use("/api/expense",expenseRoute);
// app.use("/api/admin",adminRoute)

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/api/data", (req, res) => {
  const data = req.body;
  res.json({ receivedData: data });
});

const port = 5000;
conn(URI).then(() => {
  // Pass URI to conn function
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});

export default app;
