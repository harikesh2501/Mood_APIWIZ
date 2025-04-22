import React, { useState, useEffect, useContext } from 'react';
import { WeatherContext } from '../App.jsx';

// Map mood values to colors
const moodColors = {
  'very-happy': 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-600 dark:text-green-300',
  'happy': 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900 dark:border-emerald-600 dark:text-emerald-300',
  'neutral': 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300',
  'sad': 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900 dark:border-purple-600 dark:text-purple-300',
  'angry': 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900 dark:border-red-600 dark:text-red-300'
};

// Map mood values to icons
const moodIcons = {
  'very-happy': '😄',
  'happy': '🙂',
  'neutral': '😐',
  'sad': '😞',
  'angry': '😡'
};

// Mood filter options
const filterOptions = [
  { label: 'All Entries', value: 'all' },
  { label: 'Very Happy', value: 'very-happy', icon: '😄' },
  { label: 'Happy', value: 'happy', icon: '🙂' },
  { label: 'Neutral', value: 'neutral', icon: '😐' },
  { label: 'Sad', value: 'sad', icon: '😞' },
  { label: 'Angry', value: 'angry', icon: '😡' },
];

// Weather-appropriate header gradients
const weatherHeaderGradients = {
  clear: 'from-purple-500 to-blue-500',
  clouds: 'from-purple-400 to-gray-400',
  rain: 'from-purple-600 to-blue-700',
  snow: 'from-purple-300 to-blue-400',
  thunderstorm: 'from-purple-700 to-indigo-800',
  drizzle: 'from-purple-500 to-blue-600',
  mist: 'from-purple-500 to-gray-700',
  default: 'from-purple-500 to-indigo-600'
};

export default function CalendarView() {
  const [entries, setEntries] = useState([]);
  const [allEntries, setAllEntries] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const { weatherData } = useContext(WeatherContext);
  const [weatherTheme, setWeatherTheme] = useState('default');

  useEffect(() => {
    const saved = localStorage.getItem('moodEntries');
    if (saved) {
      const parsedEntries = JSON.parse(saved);
      setAllEntries(parsedEntries);
      setEntries(parsedEntries);
    }
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

  // Filter entries based on selected mood
  const filterEntries = (mood) => {
    setActiveFilter(mood);
    
    if (mood === 'all') {
      setEntries(allEntries);
    } else {
      setEntries(allEntries.filter(entry => entry.mood === mood));
    }
  };

  // Get weather icon for the header
  const getWeatherIcon = () => {
    if (!weatherTheme || weatherTheme === 'default') return null;
    
    const icons = {
      clear: '☀️',
      clouds: '☁️',
      rain: '🌧️',
      snow: '❄️',
      thunderstorm: '⚡',
      drizzle: '🌦️',
      mist: '🌫️'
    };
    
    return icons[weatherTheme] || null;
  };

  return (
    <div className="glass-effect rounded-2xl shadow-lg overflow-hidden">
      <div className={`bg-gradient-to-r ${weatherHeaderGradients[weatherTheme]} p-5 text-white relative overflow-hidden`}>
        <div className="relative z-10 flex items-center">
          <h2 className="text-2xl font-bold">Your Mood History</h2>
          {getWeatherIcon() && (
            <span className="ml-2 text-xl">{getWeatherIcon()}</span>
          )}
        </div>
        
        {/* Weather-themed decorative elements */}
        {weatherTheme === 'snow' && (
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <div className="absolute top-0 left-1/5 w-1 h-1 bg-white rounded-full animate-snowfall"></div>
            <div className="absolute top-0 left-2/5 w-1 h-1 bg-white rounded-full animate-snowfall" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-0 left-3/5 w-1 h-1 bg-white rounded-full animate-snowfall" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute top-0 left-4/5 w-1 h-1 bg-white rounded-full animate-snowfall" style={{ animationDelay: '0.7s' }}></div>
          </div>
        )}
        
        {weatherTheme === 'thunderstorm' && (
          <div className="absolute right-4 top-4 text-xl transform rotate-12 animate-flash">⚡</div>
        )}
      </div>
      
      <div className="p-6">
        {/* Filter buttons */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by mood:</label>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => filterEntries(option.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center ${
                  activeFilter === option.value
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700 border'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {option.icon && <span className="mr-1">{option.icon}</span>}
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.length > 0 ? (
            entries.map((entry, index) => (
              <div 
                key={index} 
                className={`mood-card rounded-xl p-4 border-2 ${moodColors[entry.mood] || 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{entry.date}</h3>
                  <span className="text-2xl">{moodIcons[entry.mood]}</span>
                </div>
                
                {entry.weather && (
                  <div className="flex items-center space-x-2 mb-3 text-gray-700 dark:text-gray-300 text-sm bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 rounded p-2">
                    <img src={entry.weather.icon} alt="weather" className="w-8 h-8" />
                    <div>
                      <span>{Math.round(entry.weather.temp)}°C</span>
                      <span className="ml-1 capitalize">{entry.weather.description}</span>
                    </div>
                  </div>
                )}
                
                {entry.note && (
                  <div className="bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70 rounded-lg p-3 mt-2 text-gray-700 dark:text-gray-300">
                    <p className="text-sm">{entry.note}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center p-8 bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-40 rounded-lg">
              {activeFilter !== 'all' ? (
                <>
                  <span className="text-4xl block mb-4">{filterOptions.find(opt => opt.value === activeFilter)?.icon}</span>
                  <p className="text-gray-600 dark:text-gray-300">No entries found with this mood.</p>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-300">No entries found. Start tracking your mood!</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}