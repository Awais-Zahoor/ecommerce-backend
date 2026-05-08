import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { 
        type: String, 
        enum: ["pending", "in-progress", "resolved"], 
        default: "pending" 
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

const inquiryModel = mongoose.models.inquiry || mongoose.model("inquiry", inquirySchema);

export default inquiryModel;
