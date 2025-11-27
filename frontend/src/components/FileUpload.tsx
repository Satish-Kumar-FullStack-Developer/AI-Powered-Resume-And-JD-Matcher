import React from 'react';

interface FileUploadProps {
  label: string;
  accept: string;
  onChange: (file: File | null) => void;
  fileName?: string;
  error?: string;
  disabled?: boolean;
}

/**
 * File Upload Component
 */
export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  onChange,
  fileName,
  error,
  disabled = false,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onChange(file || null);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          error ? 'border-red-400 bg-red-50' : 'border-blue-300 hover:border-blue-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
          id={label}
        />
        <label htmlFor={label} className="cursor-pointer">
          {fileName ? (
            <div>
              <div className="text-green-600 font-medium">✓ {fileName}</div>
              <div className="text-sm text-gray-500">Click to change</div>
            </div>
          ) : (
            <div>
              <div className="text-gray-600">📄 Click to upload or drag and drop</div>
              <div className="text-sm text-gray-500">{accept}</div>
            </div>
          )}
        </label>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default FileUpload;
