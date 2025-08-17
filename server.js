import dotenv from "dotenv";
dotenv.config();
import express from "express";
import billRoute from "./routers/bill-router.js";
import authRoute from "./routers/auth-router.js";
import conn from "./utils/db.js";
import errorMiddleware from "./middleware/error-middleware.js";
import cors from "cors";
const app = express();

app.use(express.json());

const corsOptions = {
  origin: "*", // Allow all origins; adjust this to be more restrictive as needed
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
};

// Use the CORS middleware
app.use(cors(corsOptions));

const URI = process.env.MONGODB_URI;
app.use("/api/auth", authRoute);
app.use("/api/bill", billRoute);

app.use(errorMiddleware);

const port = 5000;
conn(URI).then(() => {
  // Pass URI to conn function
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});

export default app;
