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
// import FormData from "form-data";
import multer from "multer";
// import fs from "fs";
import { spawn } from 'child_process';
// import axios from "axios";

const router = Router();

const upload = multer({ dest: "uploads/" })

router.post("/", upload.fields([{ name: "image" , maxCount :1 }, { name: "medical", maxCount:1 }]), async (req, res) => {
    try {
        console.log("Received files:", req.files);
  
        if (!req.files || !req.files.image || !req.files.medical) {
          return res.status(400).json({ error: "Two images are required" });
        }
  
        // Get the file paths
        const imagePath = req.files.image[0].path;
        const medicalPath = req.files.medical[0].path;
  
        // Spawn Python process
        const pythonProcess = spawn("python", [
          "D:/experiment/backend/food_scan.py",
          imagePath,
          medicalPath,
        ]);
       
        let output = "";
        let error = "";
  
        // Capture stdout (Python output)
        pythonProcess.stdout.on("data", (data) => {
          output += data.toString();
        });
  
        // Capture stderr (Python errors)
        pythonProcess.stderr.on("data", (data) => {
          error += data.toString();
        });
  
        // Handle process exit
        pythonProcess.on("close", (code) => {
          if (code === 0) {
            try {
              res.json(JSON.parse(output)); // Send JSON response
            } catch (err) {
              res.status(500).json({ error: "Invalid JSON output from Python" });
            }
          } else {
            res.status(500).json({ error: `Python script error: ${error}` });
          }
        });
  
      } catch (error) {
        res.status(500).json({ error: "Server error" });
      }
});

export default router;