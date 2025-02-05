// import { Router } from "express";
// import FormData from "form-data";
// import multer from "multer";
// import fs from "fs";
// import axios from "axios";

// const router = Router();

// const upload = multer({ dest: "uploads/" })

// router.post("/", upload.fields([{ name: "image" , maxCount :1 }, { name: "medical", maxCount:1 }]), async (req, res) => {
//     try {

//         console.log("Received files:", req.files);

//         if (!req.files || !req.files.image || !req.files.medical) {
//             return res.status(400).json({ error: "Two images are required" });
//         }

//         const formData = new FormData();
//         formData.append("image", fs.createReadStream(req.files.image[0].path), {
//             filename: req.files.image[0].originalname,
//             contentType: req.files.image[0].mimetype
//         });

//         if (req.files.medical) {
//             formData.append("medical", fs.createReadStream(req.files.medical[0].path), {
//                 filename: req.files.medical[0].originalname,
//                 contentType: req.files.medical[0].mimetype
//             });
//         }
//         // Send images to FastAPI
//         const response = await axios.post("http://localhost:8000/food-scan", formData, {
//             headers: { ...formData.getHeaders() },
//         });

//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: "Python API error" });
//     }
// });

// export default router;

import { Router } from "express";
import multer from "multer";
import { spawn } from "child_process";
import fs from "fs";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.fields([{ name: "image", maxCount: 1 }, { name: "medical", maxCount: 1 }]), async (req, res) => {
    try {
        console.log("Received files:", req.files);

        if (!req.files || !req.files.image || !req.files.medical) {
            return res.status(400).json({ error: "Two images are required" });
        }

        const imagePath = req.files.image[0].path;
        const medicalPath = req.files.medical[0].path;

        // Ensure Python is in PATH or use full path (Windows example: "C:/Python/python.exe")
        const pythonProcess = spawn("python", ["D:/experiment/backend/food_scan.py", imagePath, medicalPath]);

        let output = "";
        let error = "";

        console.log(pythonProcess.stdout)
        console.log(pythonProcess.data)

        pythonProcess.stdout.on("data", (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            error += data.toString();
        });

        pythonProcess.on("close", (code) => {
            // Clean up uploaded files
            fs.unlink(imagePath, (err) => { if (err) console.error("Error deleting image:", err); });
            fs.unlink(medicalPath, (err) => { if (err) console.error("Error deleting medical:", err); });

            if (code === 0) {
                try {
                    res.json(JSON.parse(output));
                } catch (err) {
                    res.status(500).json({ error: "Invalid JSON output from Python", details: output });
                }
            } else {
                res.status(500).json({ error: `Python script error`, details: error });
            }
        });

    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

export default router;
