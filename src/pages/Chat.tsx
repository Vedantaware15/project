// pages/chat.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export function Chat() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
      setAnswer('');
      setQuestion('');
    }
  };

  const handleUpload = async () => {
    if (!pdfFile) return alert("Please upload a PDF first!");
    const formData = new FormData();
    formData.append('pdf', pdfFile);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/upload', formData);
      setPdfText(res.data.text);
      alert('PDF uploaded and text extracted!');
    } catch (error) {
      console.error(error);
      alert('Failed to upload or extract PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!pdfText || !question) return alert("PDF must be uploaded and a question must be entered.");

    try {
      setLoading(true);
      
      // Truncate PDF text if it's too large (to avoid request size issues)
      const truncatedText = pdfText.length > 10000 
        ? pdfText.substring(0, 10000) + "... (text truncated)" 
        : pdfText;
      
      console.log(`Sending request with question: "${question}" and text length: ${truncatedText.length}`);
      
      const res = await axios.post('http://localhost:5000/ask', {
        question,
        pdf_text: truncatedText
      });
      
      console.log('Response received:', res.data);
      setAnswer(res.data.answer);
    } catch (error) {
      console.error('Error details:', error);
      
      // Extract more detailed error information
      let errorMessage = 'Failed to get answer.';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `Server error: ${error.response.status} - ${error.response.statusText}`;
        if (error.response.data && error.response.data.error) {
          errorMessage += `\n${error.response.data.error}`;
        }
      }
      
      alert(errorMessage);
      setAnswer(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Test backend connection
  const testBackend = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/test');
      setBackendStatus(`Backend status: ${res.data.status} - ${res.data.message}`);
      console.log('Backend test response:', res.data);
    } catch (error) {
      console.error('Backend test error:', error);
      setBackendStatus('Backend connection failed. Check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Call testBackend when component mounts
  useEffect(() => {
    testBackend();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">PDF Chat Assistant</h1>
      
      {backendStatus && (
        <div className={`mb-4 p-3 rounded ${backendStatus.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {backendStatus}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange} 
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>
        
        <button
          onClick={handleUpload}
          className="bg-indigo-600 text-white px-4 py-2 rounded mb-4 hover:bg-indigo-700 disabled:opacity-50"
          disabled={loading || !pdfFile}
        >
          {loading ? 'Uploading...' : 'Upload PDF'}
        </button>

        {pdfText && (
          <div className="mb-4">
            <textarea
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Ask a question about the PDF..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button
              onClick={handleAsk}
              className="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700 disabled:opacity-50"
              disabled={loading || !question}
            >
              {loading ? 'Thinking...' : 'Ask Question'}
            </button>
          </div>
        )}

        {answer && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <strong className="text-gray-700">Answer:</strong>
            <p className="mt-2 text-gray-600">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
