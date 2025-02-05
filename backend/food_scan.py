import json
import sys
from model import med_process,image_classify,food_des,label_des,process_barcode_image

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
  
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Two image paths required"}))
        sys.exit(1)  # Exit with an error code

    image = sys.argv[1]
    medical = sys.argv[2]

    result = food_scan(image, medical)
    print(json.dumps(result))  # Print JSON output