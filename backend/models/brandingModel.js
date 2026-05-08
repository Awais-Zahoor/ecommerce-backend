import mongoose from "mongoose";

const brandingSchema = new mongoose.Schema({
    logo: { type: String, default: "" },
    heroBanner: { type: String, default: "" },
    heroTitle: { type: String, default: "Latest Collection" },
    heroSubtitle: { type: String, default: "Luxury Essentials" },
    heroButtonText: { type: String, default: "EXPLORE COLLECTION" },
    flashSaleEnabled: { type: Boolean, default: false },
    flashSaleText: { type: String, default: "Flash Sale Live Now!" },
    flashSaleEndsAt: { type: Date, default: null },
    flashSaleBanner: { type: String, default: "" },
    categoryMen: { type: String, default: "" },
    categoryWomen: { type: String, default: "" },
    categoryKids: { type: String, default: "" },
    newsletterTitle: { type: String, default: "Elite Club" },
    newsletterDescription: { type: String, default: "Be the first to access new arrivals, exclusive drops, and members-only offers — curated for those who define style." },
    newsletterButtonText: { type: String, default: "Subscribe" },
    categories: { type: Array, default: [] },
    instagramFeed: { type: Array, default: [] }
}, { minimize: false, strict: false });

const brandingModel = mongoose.models.branding || mongoose.model("branding", brandingSchema);

export default brandingModel;
