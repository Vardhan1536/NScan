import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Set storage for uploaded files
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Health Report Upload API
router.post('/health-report', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.json({ message: 'File uploaded successfully', file: req.file.filename });
});

// Food Scan API (Placeholder for AI Model)
router.post('/food-scan', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    // Call AI model here (Replace with actual function)
    const result = { classification: 'Healthy' };

    res.json({ message: 'Food scanned successfully', result });
});

export default router;
