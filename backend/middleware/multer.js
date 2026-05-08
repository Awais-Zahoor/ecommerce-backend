import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure models directory exists
const modelDir = 'uploads/models';
if (!fs.existsSync(modelDir)) {
    fs.mkdirSync(modelDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, modelDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname).toLowerCase()
        cb(null, 'sunglasses-' + uniqueSuffix + ext)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.glb' || ext === '.gltf') {
            cb(null, true);
        } else {
            cb(new Error('Strict Rule: Only .glb or .gltf files are allowed for sunglasses engine'), false);
        }
    }
})

export default upload