import dotenv from "dotenv";
dotenv.config();

import express from "express";
import tripsRouter from "./routes/trips.js";
import authRouter from "./routes/auth.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/users", authRouter);

app.use("/api", tripsRouter);

app.listen(PORT, () =>
  console.log("Unified server running on http://localhost:" + PORT)
);
