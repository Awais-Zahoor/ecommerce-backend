import mongoose from "mongoose";

const TryOnSessionSchema = new mongoose.Schema({
  userId:      { type: String, default: null },
  glassId:     { type: String, required: true },
  frameColor:  { type: String, default: "#111111" },
  screenshot:  { type: String, default: null },  // Cloudinary URL
  createdAt:   { type: Date, default: Date.now },
});

export default mongoose.model("TryOnSession", TryOnSessionSchema);
