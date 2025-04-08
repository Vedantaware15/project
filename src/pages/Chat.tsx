import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Upload, X, FileText, Loader, AlertCircle } from 'lucide-react';
import { grokApi } from '../services/grokApi';
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  isLoading?: boolean;
  error?: boolean;
}

interface UploadedFile extends File {
  content?: string;
}

export function Chat() {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your research assistant powered by Grok. I can help you analyze papers and answer questions about their content. Upload a file to get started!",
      isBot: true
    }
  ]);

  // Method 1: Using FileReader for text files
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  // Method 2: Using Blob and text() for any text-based file
  const readFileAsBlob = async (file: File): Promise<string> => {
    try {
      const text = await file.text();
      return text;
    } catch (error) {
      throw new Error('Failed to read file content');
    }
  };

  // Method 3: Using ArrayBuffer for binary files
  const readFileAsBuffer = async (file: File): Promise<string> => {
    try {
      const buffer = await file.arrayBuffer();
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(buffer);
    } catch (error) {
      throw new Error('Failed to read file content');
    }
  };

  // Method for handling PDF files specifically
  const readPdfFile = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error) {
      console.error('Error reading PDF:', error);
      throw new Error('Failed to read PDF file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: message,
      isBot: false
    };

    const loadingMessage: Message = {
      id: messages.length + 2,
      text: "Analyzing your question...",
      isBot: true,
      isLoading: true
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setMessage('');
    setIsProcessing(true);

    try {
      // Get context from files
      let context = '';
      if (files.length > 0) {
        context = files.map(file => 
          `File: ${file.name}\nContent: ${file.content || ''}\n`
        ).join('\n');
      }

      // Get response from Grok
      const response = await grokApi.sendMessage([
        {
          role: 'system',
          content: 'You are a research assistant AI that helps analyze papers and answer questions about them. Base your answers on the provided paper content.'
        },
        {
          role: 'user',
          content: `Context from uploaded files:\n${context}\n\nQuestion: ${message}`
        }
      ]);

      setMessages(prev => 
        prev.filter(msg => !msg.isLoading).concat({
          id: prev.length + 1,
          text: response,
          isBot: true
        })
      );
    } catch (error: any) {
      setMessages(prev => 
        prev.filter(msg => !msg.isLoading).concat({
          id: prev.length + 1,
          text: error.message || "I apologize, but I encountered an error. Please try again.",
          isBot: true,
          error: true
        })
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      let text = '';

      if (file.type === 'application/pdf') {
        text = await readPdfFile(file);
      } else {
        text = await file.text();
      }

      const processedFile = Object.assign(file, { content: text });
      setFiles(prev => [...prev, processedFile]);

      // Get initial analysis from Grok
      const analysis = await grokApi.analyzePaper(text);
      
      setMessages(prev => 
        prev.filter(msg => !msg.isLoading).concat({
          id: prev.length + 1,
          text: `Analysis of ${file.name}:\n\n${analysis}`,
          isBot: true
        })
      );
    } catch (error: any) {
      setMessages(prev => 
        prev.filter(msg => !msg.isLoading).concat({
          id: prev.length + 1,
          text: error.message || "Error processing file. Please try again.",
          isBot: true,
          error: true
        })
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-12rem)]">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold text-gray-900">Research Assistant</h1>
            <p className="text-sm text-gray-500">Powered by Grok - Upload files and ask questions about them</p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="px-4 py-2 border-b bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Uploaded Files</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border text-sm"
                  >
                    <span className="text-gray-600">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`flex max-w-[80%] ${
                    msg.isBot
                      ? msg.error 
                        ? 'bg-red-50 text-red-700'
                        : 'bg-gray-100 text-gray-900'
                      : 'bg-indigo-600 text-white'
                  } rounded-lg px-4 py-2`}
                >
                  {msg.isBot && (
                    msg.isLoading ? (
                      <Loader className="h-5 w-5 mr-2 flex-shrink-0 mt-1 animate-spin" />
                    ) : msg.error ? (
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-1" />
                    ) : (
                      <Bot className="h-5 w-5 mr-2 flex-shrink-0 mt-1" />
                    )
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                Upload Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask a question about your files..."
                disabled={isProcessing}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isProcessing || !message.trim()}
                className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}