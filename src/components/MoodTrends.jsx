import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Map mood values to numerical values for trend visualization
const moodValues = {
  'very-happy': 5,
  'happy': 4,
  'neutral': 3,
  'sad': 2,
  'angry': 1
};

// Map mood values to colors for visualization
const moodColors = {
  'very-happy': '#4ade80', // green-400
  'happy': '#34d399', // emerald-400
  'neutral': '#60a5fa', // blue-400
  'sad': '#c084fc', // purple-400
  'angry': '#f87171'  // red-400
};

// Map mood values to labels
const moodLabels = {
  'very-happy': 'Very Happy',
  'happy': 'Happy',
  'neutral': 'Neutral',
  'sad': 'Sad',
  'angry': 'Angry'
};

/**
 * MoodTrends Component
 * Visualizes mood trends over time using Chart.js
 */
export default function MoodTrends() {
  const [entries, setEntries] = useState([]);
  const [timeframe, setTimeframe] = useState('week'); // 'week', 'month', 'all'
  const [chartData, setChartData] = useState(null);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const chartRef = useRef(null);
  
  useEffect(() => {
    // Load entries from localStorage
    const saved = localStorage.getItem('moodEntries');
    if (saved) {
      const parsedEntries = JSON.parse(saved);
      setEntries(parsedEntries);
    }
  }, []);
  
  useEffect(() => {
    if (entries.length === 0) return;
    
    // Sort entries by date
    const sortedEntries = [...entries].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    
    // Filter entries based on selected timeframe
    const now = new Date();
    const filtered = sortedEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      if (timeframe === 'week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return entryDate >= oneWeekAgo;
      } else if (timeframe === 'month') {
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return entryDate >= oneMonthAgo;
      }
      return true; // 'all' timeframe
    });
    
    // Store filtered entries for tooltip access
    setFilteredEntries(filtered);
    
    // Prepare data for Chart.js
    const labels = filtered.map(entry => entry.date);
    const data = filtered.map(entry => moodValues[entry.mood] || 3);
    const backgroundColor = filtered.map(entry => moodColors[entry.mood] || '#60a5fa');
    
    setChartData({
      labels,
      datasets: [
        {
          label: 'Mood Level',
          data,
          backgroundColor,
          borderColor: backgroundColor,
          borderWidth: 1,
          borderRadius: 6,
          barThickness: 25,
          maxBarThickness: 35,
          minBarLength: 5,
        }
      ]
    });
  }, [entries, timeframe]);
  
  // If no entries, don't show the component
  if (entries.length === 0) return null;
  
  // Chart.js options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const index = context.dataIndex;
            if (index >= 0 && index < filteredEntries.length) {
              const mood = filteredEntries[index]?.mood || 'neutral';
              return moodLabels[mood] || 'Unknown';
            }
            return '';
          },
          title: function(context) {
            const index = context[0].dataIndex;
            if (index >= 0 && index < filteredEntries.length) {
              return filteredEntries[index]?.date || '';
            }
            return '';
          },
          afterLabel: function(context) {
            const index = context.dataIndex;
            if (index >= 0 && index < filteredEntries.length && filteredEntries[index]?.note) {
              return `Note: ${filteredEntries[index].note.substring(0, 30)}${filteredEntries[index].note.length > 30 ? '...' : ''}`;
            }
            return '';
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          callback: function(value) {
            const labels = ['', 'Angry', 'Sad', 'Neutral', 'Happy', 'Very Happy'];
            return labels[value] || '';
          },
          color: function(context) {
            return document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#4b5563';
          },
          font: {
            size: 12
          }
        },
        grid: {
          color: function(context) {
            return document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
          }
        }
      },
      x: {
        ticks: {
          color: function(context) {
            return document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#4b5563';
          },
          font: {
            size: 10
          },
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          display: false
        }
      }
    }
  };
  
  return (
    <div className="glass-effect rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 text-white">
        <h2 className="text-2xl font-bold">Your Mood Trends</h2>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-200">
            Visualizing your mood over time
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1 text-sm rounded-lg ${
                timeframe === 'week' 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}
            >
              Week
            </button>
            <button 
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1 text-sm rounded-lg ${
                timeframe === 'month' 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}
            >
              Month
            </button>
            <button 
              onClick={() => setTimeframe('all')}
              className={`px-3 py-1 text-sm rounded-lg ${
                timeframe === 'all' 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}
            >
              All Time
            </button>
          </div>
        </div>
        
        {chartData && filteredEntries.length > 0 ? (
          <div className="h-64 mt-6">
            <Bar 
              ref={chartRef}
              data={chartData} 
              options={options} 
            />
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-200">
            No data available for the selected timeframe
          </div>
        )}
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-center gap-4">
          {Object.entries(moodColors).map(([mood, color]) => (
            <div key={mood} className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: color }}></div>
              <span className="text-xs text-gray-600 dark:text-gray-200 capitalize">{mood.replace('-', ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 