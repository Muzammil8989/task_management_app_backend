const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const { PORT } = require("./config/env");
const errorHandler = require("./middlewares/errorHandler");
const v1AuthRoutes = require("./routes/authRoutes");

const app = express();

// Database connection
connectDB();

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/v1/auth", v1AuthRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
