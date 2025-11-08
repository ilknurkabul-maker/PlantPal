import React, { useState, useCallback } from 'react';
import { identifyPlant } from './services/geminiService';
import type { PlantInfo, Schedule } from './types';
import { ImageUpload } from './components/ImageUpload';
import { IdentificationResult } from './components/IdentificationResult';
import { ScheduleView } from './components/ScheduleView';
import { Spinner } from './components/Spinner';
import { Alert } from './components/Alert';
import { Header } from './components/Header';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setSelectedFile(null);
    setImagePreview(null);
    setPlantInfo(null);
    setSchedule(null);
    setIsLoading(false);
    setError(null);
  }, []);

  const handleImageSelect = useCallback((file: File | null) => {
    resetState();
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Please upload a JPEG or PNG image.');
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, [resetState]);

  const handleIdentify = useCallback(async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setPlantInfo(null);
    setSchedule(null);

    try {
      const result = await identifyPlant(selectedFile);
      if (result.error) {
        setError(result.error);
      } else {
        setPlantInfo(result);
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred during identification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);

  const handleScheduleCreate = useCallback((startDate: string, frequency: number) => {
    if (!plantInfo) return;

    const calculateNextWateringDate = (startDateStr: string, freq: number): Date => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const startDateParts = startDateStr.split('-').map(Number);
        const startDateUTC = new Date(Date.UTC(startDateParts[0], startDateParts[1] - 1, startDateParts[2]));
        
        if (startDateUTC.getTime() >= today.getTime()) {
            return startDateUTC;
        }

        const diffTime = today.getTime() - startDateUTC.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays % freq === 0) {
            return today;
        }

        const periodsPassed = Math.floor(diffDays / freq);
        const nextWateringOffset = (periodsPassed + 1) * freq;
        
        const nextDate = new Date(startDateUTC.getTime());
        nextDate.setUTCDate(startDateUTC.getUTCDate() + nextWateringOffset);
        return nextDate;
    };

    const nextDate = calculateNextWateringDate(startDate, frequency);
    
    setSchedule({
      plantName: plantInfo.plantName,
      startDate: startDate,
      frequency: frequency,
      nextWateringDate: nextDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),
    });
  }, [plantInfo]);

  const renderContent = () => {
    if (schedule) {
      return <ScheduleView schedule={schedule} onReset={resetState} />;
    }
    if (plantInfo) {
      return (
        <IdentificationResult
          plantInfo={plantInfo}
          imagePreview={imagePreview!}
          onCreateSchedule={handleScheduleCreate}
          onReset={resetState}
        />
      );
    }
    return (
      <ImageUpload
        onImageSelect={handleImageSelect}
        onIdentify={handleIdentify}
        imagePreview={imagePreview}
        selectedFile={selectedFile}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans transition-colors duration-300">
      <main className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6 relative overflow-hidden border border-gray-200">
        {isLoading && <Spinner />}
        <Header />
        {error && <Alert message={error} onClose={() => setError(null)} />}
        {renderContent()}
      </main>
      <footer className="text-center mt-6 text-sm text-gray-500">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
