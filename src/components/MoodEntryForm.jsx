import React, { useState, useEffect, useContext } from 'react';
import { MoodSelector } from './MoodSelector';
import WeatherWidget from './WeatherWidget';
import { WeatherContext } from '../App.jsx';

// Background gradient maps for different moods
const moodBackgrounds = {
  'very-happy': 'from-green-100 to-green-50 dark:from-green-900 dark:to-green-950',
  'happy': 'from-emerald-100 to-emerald-50 dark:from-emerald-900 dark:to-emerald-950',
  'neutral': 'from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-950',
  'sad': 'from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-950',
  'angry': 'from-red-100 to-red-50 dark:from-red-900 dark:to-red-950',
};

// Weather-appropriate header gradients
const weatherHeaderGradients = {
  clear: 'from-blue-500 to-indigo-500',
  clouds: 'from-gray-400 to-blue-400',
  rain: 'from-blue-600 to-indigo-700',
  snow: 'from-blue-300 to-indigo-400',
  thunderstorm: 'from-purple-600 to-indigo-800',
  drizzle: 'from-blue-500 to-indigo-600',
  mist: 'from-gray-500 to-gray-700',
  default: 'from-indigo-500 to-purple-600'
};

/**
 * MoodEntryForm Component
 * Renders a form for daily mood entry with notes and weather data
 * Props:
 *  - onSave: function(entry) optional callback when entry is saved
 */
export default function MoodEntryForm({ onSave }) {
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [weather, setWeather] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const { weatherData } = useContext(WeatherContext);
  const [weatherTheme, setWeatherTheme] = useState('default');

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today.toLocaleDateString());
  }, []);
  
  // Update weather theme when weather changes
  useEffect(() => {
    if (weatherData && weatherData.description) {
      const desc = weatherData.description.toLowerCase();
      if (desc.includes('clear')) setWeatherTheme('clear');
      else if (desc.includes('cloud')) setWeatherTheme('clouds');
      else if (desc.includes('rain')) setWeatherTheme('rain');
      else if (desc.includes('snow')) setWeatherTheme('snow');
      else if (desc.includes('thunderstorm')) setWeatherTheme('thunderstorm');
      else if (desc.includes('drizzle')) setWeatherTheme('drizzle');
      else if (desc.includes('mist') || desc.includes('fog') || desc.includes('haze')) setWeatherTheme('mist');
      else setWeatherTheme('default');
    }
  }, [weatherData]);

  const handleSave = () => {
    if (!selectedMood || !note) {
      setSaveStatus({
        type: 'error',
        message: 'Please select a mood and write a note!'
      });
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    const entry = { date: currentDate, mood: selectedMood, note, weather };
    
    if (onSave) {
      onSave(entry);
    } else {
      // Store multiple entries
      const existingEntries = JSON.parse(localStorage.getItem('moodEntries')) || [];
      existingEntries.push(entry);
      localStorage.setItem('moodEntries', JSON.stringify(existingEntries));
      
      setSaveStatus({
        type: 'success',
        message: 'Entry saved successfully!'
      });
      setTimeout(() => setSaveStatus(null), 3000);
    }

    // Clear the form after saving
    setSelectedMood('');
    setNote('');
    setWeather(null);
  };

  return (
    <div className={`glass-effect rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ${selectedMood ? `bg-gradient-to-br ${moodBackgrounds[selectedMood]}` : ''}`}>
      <div className={`bg-gradient-to-r ${weatherHeaderGradients[weatherTheme]} p-5 text-white relative overflow-hidden`}>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold">Today's Mood Entry</h2>
          <p className="text-indigo-100">{currentDate}</p>
        </div>
        
        {/* Weather-themed decorative elements */}
        {weatherTheme === 'clear' && (
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-300 rounded-full opacity-50 -mt-4 -mr-4"></div>
        )}
        {weatherTheme === 'clouds' && (
          <>
            <div className="absolute top-1 right-8 w-12 h-6 bg-gray-100 rounded-full opacity-40"></div>
            <div className="absolute top-4 right-2 w-8 h-4 bg-gray-100 rounded-full opacity-30"></div>
          </>
        )}
        {weatherTheme === 'rain' && (
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-0.5 h-4 bg-blue-200 animate-rain"></div>
            <div className="absolute top-0 left-1/3 w-0.5 h-4 bg-blue-200 animate-rain" style={{ animationDelay: '0.3s' }}></div>
            <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-blue-200 animate-rain" style={{ animationDelay: '0.1s' }}></div>
            <div className="absolute top-0 left-2/3 w-0.5 h-4 bg-blue-200 animate-rain" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-0 left-3/4 w-0.5 h-4 bg-blue-200 animate-rain" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">How are you feeling today?</label>
          <MoodSelector selectedMood={selectedMood} onSelect={setSelectedMood} />
        </div>
        
        <div className="mb-6">
          <WeatherWidget onWeather={setWeather} />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Journal Entry</label>
          <textarea
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-h-[120px] text-gray-700 dark:text-gray-200 dark:bg-gray-800"
            placeholder="How was your day? What's on your mind?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        
        {saveStatus && (
          <div className={`mb-4 p-3 rounded-lg ${
            saveStatus.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800' 
              : 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800'
          }`}>
            {saveStatus.message}
          </div>
        )}
        
        <button
          onClick={handleSave}
          className="btn-primary w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Save Entry
        </button>
      </div>
    </div>
  );
}
