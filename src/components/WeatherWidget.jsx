import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { WeatherContext } from '../App.jsx';

/**
 * WeatherWidget Component
 * Props:
 *  - onWeather: function(weatherObject) callback with weather data
 */
export default function WeatherWidget({ onWeather }) {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { onWeatherUpdate } = useContext(WeatherContext);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
              lat: latitude,
              lon: longitude,
              units: 'metric',
              appid: (import.meta.env.VITE_OPENWEATHER_API_KEY) ? import.meta.env.VITE_OPENWEATHER_API_KEY : "ff7c11066b08c2fcf5d9266272e9f321",
            },
          });
          const data = res.data;
          const weatherInfo = {
            temp: data.main.temp,
            description: data.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            main: data.weather[0].main,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            city: data.name,
            country: data.sys.country,
            sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
            sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
          };
          setWeather(weatherInfo);
          if (onWeather) onWeather(weatherInfo);
          if (onWeatherUpdate) onWeatherUpdate(weatherInfo);
          setLoading(false);
        } catch (e) {
          console.error(e);
          setError('Failed to fetch weather');
          setLoading(false);
        }
      },
      () => {
        setError('Location permission denied');
        setLoading(false);
      }
    );
  }, [onWeather, onWeatherUpdate]);

  // Get weather-specific background gradient
  const getWeatherGradient = () => {
    if (!weather) return 'from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950';
    
    const main = weather.main?.toLowerCase() || '';
    
    if (main.includes('clear')) 
      return 'from-blue-200 to-cyan-100 dark:from-blue-800 dark:to-cyan-900';
    if (main.includes('cloud')) 
      return 'from-gray-200 to-blue-100 dark:from-gray-700 dark:to-blue-900';
    if (main.includes('rain') || main.includes('drizzle')) 
      return 'from-blue-300 to-gray-200 dark:from-blue-800 dark:to-gray-700';
    if (main.includes('snow')) 
      return 'from-blue-50 to-gray-50 dark:from-blue-900 dark:to-gray-800';
    if (main.includes('thunderstorm')) 
      return 'from-purple-300 to-gray-400 dark:from-purple-800 dark:to-gray-700';
    if (main.includes('mist') || main.includes('fog') || main.includes('haze')) 
      return 'from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600';
      
    return 'from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950';
  };

  // Get appropriate weather icon based on the weather condition
  const getWeatherIcon = () => {
    if (!weather || !weather.main) return null;
    
    const main = weather.main.toLowerCase();
    
    return (
      <div className="relative w-12 h-12 mr-3">
        {main.includes('clear') && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-yellow-300 dark:bg-yellow-500 rounded-full animate-pulse-slow" />
          </div>
        )}
        {main.includes('cloud') && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-6 bg-gray-200 dark:bg-gray-300 rounded-full animate-float" />
          </div>
        )}
        {(main.includes('rain') || main.includes('drizzle')) && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="w-10 h-6 bg-gray-300 dark:bg-gray-400 rounded-full -mt-1" />
            <div className="absolute top-6 left-3 w-0.5 h-3 bg-blue-400 dark:bg-blue-300 animate-rain" />
            <div className="absolute top-5 left-6 w-0.5 h-3 bg-blue-400 dark:bg-blue-300 animate-rain" style={{ animationDelay: '0.2s' }} />
            <div className="absolute top-6 left-9 w-0.5 h-3 bg-blue-400 dark:bg-blue-300 animate-rain" style={{ animationDelay: '0.4s' }} />
          </div>
        )}
        {main.includes('snow') && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="w-10 h-6 bg-gray-200 dark:bg-gray-300 rounded-full -mt-1" />
            <div className="absolute top-5 left-4 w-1 h-1 bg-white rounded-full animate-snowfall" />
            <div className="absolute top-6 left-7 w-1 h-1 bg-white rounded-full animate-snowfall" style={{ animationDelay: '0.3s' }} />
            <div className="absolute top-5 left-10 w-1 h-1 bg-white rounded-full animate-snowfall" style={{ animationDelay: '0.6s' }} />
          </div>
        )}
        {main.includes('thunderstorm') && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="w-10 h-6 bg-gray-500 dark:bg-gray-600 rounded-full -mt-1" />
            <div className="absolute top-4 left-6 text-yellow-400 animate-flash">⚡</div>
          </div>
        )}
        {(main.includes('mist') || main.includes('fog') || main.includes('haze')) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-6 bg-gray-300 dark:bg-gray-400 rounded-full animate-pulse-slow blur-sm" />
          </div>
        )}
        <img src={weather.icon} alt={weather.description} className="w-full h-full object-contain z-10 relative" />
      </div>
    );
  };

  if (error) return (
    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-center">
      <p className="text-sm text-red-500 dark:text-red-300">{error}</p>
    </div>
  );
  
  if (loading) return (
    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
      <div className="flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-4 border-blue-400 dark:border-blue-600 border-t-transparent dark:border-t-transparent rounded-full mr-3"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Fetching weather data...</p>
      </div>
    </div>
  );

  return (
    <div className={`bg-gradient-to-r ${getWeatherGradient()} rounded-lg p-4 border border-blue-100 dark:border-blue-900 shadow-md transition-all duration-300`}>
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="flex items-center">
          {getWeatherIcon()}
          <div>
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">{Math.round(weather.temp)}°C</span>
            <p className="capitalize text-sm text-gray-600 dark:text-gray-400">{weather.description}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">{weather.city}, {weather.country}</p>
          </div>
        </div>
        
        <div className="mt-3 md:mt-0 md:ml-4 grid grid-cols-2 gap-x-6 gap-y-1">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium block">Humidity</span>
            <span>{weather.humidity}%</span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium block">Wind</span>
            <span>{weather.windSpeed} m/s</span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium block">Sunrise</span>
            <span>{weather.sunrise}</span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium block">Sunset</span>
            <span>{weather.sunset}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
