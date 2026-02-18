import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";   // ✅ ADD

const app = express();

app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);  // ✅ ADD

export default app;
