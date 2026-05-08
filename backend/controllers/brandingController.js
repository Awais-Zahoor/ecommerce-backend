import { v2 as cloudinary } from "cloudinary";
import brandingModel from "../models/brandingModel.js";

// Function to fetch current branding
const getBranding = async (req, res) => {
    try {
        let branding = await brandingModel.findOne({});
        if (!branding) {
            // Create initial empty settings if none exists
            branding = new brandingModel({ logo: "", heroBanner: "" });
            await branding.save();
        }
        res.json({ success: true, branding });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Function to update branding (Logo & Banner)
const updateBranding = async (req, res) => {
    try {
        const logoFile = req.files && req.files.logo && req.files.logo[0];
        const bannerFile = req.files && req.files.banner && req.files.banner[0];
        const flashBannerFile = req.files && req.files.flashBanner && req.files.flashBanner[0];
        const categoryMenFile = req.files && req.files.categoryMen && req.files.categoryMen[0];
        const categoryWomenFile = req.files && req.files.categoryWomen && req.files.categoryWomen[0];
        const categoryKidsFile = req.files && req.files.categoryKids && req.files.categoryKids[0];

        let existingBranding = await brandingModel.findOne({});
        let updateData = {};

        if (logoFile) {
            if (existingBranding && existingBranding.logo) {
                const publicId = existingBranding.logo.split('/').pop().split('.')[0];
                try { await cloudinary.uploader.destroy(publicId); } catch(e) { console.log(e); }
            }
            let logoUpload = await cloudinary.uploader.upload(logoFile.path, { resource_type: 'image' });
            updateData.logo = logoUpload.secure_url;
        }

        if (bannerFile) {
            if (existingBranding && existingBranding.heroBanner) {
                const publicId = existingBranding.heroBanner.split('/').pop().split('.')[0];
                try { await cloudinary.uploader.destroy(publicId); } catch(e) { console.log(e); }
            }
            let bannerUpload = await cloudinary.uploader.upload(bannerFile.path, { resource_type: 'image' });
            updateData.heroBanner = bannerUpload.secure_url;
        }

        if (flashBannerFile) {
            if (existingBranding && existingBranding.flashSaleBanner) {
                const publicId = existingBranding.flashSaleBanner.split('/').pop().split('.')[0];
                try { await cloudinary.uploader.destroy(publicId); } catch(e) { console.log(e); }
            }
            const flashBannerUpload = await cloudinary.uploader.upload(flashBannerFile.path, { resource_type: 'image' });
            updateData.flashSaleBanner = flashBannerUpload.secure_url;
        }

        if (categoryMenFile) {
            if (existingBranding && existingBranding.categoryMen) {
                const publicId = existingBranding.categoryMen.split('/').pop().split('.')[0];
                try { await cloudinary.uploader.destroy(publicId); } catch(e) { console.log(e); }
            }
            const upload = await cloudinary.uploader.upload(categoryMenFile.path, { resource_type: 'image' });
            updateData.categoryMen = upload.secure_url;
        }

        if (categoryWomenFile) {
            if (existingBranding && existingBranding.categoryWomen) {
                const publicId = existingBranding.categoryWomen.split('/').pop().split('.')[0];
                try { await cloudinary.uploader.destroy(publicId); } catch(e) { console.log(e); }
            }
            const upload = await cloudinary.uploader.upload(categoryWomenFile.path, { resource_type: 'image' });
            updateData.categoryWomen = upload.secure_url;
        }

        if (categoryKidsFile) {
            if (existingBranding && existingBranding.categoryKids) {
                const publicId = existingBranding.categoryKids.split('/').pop().split('.')[0];
                try { await cloudinary.uploader.destroy(publicId); } catch(e) { console.log(e); }
            }
            const upload = await cloudinary.uploader.upload(categoryKidsFile.path, { resource_type: 'image' });
            updateData.categoryKids = upload.secure_url;
        }

        // Handle text fields
        const {
            heroTitle, heroSubtitle, heroButtonText,
            flashSaleText, flashSaleEndsAt, flashSaleEnabled,
            newsletterTitle, newsletterDescription, newsletterButtonText,
            categories, instagramFeed
        } = req.body;
        if (heroTitle !== undefined) updateData.heroTitle = heroTitle;
        if (heroSubtitle !== undefined) updateData.heroSubtitle = heroSubtitle;
        if (heroButtonText !== undefined) updateData.heroButtonText = heroButtonText;
        if (flashSaleText !== undefined) updateData.flashSaleText = flashSaleText;
        if (flashSaleEndsAt !== undefined) updateData.flashSaleEndsAt = flashSaleEndsAt || null;
        if (flashSaleEnabled !== undefined) updateData.flashSaleEnabled = flashSaleEnabled === 'true' || flashSaleEnabled === true;
        if (newsletterTitle !== undefined) updateData.newsletterTitle = newsletterTitle;
        if (newsletterDescription !== undefined) updateData.newsletterDescription = newsletterDescription;
        if (newsletterButtonText !== undefined) updateData.newsletterButtonText = newsletterButtonText;

        // Process Categories
        if (categories) {
            let parsedCategories = [];
            try { parsedCategories = JSON.parse(categories); } catch(e) {}
            
            if (req.files && req.files.categoryImages) {
                let fileIndex = 0;
                for (let i = 0; i < parsedCategories.length; i++) {
                    if (parsedCategories[i].image === 'NEW') {
                        if (req.files.categoryImages[fileIndex]) {
                            let uploadRes = await cloudinary.uploader.upload(req.files.categoryImages[fileIndex].path, { resource_type: 'image' });
                            parsedCategories[i].image = uploadRes.secure_url;
                            fileIndex++;
                        }
                    }
                }
            }
            updateData.categories = parsedCategories;
        }

        // Process Instagram Feed
        if (instagramFeed) {
            let parsedInstagram = [];
            try { parsedInstagram = JSON.parse(instagramFeed); } catch(e) {}
            
            if (req.files && req.files.instaImages) {
                let fileIndex = 0;
                for (let i = 0; i < parsedInstagram.length; i++) {
                    if (parsedInstagram[i].image === 'NEW') {
                        if (req.files.instaImages[fileIndex]) {
                            let uploadRes = await cloudinary.uploader.upload(req.files.instaImages[fileIndex].path, { resource_type: 'image' });
                            parsedInstagram[i].image = uploadRes.secure_url;
                            fileIndex++;
                        }
                    }
                }
            }
            updateData.instagramFeed = parsedInstagram;
        }

        let branding = await brandingModel.findOneAndUpdate({}, updateData, { new: true, upsert: true });

        res.json({ success: true, message: "Site Settings updated successfully", branding });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { getBranding, updateBranding };
