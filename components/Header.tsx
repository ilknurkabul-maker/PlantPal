import React from 'react';

const LeafIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66C7.32 17.65 10 13 17 11V8m-2-4a1 1 0 0 1 1 1v2.34C19.12 7.8 20.9 8.13 22.4 9c-.04-2.11-.27-4.88-1.74-6.35C19.2 1.2 17.31 1 15.65 1c-1.35 0-2.45.24-3.32.67C10.5 2.5 9.25 4.31 8.5 6.13c1.32-.82 2.8-1.42 4.5-1.76V3a1 1 0 0 1 1-1z" />
    </svg>
);

export const Header: React.FC = () => (
    <div className="text-center">
        <div className="flex items-center justify-center gap-2">
            <LeafIcon className="w-8 h-8 text-green-500" />
            <h1 className="text-3xl font-bold text-gray-800">
                Plant Pal
            </h1>
        </div>
        <p className="text-gray-500 mt-1">Your personal watering scheduler</p>
    </div>
);
