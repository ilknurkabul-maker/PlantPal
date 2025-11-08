import React, { useState } from 'react';
import type { PlantInfo } from '../types';

interface IdentificationResultProps {
    plantInfo: PlantInfo;
    imagePreview: string;
    onCreateSchedule: (startDate: string, frequency: number) => void;
    onReset: () => void;
}

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);


export const IdentificationResult: React.FC<IdentificationResultProps> = ({ plantInfo, imagePreview, onCreateSchedule, onReset }) => {
    const today = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(today);
    const [frequency, setFrequency] = useState(plantInfo.wateringFrequencyDays);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreateSchedule(startDate, frequency);
    };

    return (
        <div className="flex flex-col items-center space-y-4 animate-fade-in">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md -mt-16">
                <img src={imagePreview} alt={plantInfo.plantName} className="object-cover w-full h-full" />
            </div>
            
            <div className="text-center">
                <p className="text-gray-600">We identified your plant as:</p>
                <h2 className="text-2xl font-bold text-green-800">{plantInfo.plantName}</h2>
                <p className="text-gray-600 mt-1">Recommended watering: <span className="font-semibold">every {plantInfo.wateringFrequencyDays} days</span>.</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full bg-green-50 p-4 rounded-lg space-y-4 border border-green-200">
                <h3 className="text-lg font-semibold text-center text-gray-700">Create Watering Schedule</h3>
                
                <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Start Date</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            id="start-date"
                            value={startDate}
                            min={today}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Water every (days)</label>
                    <input
                        type="number"
                        id="frequency"
                        value={frequency}
                        onChange={(e) => setFrequency(parseInt(e.target.value, 10))}
                        min="1"
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ease-in-out"
                >
                    Save Schedule
                </button>
            </form>

            <button
                onClick={onReset}
                className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
            >
                Identify another plant
            </button>
        </div>
    );
};
