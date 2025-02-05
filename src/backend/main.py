import io
import sqlite3
from bson import ObjectId
from fastapi import FastAPI, HTTPException, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from typing import Optional
from model import food_scan,rag,perform_ocr  # Import the function from model.py
import shutil
import os
from requests import Response
from pydantic import BaseModel
from uuid import uuid4
from pydantic import BaseModel
from fastapi import Body
from pymongo import MongoClient
import gridfs

# Initialize FastAPI app
app = FastAPI(
    title="Food Scan API",
    description="API for food scanning and classification",
    version="1.0"
)

# MongoDB connection
MONGO_URI = "mongodb+srv://nutriscan:nutriscan@cluster0.fuano.mongodb.net/nutriscan?retryWrites=true&w=majority"
client = MongoClient(MONGO_URI)
db = client["nutriscan"]
fs = gridfs.GridFS(db)  # GridFS instance


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.post("/upload-health-report")
async def upload_health_report(
    question1: str = Form(...),
    question2: str = Form(...),
    question3: str = Form(...),
    file: UploadFile = File(...),
):
    # Placeholder logic for file processing and saving
    if not file.filename.endswith(('.pdf', '.jpg', '.jpeg', '.png')):
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Save the file to the server (or any other processing)
    file_location = f"uploads/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    return JSONResponse(content={"msg": "Health report uploaded successfully!"})

@app.post("/food-scan/")
async def food_scan_api(image: UploadFile = File(...), medical: Optional[UploadFile] = File(None)):
    """
    Scan an image and classify its content.
    
    Args:
        image (UploadFile): The uploaded image file.
        medical (Upload, optional): Medical data related to the scan.
        
    Returns:
        JSON response with classification results.
    """
    try:
        # Save the uploaded image file temporarily
        temp_image_path = f"temp_{image.filename}"
        with open(temp_image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        temp_medical_path = None
        if medical :  # Check if medical file is provided
            temp_medical_path = f"temp_{medical.filename}"
            with open(temp_medical_path, "wb") as buffer:
                shutil.copyfileobj(medical.file, buffer)

        # Call the food_scan function with file paths
        result = food_scan(temp_image_path, medical=temp_medical_path)

        # Cleanup temporary files
        os.remove(temp_image_path)
        if temp_medical_path:
            os.remove(temp_medical_path)

        # Return the result as JSON
        return JSONResponse(content={"result": result})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post('/label-scan')
async def label_scan(image: UploadFile = File(...)):
    try:
        # Save the uploaded image file temporarily
        label_image_path = f"temp_{image.filename}"
        with open(label_image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
            
        # Call the food_scan function with file paths
        ocr = perform_ocr(label_image_path)
        result = rag(ocr)
        # Cleanup temporary files
        os.remove(label_image_path)
        print(JSONResponse(content={"result": result}))

        # Return the result as JSON
        return JSONResponse(content={"result": result})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/upload-medical-report")
async def upload_medical_report(file: UploadFile = File(...)):
    """Upload a medical report to MongoDB Atlas using GridFS."""
    try:
        file_id = fs.put(file.file, filename=file.filename, content_type=file.content_type)
        return {"message": "File uploaded successfully", "file_id": str(file_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/download-medical-report")
async def download_medical_report(file_id: str):
    """Download a medical report from MongoDB Atlas."""
    try:
        file_id = ObjectId(file_id)
        file = fs.get(file_id)  # Fetch file by ID
        return StreamingResponse(io.BytesIO(file.read()), media_type=file.content_type, 
                                 headers={"Content-Disposition": f"attachment; filename={file.filename}"})
    except gridfs.errors.NoFile:
        raise HTTPException(status_code=404, detail="File not found")