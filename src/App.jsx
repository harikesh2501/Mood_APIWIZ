import React, { useState, useEffect, createContext } from 'react';
import MoodEntryForm from './components/MoodEntryForm.jsx';
import CalendarView from './components/CalendarView.jsx';
import ThemeToggler from './components/ThemeToggler.jsx';
import ExportButton from './components/ExportButton.jsx';
import './index.css';

// Use dynamic import for MoodTrends to prevent the initial load error
const MoodTrends = React.lazy(() => import('./components/MoodTrends.jsx'));

// Create context to share weather data
export const WeatherContext = createContext(null);

// Weather-themed background classes
const weatherBackgrounds = {
  // Clear sky
  clear: "bg-gradient-to-br from-blue-400 to-cyan-300 dark:from-blue-900 dark:to-indigo-900",
  // Clouds
  clouds: "bg-gradient-to-br from-gray-300 to-blue-200 dark:from-gray-800 dark:to-slate-900",
  // Rain
  rain: "bg-gradient-to-br from-blue-500 to-gray-400 dark:from-blue-950 dark:to-gray-900",
  // Snow
  snow: "bg-gradient-to-br from-blue-100 to-gray-100 dark:from-slate-800 dark:to-gray-900",
  // Thunderstorm
  thunderstorm: "bg-gradient-to-br from-purple-700 to-gray-600 dark:from-purple-950 dark:to-gray-950",
  // Drizzle
  drizzle: "bg-gradient-to-br from-blue-400 to-gray-300 dark:from-blue-900 dark:to-gray-800",
  // Mist/Fog
  mist: "bg-gradient-to-br from-gray-400 to-gray-300 dark:from-gray-800 dark:to-gray-700",
  // Default
  default: "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950"
};

export default function App() {
  const [weatherTheme, setWeatherTheme] = useState('default');
  const [weatherData, setWeatherData] = useState(null);

  // Determine weather theme based on current weather
  const getWeatherTheme = (weatherDesc) => {
    if (!weatherDesc) return 'default';
    
    const description = weatherDesc.toLowerCase();
    
    if (description.includes('clear')) return 'clear';
    if (description.includes('cloud')) return 'clouds';
    if (description.includes('rain')) return 'rain';
    if (description.includes('snow')) return 'snow';
    if (description.includes('thunderstorm')) return 'thunderstorm';
    if (description.includes('drizzle')) return 'drizzle';
    if (description.includes('mist') || description.includes('fog') || description.includes('haze')) return 'mist';
    
    return 'default';
  };
  
  // Handle weather data updates
  const handleWeatherUpdate = (data) => {
    setWeatherData(data);
    if (data && data.description) {
      setWeatherTheme(getWeatherTheme(data.description));
    }
  };

  return (
    <WeatherContext.Provider value={{ weatherData, onWeatherUpdate: handleWeatherUpdate }}>
      <div className={`min-h-screen ${weatherBackgrounds[weatherTheme]} py-10 px-4 transition-colors duration-500`}>
        <header className="max-w-5xl mx-auto mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-800 dark:text-indigo-200 mb-2">Mood Journal</h1>
          <p className="text-gray-800 dark:text-gray-200">Track your daily emotions in harmony with the weather</p>
          {weatherData && (
            <div className="mt-2 text-sm text-gray-700 dark:text-gray-200 flex items-center justify-center">
              <span className="capitalize mr-1">Current Weather: {weatherData.description},</span>
              <span className="font-medium">{Math.round(weatherData.temp)}°C</span>
            </div>
          )}
        </header>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="entry-animation">
            <MoodEntryForm />
          </div>
          <div className="entry-animation" style={{ animationDelay: '0.2s' }}>
            <CalendarView />
          </div>
        </div>
        
        <div className="mt-8 max-w-6xl mx-auto">
          <div className="entry-animation" style={{ animationDelay: '0.3s' }}>
            <React.Suspense fallback={<div className="glass-effect p-8 rounded-2xl text-center text-gray-800 dark:text-gray-200">Loading mood trends...</div>}>
              <MoodTrends />
            </React.Suspense>
          </div>
        </div>
        
        <ThemeToggler />
        <ExportButton />
      </div>
    </WeatherContext.Provider>
  );
}
