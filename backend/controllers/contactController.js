import inquiryModel from "../models/inquiryModel.js";
import { z } from "zod";
import { sendAutoReply, sendAdminNotification, sendInquiryResponse } from "../services/emailService.js";

// Zod Validation Schema
const inquirySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

// @desc    Submit a public inquiry
// @route   POST /api/contact/submit
// @access  Public
const submitInquiry = async (req, res) => {
    try {
        const validation = inquirySchema.safeParse(req.body);
        if (!validation.success) {
            return res.json({ success: false, message: validation.error.errors[0].message });
        }

        const { name, email, message } = req.body;

        const newInquiry = new inquiryModel({ name, email, message });
        await newInquiry.save();

        // Background tasks (non-blocking)
        sendAutoReply(email, name);
        sendAdminNotification(newInquiry);

        res.json({ success: true, message: "Transmission received and authorized." });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Get all inquiries (Admin Only)
// @route   GET /api/contact/list
// @access  Private (Admin)
const getInquiries = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        
        let query = {};
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        const inquiries = await inquiryModel.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await inquiryModel.countDocuments(query);

        res.json({
            success: true,
            inquiries,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalCount: count
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Update inquiry details (Status / Read)
// @route   PATCH /api/contact/update/:id
// @access  Private (Admin)
const updateInquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, isRead } = req.body;

        const updatedInquiry = await inquiryModel.findByIdAndUpdate(
            id, 
            { $set: { status, isRead } }, 
            { new: true }
        );

        if (!updatedInquiry) return res.json({ success: false, message: "Inquiry not found" });

        res.json({ success: true, message: "Inquiry parameters updated", inquiry: updatedInquiry });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Delete single inquiry
// @route   DELETE /api/contact/delete/:id
// @access  Private (Admin)
const deleteInquiry = async (req, res) => {
    try {
        const { id } = req.params;
        await inquiryModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Inquiry purged from terminal" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Bulk Delete
// @route   POST /api/contact/bulk-delete
// @access  Private (Admin)
const bulkDeleteInquiries = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) return res.json({ success: false, message: "Invalid payload" });
        await inquiryModel.deleteMany({ _id: { $in: ids } });
        res.json({ success: true, message: "Bulk purge successful" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Respond to an inquiry (Admin Only)
// @route   POST /api/contact/respond/:id
// @access  Private (Admin)
const respondToInquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const { replyMessage } = req.body;

        if (!replyMessage || replyMessage.length < 5) {
            return res.json({ success: false, message: "Please provide a substantial response." });
        }

        const inquiry = await inquiryModel.findById(id);
        if (!inquiry) return res.json({ success: false, message: "Inquiry not found" });

        // Send Email
        await sendInquiryResponse(inquiry.email, inquiry.name, inquiry.message, replyMessage);

        // Update status to resolved
        inquiry.status = 'resolved';
        inquiry.isRead = true;
        await inquiry.save();

        res.json({ success: true, message: "Official response dispatched.", inquiry });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { submitInquiry, getInquiries, updateInquiry, deleteInquiry, bulkDeleteInquiries, respondToInquiry };
