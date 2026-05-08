import sunglassesModel from "../models/sunglassesModel.js"

// function for add sunglasses (Strict: 3D Model Only)
const addSunglasses = async (req, res) => {
    try {
        const { name, description, price, brand, stock, bestseller } = req.body

        const model3DFile = req.files && req.files.model3D && req.files.model3D[0]
        
        if (!model3DFile) {
            return res.json({ success: false, message: "3D Model (.glb/.gltf) is required for sunglasses" })
        }

        const sunglassesData = {
            name,
            description,
            price: Number(price),
            brand: brand || "Awais Luxe",
            stock: Number(stock) || 0,
            inStock: Number(stock) > 0,
            bestseller: bestseller === "true" || bestseller === true ? true : false,
            model3D: model3DFile.filename,
            category: "sunglasses", // Strict category
            createdAt: Date.now()
        }

        const sunglasses = new sunglassesModel(sunglassesData);
        await sunglasses.save()

        res.json({ success: true, message: "Sunglasses Added (3D Engine Configured)" })

    } catch (error) {
        console.error("BACKEND ERROR:", error)
        res.json({ success: false, message: error.message })
    }
}

// function for list sunglasses
const listSunglasses = async (req, res) => {
    try {
        const { search, sort, bestseller } = req.query;
        let query = { category: "sunglasses" }; // Always filter by sunglasses

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (bestseller === 'true') {
            query.bestseller = true;
        }

        let sortOrder = { createdAt: -1 };
        if (sort === 'low-high') sortOrder.price = 1;
        if (sort === 'high-low') sortOrder.price = -1;

        const sunglasses = await sunglassesModel.find(query).sort(sortOrder);
        res.json({ success: true, sunglasses })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// function for removing sunglasses
const removeSunglasses = async (req, res) => {
    try {
        await sunglassesModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Sunglasses Removed" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// function for single sunglasses info
const singleSunglasses = async (req, res) => {
    try {
        const { sunglassesId } = req.body
        const sunglasses = await sunglassesModel.findById(sunglassesId)
        if (!sunglasses || sunglasses.category !== "sunglasses") {
            return res.json({ success: false, message: "Invalid Sunglasses Product" })
        }
        res.json({ success: true, sunglasses })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// function for update sunglasses
const updateSunglasses = async (req, res) => {
    try {
        const { id, name, description, price, brand, stock, bestseller } = req.body

        const model3DFile = req.files && req.files.model3D && req.files.model3D[0]
        let model3DPath = req.body.model3D // Keep existing if not changed

        if (model3DFile) {
            model3DPath = model3DFile.filename
        }

        const updateData = {
            name,
            description,
            price: Number(price),
            brand: brand || "Awais Luxe",
            stock: Number(stock) || 0,
            inStock: Number(stock) > 0,
            bestseller: bestseller === "true" || bestseller === true ? true : false,
            model3D: model3DPath,
            category: "sunglasses"
        }

        await sunglassesModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Sunglasses Engine Updated" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const updateSunglassesStatus = async (req, res) => {
    try {
        const { id, field, value } = req.body;
        await sunglassesModel.findByIdAndUpdate(id, { [field]: value });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const getRelatedSunglasses = async (req, res) => {
    try {
        const { currentId } = req.query;
        const related = await sunglassesModel.find({ 
            category: "sunglasses", 
            _id: { $ne: currentId } 
        }).limit(5);
        res.json({ success: true, sunglasses: related });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export { 
    listSunglasses, 
    addSunglasses, 
    removeSunglasses, 
    singleSunglasses, 
    updateSunglasses, 
    updateSunglassesStatus,
    getRelatedSunglasses
}
