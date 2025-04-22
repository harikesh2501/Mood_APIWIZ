// src/components/MoodSelector.jsx
import React from 'react';

// Predefined mood options with enhanced styling
const moods = [
  { 
    label: 'Very Happy', 
    icon: '😄', 
    value: 'very-happy', 
    color: 'bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700' 
  },
  { 
    label: 'Happy', 
    icon: '🙂', 
    value: 'happy', 
    color: 'bg-emerald-100 border-emerald-300 dark:bg-emerald-900 dark:border-emerald-700' 
  },
  { 
    label: 'Neutral', 
    icon: '😐', 
    value: 'neutral', 
    color: 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700' 
  },
  { 
    label: 'Sad', 
    icon: '😞', 
    value: 'sad', 
    color: 'bg-purple-100 border-purple-300 dark:bg-purple-900 dark:border-purple-700' 
  },
  { 
    label: 'Angry', 
    icon: '😡', 
    value: 'angry', 
    color: 'bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-700' 
  },
];

export function MoodSelector({ selectedMood, onSelect }) {
  return (
    <div className="grid grid-cols-5 gap-2 my-2">
      {moods.map((mood) => {
        const isSelected = selectedMood === mood.value;
        return (
          <button
            key={mood.value}
            type="button"
            onClick={() => onSelect(mood.value)}
            className={`group flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${
              isSelected 
                ? `${mood.color} border-opacity-100 scale-105 shadow-md` 
                : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
            }`}
            aria-label={mood.label}
          >
            <span className="text-3xl mb-1 transform transition-transform duration-300 group-hover:scale-110">
              {mood.icon}
            </span>
            <span className={`text-xs font-medium ${isSelected ? 'opacity-100' : 'opacity-70'} dark:text-gray-200`}>
              {mood.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
