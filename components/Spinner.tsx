import React from 'react';

export const Spinner: React.FC = () => (
  <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-10">
    <div className="w-12 h-12 border-4 border-t-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600 font-semibold">Identifying your plant...</p>
  </div>
);
