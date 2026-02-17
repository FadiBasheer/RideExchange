import dotenv from "dotenv";
dotenv.config();   // ✅ MUST be before using process.env

import app from "./app";
import connectDB from "./config/db";

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
