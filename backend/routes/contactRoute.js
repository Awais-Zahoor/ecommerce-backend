import express from "express";
import { submitInquiry, getInquiries, updateInquiry, deleteInquiry, bulkDeleteInquiries, respondToInquiry } from "../controllers/contactController.js";
import adminAuth from "../middleware/adminAuth.js";
import { rateLimit } from "express-rate-limit";

const contactRouter = express.Router();

// Rate limiting for public submissions to prevent spam
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 requests per window
    message: { success: false, message: "Too many inquiries from this terminal. Please wait 60 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Public Entry
contactRouter.post("/submit", contactLimiter, submitInquiry);

// Admin Control Panel (Protected)
contactRouter.get("/list", adminAuth, getInquiries);
contactRouter.patch("/update/:id", adminAuth, updateInquiry);
contactRouter.post("/respond/:id", adminAuth, respondToInquiry);
contactRouter.delete("/delete/:id", adminAuth, deleteInquiry);
contactRouter.post("/bulk-delete", adminAuth, bulkDeleteInquiries);

export default contactRouter;
