const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to the database
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Use the user routes
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));

// Error-handling middleware
app.use((err, req, res, next) => {
  const statuscode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statuscode).json({
    success: false,
    statuscode,
    message,
  });
});
