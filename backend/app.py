from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from pdfminer.high_level import extract_text
from dotenv import load_dotenv
import google.generativeai as genai
import os
import tempfile
import time

load_dotenv()

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS

# Configure Gemini AI
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-pro')

def extract_text_from_pdf(pdf_path):
    return extract_text(pdf_path)

@app.route('/')
def index():
    return 'Gemini PDF Chat Backend is Running'

@app.route('/upload', methods=['POST'])
def upload_pdf():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No PDF file uploaded'}), 400

    pdf_file = request.files['pdf']
    if pdf_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        temp_fd, temp_path = tempfile.mkstemp(suffix='.pdf')
        try:
            pdf_file.save(temp_path)
            text = extract_text_from_pdf(temp_path)
            return jsonify({
                'status': 'success',
                'text': text[:30000]
            })
        finally:
            os.close(temp_fd)
            for _ in range(3):
                try:
                    os.unlink(temp_path)
                    break
                except PermissionError:
                    time.sleep(0.1)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.get_json()
    if not data or 'question' not in data or 'pdf_text' not in data:
        return jsonify({'error': 'Missing question or PDF text'}), 400

    try:
        prompt = f"""You are a helpful assistant that answers questions strictly based on the provided PDF content.
        If the question cannot be answered from the PDF, respond with:
        "I can only answer questions about the uploaded PDF. Please ask something related to its content."

        PDF Content: {data['pdf_text']}
        Question: {data['question']}"""

        response = model.generate_content(prompt)
        return jsonify({'answer': response.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/test', methods=['GET'])
def test():
    return jsonify({'status': 'ok', 'message': 'Backend is working correctly'})

@app.route('/summarize', methods=['POST'])
def summarize_paper():
    data = request.get_json()
    if not data or 'pdf_text' not in data:
        return jsonify({'error': 'Missing PDF text'}), 400

    try:
        # Check if GEMINI_API_KEY is set
        if not GEMINI_API_KEY or GEMINI_API_KEY == 'YOUR_API_KEY_HERE':
            return jsonify({'error': 'Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.'}), 500
            
        # Log the request for debugging
        print(f"Received summarization request with text length: {len(data['pdf_text'])}")
        
        prompt = f"""You are a scientific paper summarization expert. Please provide a comprehensive summary of the following research paper.
        Focus on:
        1. The main research question or objective
        2. Methodology used
        3. Key findings and results
        4. Conclusions and implications
        5. Limitations of the study
        
        Format the summary in clear paragraphs with appropriate headings.
        
        IMPORTANT: Do NOT use markdown formatting like asterisks (*) or bold (**) in your response. Use plain text only.
        
        Paper Content: {data['pdf_text']}"""

        # Log the prompt for debugging
        print(f"Sending prompt to Gemini API: {prompt[:100]}...")
        
        response = model.generate_content(prompt)
        
        # Log the response for debugging
        print(f"Received response from Gemini API: {response.text[:100]}...")
        
        # Clean up any markdown formatting that might still be present
        cleaned_text = response.text.replace('*', '').replace('**', '')
        
        return jsonify({'summary': cleaned_text})
    except Exception as e:
        # Log the full error for debugging
        import traceback
        print(f"Error in summarize_paper: {str(e)}")
        print(traceback.format_exc())
        
        return jsonify({'error': str(e), 'details': traceback.format_exc()}), 500

@app.route('/extract-keywords', methods=['POST'])
def extract_keywords():
    data = request.get_json()
    if not data or 'pdf_text' not in data:
        return jsonify({'error': 'Missing PDF text'}), 400

    try:
        # Check if GEMINI_API_KEY is set
        if not GEMINI_API_KEY or GEMINI_API_KEY == 'YOUR_API_KEY_HERE':
            return jsonify({'error': 'Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.'}), 500
            
        # Log the request for debugging
        print(f"Received keyword extraction request with text length: {len(data['pdf_text'])}")
        
        prompt = f"""You are a keyword extraction expert for scientific papers. Please extract the most important keywords and key phrases from the following research paper.
        
        For each keyword or phrase:
        1. Provide a brief explanation of its significance in the context of the paper
        2. Categorize it (e.g., methodology, finding, concept, tool, etc.)
        
        Format your response as a list of keywords with their explanations and categories.
        
        IMPORTANT: Do NOT use markdown formatting like asterisks (*) or bold (**) in your response. Use plain text only.
        
        Paper Content: {data['pdf_text']}"""

        # Log the prompt for debugging
        print(f"Sending prompt to Gemini API: {prompt[:100]}...")
        
        response = model.generate_content(prompt)
        
        # Log the response for debugging
        print(f"Received response from Gemini API: {response.text[:100]}...")
        
        # Clean up any markdown formatting that might still be present
        cleaned_text = response.text.replace('*', '').replace('**', '')
        
        return jsonify({'keywords': cleaned_text})
    except Exception as e:
        # Log the full error for debugging
        import traceback
        print(f"Error in extract_keywords: {str(e)}")
        print(traceback.format_exc())
        
        return jsonify({'error': str(e), 'details': traceback.format_exc()}), 500

@app.route('/recommend-similar-papers', methods=['POST'])
def recommend_similar_papers():
    data = request.get_json()
    if not data or 'pdf_text' not in data:
        return jsonify({'error': 'Missing PDF text'}), 400

    try:
        # Check if GEMINI_API_KEY is set
        if not GEMINI_API_KEY or GEMINI_API_KEY == 'YOUR_API_KEY_HERE':
            return jsonify({'error': 'Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.'}), 500
            
        # Log the request for debugging
        print(f"Received similar paper recommendation request with text length: {len(data['pdf_text'])}")
        
        prompt = f"""You are a research paper recommendation expert. Based on the following research paper, recommend 5-7 similar papers that would be valuable for further reading.

        For each recommended paper:
        1. Provide the title
        2. List the authors
        3. Include the publication year
        4. Provide a brief explanation of why this paper is relevant to the uploaded paper
        5. Include a link to where the paper can be found (if possible)
        
        Format your response as a list of papers with their details.
        
        IMPORTANT: Do NOT use markdown formatting like asterisks (*) or bold (**) in your response. Use plain text only.
        
        Paper Content: {data['pdf_text']}"""

        # Log the prompt for debugging
        print(f"Sending prompt to Gemini API: {prompt[:100]}...")
        
        response = model.generate_content(prompt)
        
        # Log the response for debugging
        print(f"Received response from Gemini API: {response.text[:100]}...")
        
        # Clean up any markdown formatting that might still be present
        cleaned_text = response.text.replace('*', '').replace('**', '')
        
        return jsonify({'recommendations': cleaned_text})
    except Exception as e:
        # Log the full error for debugging
        import traceback
        print(f"Error in recommend_similar_papers: {str(e)}")
        print(traceback.format_exc())
        
        return jsonify({'error': str(e), 'details': traceback.format_exc()}), 500

if __name__ == '__main__':
    # Check if GEMINI_API_KEY is set
    if not GEMINI_API_KEY or GEMINI_API_KEY == 'YOUR_API_KEY_HERE':
        print("WARNING: Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.")
        print("Summarization and question answering features will not work without a valid API key.")
    
    app.run(debug=True)
