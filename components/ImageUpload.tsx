import React, { useRef } from 'react';

interface ImageUploadProps {
    onImageSelect: (file: File | null) => void;
    onIdentify: () => void;
    imagePreview: string | null;
    selectedFile: File | null;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, onIdentify, imagePreview, selectedFile }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        onImageSelect(file || null);
    };
    
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            {imagePreview ? (
                <div className="w-full h-64 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <img src={imagePreview} alt="Plant preview" className="object-cover h-full w-full" />
                </div>
            ) : (
                <div className="w-full h-64 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 cursor-pointer" onClick={handleButtonClick}>
                    <UploadIcon />
                    <p className="mt-2 text-sm text-gray-500">Click to upload a photo</p>
                    <p className="text-xs text-gray-400">PNG or JPG</p>
                </div>
            )}
            
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png"
                className="hidden"
            />
            
            <button
                onClick={selectedFile ? onIdentify : handleButtonClick}
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {selectedFile ? 'Identify Plant' : 'Select a Photo'}
            </button>
        </div>
    );
};
