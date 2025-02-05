import numpy as np
import json
import tensorflow as tf
import keras 
import google.generativeai as genai
from paddleocr import PaddleOCR
import os
from PIL import Image,ImageDraw,ImageFont
import json
from uuid import uuid4
import numpy as np
import cv2
import matplotlib.pyplot as plt
import re
import json
import json
import numpy as np
import pandas as pd
import os
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import google.generativeai as genai
import os
import requests
from zxing import BarCodeReader


ocr = PaddleOCR(use_angle_cls=True,
                det_db_box_thresh=0.2,  
                det_db_unclip_ratio=2.5,
                lang='en',
                rec = False,
                det_limit_side_len=1536
               ) 

def perform_ocr(image_path, json_output_path='ocr_output.json', output_image_path='ocr_output_with_boxes.png'):
    Image.MAX_IMAGE_PIXELS = None
    img = Image.open(image_path)
    # Read the image
    img = cv2.imread(image_path)
    
    # Perform OCR on the image
    results = ocr.ocr(img, cls=True)
    
    # Display the recognized text
    
      # Print the detected text
    
    # Prepare output for JSON
    output = []
    for line in results:
        for word_info in line:
            text = word_info[1][0]  # Detected text
            confidence = word_info[1][1]  # Confidence score
            box = word_info[0]  # Bounding box coordinates
            output.append({
                "text": text,
                "confidence": confidence,
                "bounding_box": box
            })
    
    # Save results to a JSON file
    with open(json_output_path, 'w') as json_file:
        json.dump(output, json_file, indent=4)
    print(f"OCR results saved to '{json_output_path}'")
    
    # Draw bounding boxes on the image
    for line in results:
        for word_info in line:
            box = np.array(word_info[0]).astype(int)
            cv2.polylines(img, [box], isClosed=True, color=(0, 255, 0), thickness=2)
    
    # Display the image with bounding boxes
    plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    plt.axis('off')
    plt.show()

    # Save the image with bounding boxes
    cv2.imwrite(output_image_path, img)
    print(f"Image with bounding boxes saved as '{output_image_path}'")
    return output

def rag(file_path):
    data = file_path
    processed_data = []


    # Process each entry in the raw JSON
    for entry in data:

        if entry['confidence'] > 0.7:  # Optional: filter by confidence threshold
            processed_data.append({
                'text': entry['text'],
                'bounding_box':entry['bounding_box'] ,
                'confidence': entry['confidence']
            })

    # Convert to simple text for embedding
    chunks = [item['text'] for item in processed_data]


    model = SentenceTransformer('all-MiniLM-L6-v2')

    # Generate embeddings for the text chunks
    embeddings = model.encode(chunks, show_progress_bar=True)

    # Attach embeddings to the metadata
    for i, embedding in enumerate(embeddings):
        processed_data[i]['embedding'] = embedding

    # print("Data with Embeddings:", processed_data[:2])
    # Extract embeddings as a NumPy array
    embeddings_matrix = np.array([item['embedding'] for item in processed_data]).astype('float32')

    # Create FAISS index
    dimension = embeddings_matrix.shape[1]  # Embedding size
    index = faiss.IndexFlatL2(dimension)  # L2 (Euclidean) distance
    index.add(embeddings_matrix)  # Add embeddings to the index

    # Store metadata separately (text, bounding box, confidence)
    metadata = [{'text': item['text'], 'bounding_box': item['bounding_box'], 'confidence': item['confidence']} for item in processed_data]
    json_data = json.dumps(metadata)
    genai.configure(api_key="AIzaSyC8f-sZzHSqMfR2EEu273C_QHRbxoxGQCw")
    gemini = genai.GenerativeModel("gemini-1.5-flash")
    prompt = ("""i am giving you the ocr model outputs for the nutrient label backside of a food pacakge structurize that in this format Task 1 : convert the units of the nutrients in to following units
      Energy:

Unit: Kilocalories (kcal)
Protein:

Unit: Grams (g)
Added Sugars:

Unit: Grams (g)
Carbohydrate:

Unit: Grams (g)
Total Fat:

Unit: Grams (g)
Total Sugars:

Unit: Grams (g)
Saturated Fat:

Unit: Grams (g)
Cholesterol:

Unit: Milligrams (mg)
Trans Fat:

Unit: Grams (g)
Sodium:

Unit: Milligrams (mg)
Caffeine:

Unit: Milligrams (mg)
Phytosterols:

Unit: Milligrams (mg)
Beta Glucan:

Unit: Grams (g)
Antioxidants (Flavonoids, Carotenoids, Lutein, Polyphenols, Resveratrol):

Unit: Milligrams (mg)
Fiber:

Unit: Grams (g)
Vitamins:

Unit: Milligrams (mg) or International Units (IU) depending on the specific vitamin
Minerals (e.g., Calcium, Magnesium, Potassium):

Unit: Milligrams (mg) or Micrograms (µg)"""
        " Task 2:I just want nutrients in nice structed json only json without any other things example If that nutrient not present give 0 to it "
           """ required format of json anything not there place 0 for it and there will be a case thamin which is vitamin a try to map to vitamin_a  {
  "energy": 90,              // in kcal
  "protein": 8,              // in grams
  "added_sugars": 3,         // in grams
  "carbohydrates": 25,       // in grams
  "total_fat": 8,            // in grams
  "saturated_fat": 2,        // in grams
  "trans_fat": 0,            // in grams
  "cholesterol": 10,         // in milligrams
  "sodium": 100,             // in milligrams
  "fiber": 4,                // in grams
  "vitamin_a": 25,           // in percentage of daily value
  "vitamin_c": 30,           // in percentage of daily value
  "omega_3": 0.8,            // in grams
  "caffeine": 40,            // in milligrams
  "phytosterols": 1.2,       // in grams
  "beta_glucan": 1.1,        // in grams
  "flavonoids": 60,          // in milligrams
  "carotenoids": 6,          // in milligrams
  "lutein": 1.5,             // in milligrams
  "polyphenols": 120,        // in milligrams
  "resveratrol": 55          // in milligrams
}
""")

    response = gemini.generate_content([prompt,json_data])

    return response.text
def calculate_health_score(data):
    score = 0
    
    # Energy (kcal)
    if data['energy'] < 50:
        score += 0.5
    elif data['energy'] <= 100:
        score += 0.25
    else:
        score -= 0.5
    
    # Protein (g)
    if data['protein'] > 10:
        score += 0.5
    elif data['protein'] >= 5:
        score += 0.25
    
    # Added Sugars (g)
    if data['added_sugars'] == 0:
        score += 1
    elif data['added_sugars'] <= 5:
        score += 0.5
    else:
        score -= 1
    
    # Carbohydrates (g)
    if data['carbohydrates'] < 10:
        score += 0.5
    elif data['carbohydrates'] > 30:
        score -= 0.5
    
    # Total Fat (g)
    if data['total_fat'] < 5:
        score += 0.5
    elif data['total_fat'] <= 10:
        score += 0.25
    else:
        score -= 0.5
    
    # Saturated Fat (g)
    if data['saturated_fat'] == 0:
        score += 1
    elif data['saturated_fat'] <= 3:
        score += 0.5
    else:
        score -= 1
    
    # Trans Fat (g)
    if data['trans_fat'] == 0:
        score += 1
    else:
        score -= 1
    
    # Cholesterol (mg)
    if data['cholesterol'] == 0:
        score += 1
    elif data['cholesterol'] <= 20:
        score += 0.5
    else:
        score -= 1
    
    # Sodium (mg)
    if data['sodium'] < 50:
        score += 1
    elif data['sodium'] <= 150:
        score += 0.5
    else:
        score -= 1
    
    # Fiber (g)
    if data['fiber'] >= 5:
        score += 1
    elif data['fiber'] >= 3:
        score += 0.5
    
    # Vitamins and Minerals (simplified logic)
    if data['vitamin_a'] >= 20:
        score += 0.5
    if data['vitamin_c'] >= 20:
        score += 0.5
    
    # Omega-3 (g)
    if data['omega_3'] >= 1:
        score += 1
    elif data['omega_3'] >= 0.5:
        score += 0.5
    
    # Caffeine (mg)
    if data['caffeine'] < 50:
        score += 0.25
    elif data['caffeine'] <= 100:
        score += 0.5
    else:
        score -= 0.5
    
    # Phytosterols (g)
    if data['phytosterols'] >= 1:
        score += 0.5
    
    # Beta-Glucan (g)
    if data['beta_glucan'] >= 1:
        score += 0.5
    
    # Flavonoids (mg)
    if data['flavonoids'] >= 50:
        score += 0.5
    
    # Carotenoids (mg)
    if data['carotenoids'] >= 5:
        score += 0.5
    
    # Lutein (mg)
    if data['lutein'] >= 1:
        score += 0.5
    
    # Polyphenols (mg)
    if data['polyphenols'] >= 100:
        score += 0.5
    
    # Resveratrol (mg)
    if data['resveratrol'] >= 50:
        score += 0.5
    
    # Maximum possible score
    max_possible_score = 18  # Update this to match the maximum achievable score
    
    # Normalize the score to the range 0 to 5
    normalized_score = (score / max_possible_score) * 5
    
    return normalized_score # Round to 2 decimal places for clarity


def label_des(image,medical):
  genai.configure(api_key="AIzaSyC8f-sZzHSqMfR2EEu273C_QHRbxoxGQCw")
  gemini = genai.GenerativeModel("gemini-1.5-flash")
  ocr = perform_ocr(image)
  text = rag(ocr)
  # Regular expression to extract the content between 'json' and the backtick
  regex = r'(?<=json\n)(.*?)(?=`)'
  # Find the match
  match = re.search(regex, text, re.DOTALL)
  if match:
      extracted_content = match.group(1)
      print(extracted_content)
  else:
      print("No match found")
  data_json = json.loads(extracted_content)
  score = calculate_health_score(data_json)
  if medical!=None:
    prompt =  (f'you are a nutrientist and a customer with his medical report {medical} came to you and gave the output of a ocr  from which you should only perform this tasks'
              f'Task1 : give me the description overall the description came be understandable for a common person. give description by considering the medical report it should be like `Description obout Dosa: your description goes here` '
              f'Task2: I will give you the health score of food item based on nutrient {score} give reasons for the score just give it in 1-2 points by consisdering the medical report it should be like `Reason for score: your reason goes here`'
              f'ocr_output {ocr}')
  else:
    prompt =  (f'you are a nutrientist and a customer came to you and gave the output of a ocr  from which you should only perform this tasks'
              f'Task1 : give me the description overall the description came be understandable for a common person '
              f'Task2: I will give you the health score of food item based on nutrient {score} give reasons for the score just give it in 1-2 points'
              f'ocr_output {ocr}')
  response = gemini.generate_content([prompt])
  return response.text,score
def process_barcode_image(image_path,medical=None):
    genai.configure(api_key="AIzaSyC8f-sZzHSqMfR2EEu273C_QHRbxoxGQCw")
    gemini = genai.GenerativeModel("gemini-1.5-flash")
    """
    Process a barcode image file to extract the barcode data and fetch food details.

    Args:
        image_path (str): Path to the barcode image file.

    Returns:
        dict: Barcode data and food details, or an error message.
    """
    # Function to fetch food details using Open Food Facts API
    def get_food_details(barcode):
        url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 1:
                product = data['product']
                return {
                    "Product Name": product.get('product_name', 'N/A'),
                    "Brand": product.get('brands', 'N/A'),
                    "Ingredients": product.get('ingredients_text', 'N/A'),
                    "Nutritional Info": product.get('nutriments', 'N/A'),
                    "Categories": product.get('categories', 'N/A'),
                    "Allergens": product.get('allergens', 'N/A')
                }
            else:
                return {"Error": "Product not found in the database."}
        else:
            return {"Error": f"API Error: {response.status_code}"}

   
    reader = BarCodeReader()

    barcode = reader.decode(image_path)
    
    if barcode:
        barcode_data = {
            "Barcode Data": barcode.raw,
            "Barcode Type": barcode.format
        }
        # Fetch food details using the barcode data
        food_details = get_food_details(barcode.raw)
        k =  {**barcode_data, "Food Details": food_details}
        if medical!=None:
            prompt = (f'see You are a nutrionist you are tasked for food item {k}'
                      f'You are also given with patient medical report{medical}'
                      'Task 1: give a health score for this food Item based on nutrients present in it just give in this pattern based on medical report `Score :3.5/5`'
                      'Task2:Give a description for this Food Item by consisdering the medical report'
                      'Task3 : If it is risky to eat give a warning by consisdering the medical report'
                      'Task4: Give main Nutrients present in it')
        else:
            prompt = (f'see You are a nutrionist you are tasked for food item {k}'
                      'Task 1: give a health score for this food Item based on nutrients present in it just give in this pattern `Score :3.5/5`'
                      'Task2:Give a description for this Food Item '
                      'Task3 : If it is risky to eat give a warning'
                      'Task4: Give main Nutrients present in it')
        response = gemini.generate_content([prompt])

        return response.text
    else:
        return {"Error": "No barcode detected in the image."}
def food_des(image,medical):
  genai.configure(api_key="AIzaSyC8f-sZzHSqMfR2EEu273C_QHRbxoxGQCw")
  gemini = genai.GenerativeModel("gemini-1.5-flash")

  file_json = "class_id_label.json"

  with open(file_json, 'r') as f:
      class_id_to_label = json.load(f)
  model1 = keras.models.load_model("models/food_recognition_inceptionV3.h5")
  img = keras.preprocessing.image.load_img(image, target_size=(228, 228))
  img_array = keras.preprocessing.image.img_to_array(img)
  img_array = np.expand_dims(img_array, axis=0)
  img_array /= 255
  preds1 = model1.predict(img_array)
  final_class = np.argmax(preds1, axis=1)[0]  
  class_name = class_id_to_label.get(str(final_class), "Unknown Class")
  if medical!=None:
    prompt = (f'see You are a nutrionist you are tasked for food item {class_name} in general'
              f'You are also given with patient medical report{medical}'
              'Task 1: give a health score for this food Item based on nutrients present in it just give in this pattern based on medical report `Score :3.5/5`'
              'Task2:Give a description for this Food Item by consisdering the medical report'
              'Task3 : If it is risky to eat give a warning by consisdering the medical report'
              'Task4: Give main Nutrients present in it')
  else:
    prompt = (f'see You are a nutrionist you are tasked for food item {class_name}'
              'Task 1: give a health score for this food Item based on nutrients present in it just give in this pattern `Score :3.5/5`'
              'Task2:Give a description for this Food Item '
              'Task3 : If it is risky to eat give a warning'
              'Task4: Give main Nutrients present in it')


  
  response = gemini.generate_content([prompt])
    
  return response.text
from tensorflow.keras.models import load_model 
from joblib import dump, load


def image_classify(image):
    classes = ["qr_dataset", "nutrient labels/nutrient labels", "barcode/barcode", "food/food"]

    cnn_model = load_model("models/cnn_model.h5")
    print("CNN Model loaded successfully!")
    dt_classifier = load("models/decision_tree_classifier.joblib")
    image = cv2.imread(image)
    if image is not None:
            image = cv2.resize(image, (128,128))
            image = image / 255.0
            image = np.expand_dims(image, axis=0)
            cnn_features = cnn_model.predict(image)
            prediction = dt_classifier.predict(cnn_features)
            return classes[int(prediction[0])]
    else:
        return "Unknown"
def med_rag(file_path):
    data = file_path
    processed_data = []


    # Process each entry in the raw JSON
    for entry in data:

        if entry['confidence'] > 0.7:  # Optional: filter by confidence threshold
            processed_data.append({
                'text': entry['text'],
                'bounding_box':entry['bounding_box'] ,
                'confidence': entry['confidence']
            })

    # Convert to simple text for embedding
    chunks = [item['text'] for item in processed_data]


    model = SentenceTransformer('all-MiniLM-L6-v2')

    # Generate embeddings for the text chunks
    embeddings = model.encode(chunks, show_progress_bar=True)

    # Attach embeddings to the metadata
    for i, embedding in enumerate(embeddings):
        processed_data[i]['embedding'] = embedding

    # print("Data with Embeddings:", processed_data[:2])
    # Extract embeddings as a NumPy array
    embeddings_matrix = np.array([item['embedding'] for item in processed_data]).astype('float32')

    # Create FAISS index
    dimension = embeddings_matrix.shape[1]  # Embedding size
    index = faiss.IndexFlatL2(dimension)  # L2 (Euclidean) distance
    index.add(embeddings_matrix)  # Add embeddings to the index

    # Store metadata separately (text, bounding box, confidence)
    metadata = [{'text': item['text'], 'bounding_box': item['bounding_box'], 'confidence': item['confidence']} for item in processed_data]
    json_data = json.dumps(metadata)
    genai.configure(api_key="AIzaSyC8f-sZzHSqMfR2EEu273C_QHRbxoxGQCw")
    gemini = genai.GenerativeModel("gemini-1.5-flash")
    prompt = ("""i am giving you the ocr model outputs for the medical report just give me structed text""")

    response = gemini.generate_content([prompt,json_data])

    return response.text
def med_process(image):
  genai.configure(api_key="AIzaSyC8f-sZzHSqMfR2EEu273C_QHRbxoxGQCw")
  gemini = genai.GenerativeModel("gemini-1.5-flash")
  ocr = perform_ocr(image)
  text = med_rag(ocr)
  return text
def food_scan(image,medical=None):
    if medical!=None:
      medical = med_process(medical)
    k = image_classify(image)
    print("Predicted Class:", k)
    if k == 'food/food':
      return food_des(image,medical)
    elif k =='qr_dataset':
      return 'qr'
    elif k =='nutrient labels/nutrient labels':
        return label_des(image , medical)
    elif k =='barcode/barcode':
      return process_barcode_image(image , medical)
    else:
      return 'Unknown'
  
# print(food_scan('assests/temp_image.jpg' , medical = 'assests/allergy.jpg') )  




