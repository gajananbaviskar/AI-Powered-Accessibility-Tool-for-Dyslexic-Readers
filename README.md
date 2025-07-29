# AI-Powered Accessibility Tool for Dyslexic Readers

## Overview

This project is an AI-powered accessibility tool designed to assist dyslexic readers by simplifying complex text, converting text to speech, and providing various customization options to enhance readability. The tool includes features like text simplification, hyphenation, translation to multiple languages, and a chatbot assistant for additional support.

## Features

1. **Text Simplification**: Uses AI to paraphrase and simplify complex text for easier comprehension.
2. **OCR (Optical Character Recognition)**: Extracts text from uploaded images for processing.
3. **Text-to-Speech**: Converts simplified text into audio for auditory learning.
4. **Hyphenation**: Breaks down words into syllables to improve readability.
5. **Multi-Language Translation**: Supports translation of simplified text into Hindi and Marathi.
6. **Accessibility Settings**:
   - OpenDyslexic font toggle
   - Adjustable font size, line spacing, word spacing, and letter spacing
   - Bold text option
7. **Speech Recognition**: Allows voice input for hands-free operation.
8. **Chatbot Assistant**: Provides additional support through an AI-powered chat interface.

## Technical Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python (Flask), Node.js
- **AI Models**:
  - T5 for text simplification
  - MarianMT for translation
  - Gemini for chatbot functionality
- **Libraries**:
  - Pytesseract for OCR
  - OpenCV for image processing
  - Pyttsx3 for text-to-speech
  - Pyphen for hyphenation

## File Structure

- `app.py`: Main Flask application (Python backend)
- `server.js`: Node.js server for chatbot functionality
- `index.html`: Main application interface
- `script.js`: Client-side JavaScript functionality
- `styles.css`: Application styling
- `translations.js`: Multi-language translations for UI elements

## How to Run the Project

Follow these steps to set up and run the application:

1. **Install Dependencies**:
   - Ensure you have Python (3.6+) and Node.js installed
   - Install Python dependencies:
     ```
     pip install flask pytesseract pillow opencv-python numpy transformers spacy nltk pyttsx3 pyphen
     ```
   - Install Node.js dependencies:
     ```
     npm install express cors dotenv
     ```

2. **Set Up Tesseract OCR**:
   - Install Tesseract OCR on your system
   - Update the path in `app.py` if necessary:
     ```python
     pytesseract.pytesseract.tesseract_cmd = r"C:/Program Files/Tesseract-OCR/tesseract.exe"
     ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory with your Gemini API key:
     ```
     API_KEY=your_gemini_api_key_here
     ```

4. **Run the Servers**:
   - Open two terminal windows
   - In the first terminal, run the Node.js server:
     ```
     node server.js
     ```
   - In the second terminal, run the Flask application:
     ```
     python app.py
     ```

5. **Access the Application**:
   - Open your browser and navigate to:
     ```
     http://localhost:5000/
     ```

## Usage Instructions

1. **Input Text**:
   - Type text directly into the input box or upload an image containing text
   - You can also use the microphone button for voice input

2. **Process Text**:
   - Click "Simplify Text" to process the input
   - The simplified text will appear in the output section

3. **Additional Features**:
   - Use the "Toggle Hyphenation" button to enable/disable word hyphenation
   - Check the Hindi or Marathi boxes to translate the simplified text
   - Click "Play" to listen to the audio version of the simplified text
   - Adjust the playback speed using the slider

4. **Customize Display**:
   - Use the settings panel to adjust:
     - Font type (OpenDyslexic or standard)
     - Font size
     - Line spacing
     - Word spacing
     - Letter spacing
     - Bold text option

5. **Chatbot Assistance**:
   - Click the chat button in the bottom-right corner to open the chatbot
   - Type your questions and receive AI-generated responses

## Notes

- The application creates two directories automatically:
  - `uploads/` for storing uploaded images
  - `audio/` for storing generated audio files
- For best performance, ensure you have a stable internet connection for AI model downloads and API calls
- The first run may take longer as it downloads necessary NLP models

## Future Enhancements

1. Support for more languages in translation
2. Additional text simplification options
3. User accounts to save preferences
4. Mobile app version
5. Integration with more document formats (PDF, DOCX, etc.)

## License

This project is open-source and available for educational and non-commercial use. Please attribute the original authors if you build upon this work.