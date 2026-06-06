import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import TryOnSession from "../models/TryOnSession.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ── POST /api/tryon/session ─────────────────────────────────────────────────
router.post("/session", async (req, res) => {
  try {
    const { userId, glassId, frameColor, screenshot } = req.body;
    const session = await TryOnSession.create({ 
        userId, 
        glassId, 
        frameColor, 
        screenshot, 
        createdAt: new Date() 
    });
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/tryon/screenshot ──────────────────────────────────────────────
router.post("/screenshot", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
        return res.status(400).json({ error: "No image provided" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "tryon-screenshots", resource_type: "image" },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(req.file.buffer);
    });
    res.json({ success: true, url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/tryon/popular ──────────────────────────────────────────────────
router.get("/popular", async (req, res) => {
  try {
    const stats = await TryOnSession.aggregate([
      { $group: { _id: "$glassId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
