import {v2 as cloudinary} from "cloudinary"
import productModel from "../models/productModel.js"

// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, profession, sizes, colors, brand, inStock, bestseller, stockQuantity } = req.body

        const image1 = req.files && req.files.image1 && req.files.image1[0]
        const image2 = req.files && req.files.image2 && req.files.image2[0]
        const image3 = req.files && req.files.image3 && req.files.image3[0]
        const image4 = req.files && req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                return result.secure_url
            })
        )

        // Robust parsing logic to prevent backend crashes
        let parsedSizes = [];
        let parsedColors = [];

        try {
            parsedSizes = sizes ? (typeof sizes === 'string' ? JSON.parse(sizes) : sizes) : [];
        } catch (e) {
            console.error("Error parsing sizes:", e);
        }

        try {
            parsedColors = colors ? (typeof colors === 'string' ? JSON.parse(colors) : colors) : [];
        } catch (e) {
            console.error("Error parsing colors:", e);
        }

        const productData = {
            name,
            description,
            category,
            profession: profession || "General",
            price: Number(price),
            brand: brand || "Awais Luxe", // Fallback for brand
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            inStock: (inStock === "true" || Number(stockQuantity) > 0) ? true : false,
            stockQuantity: Number(stockQuantity) || 0,
            sizes: parsedSizes,
            colors: parsedColors,
            image: imagesUrl,
            date: Date.now()
        }

        console.log("Saving Product Data:", productData);

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added Successfully" })

    } catch (error) {
        console.error("CRITICAL BACKEND ERROR:", error)
        res.json({ success: false, message: error.message || "Internal Server Error during product creation" })
    }
}

// function for list product
const listProducts = async (req,res) => {
    try {

        const products = await productModel.find({});
        res.json({success:true,products})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }

}

// function for removing product
const removeProduct = async (req,res) => {
    try {

        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product Removed"})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
        
    }

}

// function for single product info product
const singleProduct = async (req,res) => {
    try {

        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success:true, product})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }

}

// function for updating product status (inStock / bestseller)
const updateStatus = async (req, res) => {
    try {
        const { id, field, value } = req.body;
        const updateData = {};
        updateData[field] = value;
        
        await productModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// function for updating a complete product
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, subCategory, profession, sizes, colors, brand, inStock, bestseller, stockQuantity, oldImages } = req.body

        // Handle Images
        const image1 = req.files && req.files.image1 && req.files.image1[0]
        const image2 = req.files && req.files.image2 && req.files.image2[0]
        const image3 = req.files && req.files.image3 && req.files.image3[0]
        const image4 = req.files && req.files.image4 && req.files.image4[0]

        const newImages = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = [];
        
        // If there are new images, upload them
        if (newImages.length > 0) {
            imagesUrl = await Promise.all(
                newImages.map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                    return result.secure_url
                })
            )
        }

        // Parse existing images if provided
        let existingImages = [];
        try {
            existingImages = oldImages ? (typeof oldImages === 'string' ? JSON.parse(oldImages) : oldImages) : [];
        } catch (e) {
            console.error("Error parsing oldImages:", e);
        }

        // Final images list: prioritize new ones or merge? 
        const finalImages = imagesUrl.length > 0 ? [...imagesUrl, ...existingImages].slice(0, 4) : existingImages;

        // Parsing logic
        let parsedSizes = [];
        let parsedColors = [];
        try {
            parsedSizes = sizes ? (typeof sizes === 'string' ? JSON.parse(sizes) : sizes) : [];
            parsedColors = colors ? (typeof colors === 'string' ? JSON.parse(colors) : colors) : [];
        } catch (e) {
            console.error("Error parsing metadata:", e);
        }

        const updateData = {
            name,
            description,
            category,
            profession: profession || "General",
            price: Number(price),
            brand: brand || "Awais Luxe",
            subCategory,
            bestseller: bestseller === "true" || bestseller === true ? true : false,
            inStock: (inStock === "true" || inStock === true || Number(stockQuantity) > 0) ? true : false,
            stockQuantity: Number(stockQuantity) || 0,
            sizes: parsedSizes,
            colors: parsedColors,
            date: Date.now()
        }

        if (finalImages.length > 0) {
            updateData.image = finalImages;
        }

        await productModel.findByIdAndUpdate(id, updateData);

        res.json({ success: true, message: "Product Updated Successfully" })

    } catch (error) {
        console.error("UPDATE ERROR:", error)
        res.json({ success: false, message: error.message })
    }
}

// function for updating only stock quantity
const updateStock = async (req, res) => {
    try {
        const { id, stockQuantity } = req.body;
        const qty = Number(stockQuantity);
        
        const updateData = {
            stockQuantity: qty,
            inStock: qty > 0 ? true : false
        };
        
        await productModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Stock Synchronized" });
    } catch (error) {
        console.error("STOCK UPDATE ERROR:", error);
        res.json({ success: false, message: error.message });
    }
}

export {listProducts,addProduct,removeProduct,singleProduct, updateStatus, updateProduct, updateStock}