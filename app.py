# from flask import Flask, request, jsonify, send_file
# import os
# import pytesseract
# from PIL import Image
# import cv2
# import numpy as np
# from transformers import T5ForConditionalGeneration, T5Tokenizer
# import spacy
# import nltk
# import pyttsx3

# # Download necessary nltk models on first run
# nltk.download('punkt')
# nltk.download('wordnet')
# nltk.download('averaged_perceptron_tagger')

# app = Flask(__name__)
# app.config['UPLOAD_FOLDER'] = 'uploads'
# app.config['AUDIO_FOLDER'] = 'audio'

# # Load NLP models
# nlp = spacy.blank("en")
# tokenizer = T5Tokenizer.from_pretrained('t5-small')
# model = T5ForConditionalGeneration.from_pretrained('t5-small')

# # Tesseract path (change this if needed)
# pytesseract.pytesseract.tesseract_cmd = r"C:/Program Files/Tesseract-OCR/tesseract.exe"

# def preprocess_image(image_path):
#     img = cv2.imread(image_path)
#     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#     _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#     clean = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, np.ones((2, 2), np.uint8))
#     clean = cv2.bilateralFilter(clean, 9, 75, 75)
#     return Image.fromarray(clean)

# def extract_text_from_image(image_path):
#     pil_img = preprocess_image(image_path)
#     config = "--oem 3 --psm 6"
#     return pytesseract.image_to_string(pil_img, config=config).replace("\n", " ").strip()

# def simplify_text(text):
#     input_text = f"paraphrase: {text}"
#     input_ids = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
#     outputs = model.generate(input_ids, max_length=150, min_length=40, num_beams=4, temperature=0.7)
#     return tokenizer.decode(outputs[0], skip_special_tokens=True)

# def text_to_speech(text, filename="audio/audio.mp3"):
#     engine = pyttsx3.init(driverName='sapi5')  # Remove driverName for Linux/macOS
#     engine.save_to_file(text, filename)
#     engine.runAndWait()
#     return filename

# @app.route('/')
# def home():
#     # Serve index.html from root directory
#     with open("index.html", "r", encoding="utf-8") as f:
#         return f.read()

# @app.route('/process', methods=['POST'])
# def process():
#     try:
#         result = {}
#         text = request.form.get('text')
#         file = request.files.get('image')

#         print("\n🔔 Incoming request")
#         print("📨 Text provided:", text)
#         print("🖼️ Image file uploaded:", file.filename if file else "No")

#         # Process uploaded image
#         if file:
#             image_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
#             file.save(image_path)
#             print("✅ Image saved to:", image_path)

#             extracted_text = extract_text_from_image(image_path)
#             print("🧠 OCR Extracted Text:", extracted_text)

#             result['extracted_text'] = extracted_text
#             text = extracted_text

#         # Validate input
#         if not text or text.strip() == "":
#             raise ValueError("No valid text provided for simplification.")

#         # Simplify text
#         simplified = simplify_text(text)
#         print("✏️ Simplified Text:", simplified)

#         # Convert to speech
#         audio_path = text_to_speech(simplified, filename="audio/audio.mp3")
#         print("🔊 Audio saved at:", audio_path)

#         result['simplified_text'] = simplified
#         result['audio_url'] = '/' + audio_path.replace("\\", "/")

#         return jsonify(result)

#     except Exception as e:
#         print("❌ ERROR:", str(e))
#         return jsonify({'error': str(e)}), 500

# @app.route('/audio/<filename>')
# def serve_audio(filename):
#     return send_file(os.path.join(app.config['AUDIO_FOLDER'], filename), as_attachment=False)

# @app.route('/<path:filename>')
# def serve_static_file(filename):
#     return send_file(filename)

# if __name__ == '__main__':
#     os.makedirs("uploads", exist_ok=True)
#     os.makedirs("audio", exist_ok=True)
#     app.run(debug=True)



from flask import Flask, request, jsonify, send_file
import os
import pytesseract
from PIL import Image
import cv2
import numpy as np
from transformers import T5ForConditionalGeneration, T5Tokenizer
import spacy
import nltk
import pyttsx3
import pyphen
from transformers import MarianMTModel, MarianTokenizer


nltk.download('punkt')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['AUDIO_FOLDER'] = 'audio'

nlp = spacy.blank("en")
tokenizer = T5Tokenizer.from_pretrained('t5-small')
model = T5ForConditionalGeneration.from_pretrained('t5-small')

pytesseract.pytesseract.tesseract_cmd = r"C:/Program Files/Tesseract-OCR/tesseract.exe"

def preprocess_image(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    clean = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, np.ones((2, 2), np.uint8))
    clean = cv2.bilateralFilter(clean, 9, 75, 75)
    return Image.fromarray(clean)

def extract_text_from_image(image_path):
    pil_img = preprocess_image(image_path)
    config = "--oem 3 --psm 6"
    return pytesseract.image_to_string(pil_img, config=config).replace("\n", " ").strip()

def simplify_text(text):
    input_text = f"paraphrase: {text}"
    input_ids = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
    outputs = model.generate(input_ids, max_length=150, min_length=40, num_beams=4, temperature=0.7)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

translation_models = {}

def load_translation_model(lang_code):
    model_name = {
        "hi": "Helsinki-NLP/opus-mt-en-hi",
        "mr": "Helsinki-NLP/opus-mt-en-mr"
    }.get(lang_code)
    
    if not model_name:
        raise ValueError("Unsupported language code")
    
    if lang_code not in translation_models:
        tokenizer = MarianTokenizer.from_pretrained(model_name)
        model = MarianMTModel.from_pretrained(model_name)
        translation_models[lang_code] = (tokenizer, model)
    
    return translation_models[lang_code]

def translate_text(text, lang_codes):
    translated = []
    for code in lang_codes:
        tokenizer, model = load_translation_model(code)
        input_ids = tokenizer.encode(text, return_tensors="pt", max_length=512, truncation=True)
        output = model.generate(input_ids, max_length=512)
        translated.append(tokenizer.decode(output[0], skip_special_tokens=True))
    return translated


def text_to_speech(text, filename="audio/audio.mp3"):
    engine = pyttsx3.init(driverName='sapi5')
    engine.save_to_file(text, filename)
    engine.runAndWait()
    return filename

@app.route('/')
def home():
    with open("index.html", "r", encoding="utf-8") as f:
        return f.read()

@app.route('/process', methods=['POST'])
def process():
    try:
        result = {}
        text = request.form.get('text')
        file = request.files.get('image')

        if file:
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(image_path)
            extracted_text = extract_text_from_image(image_path)
            result['extracted_text'] = extracted_text
            text = extracted_text

        if not text or text.strip() == "":
            raise ValueError("No valid text to simplify.")

        simplified = simplify_text(text)
        audio_file = text_to_speech(simplified)

        result['simplified_text'] = simplified
        result['audio_url'] = '/' + audio_file.replace("\\", "/")

        return jsonify(result)

    except Exception as e:
        print("❌ ERROR:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/hyphenate', methods=['POST'])
def hyphenate():
    data = request.get_json()
    text = data.get('text', '')
    dic = pyphen.Pyphen(lang='en_US')

    def force_hyphenate(word, min_parts=2):
        if len(word) >= 4:
            hyphenated = dic.inserted(word, '-')
            parts = hyphenated.split('-')
            if len(parts) < min_parts:
                mid = len(word) // 2
                return word[:mid] + '-' + word[mid:]
            return hyphenated
        return word

    words = text.split()
    hyphenated_words = [force_hyphenate(word) for word in words]
    return jsonify({'hyphenated': ' '.join(hyphenated_words)})

@app.route('/audio/<filename>')
def serve_audio(filename):
    return send_file(os.path.join(app.config['AUDIO_FOLDER'], filename), as_attachment=False)

@app.route('/<path:filename>')
def serve_static_file(filename):
    return send_file(filename)

@app.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.get_json()
        text = data.get('text', '')
        languages = data.get('languages', [])
        if not text or not languages:
            return jsonify({'translated': []})
        
        translated = translate_text(text, languages)
        return jsonify({'translated': translated})
    except Exception as e:
        print("Translation Error:", str(e))
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("audio", exist_ok=True)
    app.run(debug=True)
