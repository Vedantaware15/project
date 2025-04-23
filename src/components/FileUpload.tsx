import React, { useState, useRef } from 'react';
import { Upload, File, CheckCircle, X, AlertCircle } from 'lucide-react';
import { formatFileSize, formatDate } from '../utils/formatters';

interface UploadedFile {
  file: File;
  uploadTime: Date;
  status: 'success' | 'error';
}

export function FileUpload() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    // Validate file size (100MB = 100 * 1024 * 1024 bytes)
    if (file.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB');
      return;
    }

    setError(null);
    setUploadedFile({
      file,
      uploadTime: new Date(),
      status: 'success'
    });
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        {/* Upload Button */}
        <div className="flex justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            <Upload className="h-5 w-5" />
            Upload Paper
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Uploaded File Card */}
        {uploadedFile && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <File className="h-8 w-8 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {uploadedFile.file.name}
                    </h3>
                    <div className="mt-1 text-sm text-gray-500 space-y-1">
                      <p>Size: {formatFileSize(uploadedFile.file.size)}</p>
                      <p>Uploaded: {formatDate(uploadedFile.uploadTime)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <button
                    onClick={handleRemoveFile}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Instructions */}
        {!uploadedFile && (
          <div className="text-center text-gray-500 text-sm">
            <p>Supported format: PDF</p>
            <p>Maximum file size: 100MB</p>
          </div>
        )}
      </div>
    </div>
  );
} 