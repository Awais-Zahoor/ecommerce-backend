import multer from "multer";
import path from "path";
import fs from "fs";

// Directories for different assets
const isServerless = process.env.VERCEL || process.env.NOW_REGION || process.env.NODE_ENV === 'production';
const UPLOAD_BASE = isServerless ? '/tmp/uploads' : 'uploads';
const MODEL_DIR = path.join(UPLOAD_BASE, 'models');
const IMAGE_DIR = path.join(UPLOAD_BASE, 'images');

// Ensure directories exist
try {
    [MODEL_DIR, IMAGE_DIR].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
} catch (err) {
    console.error("Warning: Could not create upload directories:", err.message);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        // Route files to appropriate folders based on extension
        if (ext === '.glb' || ext === '.gltf') {
            cb(null, MODEL_DIR);
        } else {
            cb(null, IMAGE_DIR);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        const prefix = (ext === '.glb' || ext === '.gltf') ? 'model-' : 'image-';
        cb(null, prefix + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB limit (3D models can be large)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = ['.glb', '.gltf', '.jpg', '.jpeg', '.png', '.webp', '.jfif', '.svg', '.bmp'];
        
        if (allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`), false);
        }
    }
});

export default upload;