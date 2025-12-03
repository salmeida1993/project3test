// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { getDb } from "../db/mongo.js";
import { ObjectId } from "mongodb";

const router = express.Router();

const { AUTH_SECRET = "change-me", NODE_ENV = "development" } = process.env;

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax",
  secure: NODE_ENV === "production",
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

// Middleware
router.use(express.json());
router.use(cookieParser());

// Auth helper
function authRequired(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    req.auth = jwt.verify(token, AUTH_SECRET);
    next();
  } catch {
    res.clearCookie("token", { ...cookieOpts, maxAge: 0 });
    res.status(401).json({ message: "Session expired" });
  }
}

function sign(payload) {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: "7d" });
}

// =====================
// ROUTES
// =====================
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password || password.length < 6)
    return res.status(400).json({ message: "Invalid input" });
  const db = await getDb();
  const users = db.collection("users");

  const emailNorm = email.trim().toLowerCase();
  const exists = await users.findOne({ email: emailNorm });

  if (exists)
    return res.status(409).json({ message: "Email already registered" });

  const pass = await bcrypt.hash(password, 10);

  const doc = {
    name: name.trim(),
    email: emailNorm,
    pass,
    visitedStates: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const r = await users.insertOne(doc);

  const user = { _id: r.insertedId, name: doc.name, email: doc.email };
  const token = sign({ uid: String(user._id), email: user.email });

  res.cookie("token", token, cookieOpts);
  res.status(201).json({ user });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password)
    return res.status(400).json({ message: "Invalid input" });
  const db = await getDb();
  const users = db.collection("users");

  const u = await users.findOne({ email: email.toLowerCase() });
  if (!u || !(await bcrypt.compare(password, u.pass)))
    return res.status(401).json({ message: "Invalid email or password" });

  const token = sign({ uid: String(u._id), email: u.email });

  res.cookie("token", token, cookieOpts);
  res.json({ user: { _id: u._id, name: u.name, email: u.email } });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", { ...cookieOpts, maxAge: 0 });
  res.json({ ok: true });
});

router.get("/me", authRequired, async (req, res) => {
  const db = await getDb();
  const users = db.collection("users");

  const u = await users.findOne(
    { _id: new ObjectId(req.auth.uid) },
    { projection: { pass: 0 } }
  );

  if (!u) {
    res.clearCookie("token", { ...cookieOpts, maxAge: 0 });
    return res.status(401).json({ message: "Session expired" });
  }
  res.json({ user: u });
});

export default router;
