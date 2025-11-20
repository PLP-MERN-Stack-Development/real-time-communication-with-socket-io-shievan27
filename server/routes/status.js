// routes/status.js
import express from "express";
import Status from "../models/Status.js";
import { verifyToken as verify } from "../middleware/auth.js";

const router = express.Router();

// post a status (requires token in Authorization: Bearer <token>)
router.post("/", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: "Unauthorized" });
    const token = auth.split(" ")[1];
    const payload = await verify(token);

    const { text, mediaUrl, expiresAt } = req.body;
    const st = new Status({
      userId: payload.id,
      username: payload.username,
      text,
      mediaUrl,
      expiresAt
    });
    await st.save();
    res.json(st);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token or error" });
  }
});

// get recent statuses
router.get("/", async (req, res) => {
  const statuses = await Status.find().sort({ createdAt: -1 }).limit(50);
  res.json(statuses);
});

export default router;
