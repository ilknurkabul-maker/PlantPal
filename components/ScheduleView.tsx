import React from 'react';
import type { Schedule } from '../types';

interface ScheduleViewProps {
    schedule: Schedule;
    onReset: () => void;
}

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);


export const ScheduleView: React.FC<ScheduleViewProps> = ({ schedule, onReset }) => {
    return (
        <div className="flex flex-col items-center space-y-4 text-center animate-fade-in">
            <CheckCircleIcon className="w-16 h-16 text-green-500" />
            
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Schedule Created!</h2>
                <p className="text-gray-600">Your <span className="font-semibold text-green-700">{schedule.plantName}</span> is all set.</p>
            </div>

            <div className="w-full bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">Next watering on:</p>
                <p className="text-xl font-bold text-blue-900">{schedule.nextWateringDate}</p>
            </div>
            
            <p className="text-sm text-gray-500">
                You'll water it every <span className="font-semibold">{schedule.frequency}</span> days, starting from {new Date(schedule.startDate + 'T00:00:00Z').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}.
            </p>

            <button
                onClick={onReset}
                className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 ease-in-out mt-4"
            >
                Add Another Plant
            </button>
        </div>
    );
};
