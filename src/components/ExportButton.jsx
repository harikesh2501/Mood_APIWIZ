import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

/**
 * ExportButton Component
 * Allows users to export their journal entries in CSV or PDF format
 */
export default function ExportButton() {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Export entries as CSV
  const exportAsCSV = () => {
    try {
      const entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
      
      if (entries.length === 0) {
        alert('No entries to export');
        return;
      }
      
      // Create CSV header
      let csvContent = 'Date,Mood,Note,Temperature,Weather\n';
      
      // Add each entry as a row
      entries.forEach(entry => {
        const date = entry.date;
        const mood = entry.mood;
        const note = entry.note ? `"${entry.note.replace(/"/g, '""')}"` : ''; // Handle quotes in text
        const temp = entry.weather ? Math.round(entry.weather.temp) : '';
        const weather = entry.weather ? entry.weather.description : '';
        
        csvContent += `${date},${mood},${note},${temp},${weather}\n`;
      });
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `mood-journal-export-${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed');
    }
  };

  // Export entries as PDF
  const exportAsPDF = () => {
    try {
      const entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
      
      if (entries.length === 0) {
        alert('No entries to export');
        return;
      }
      
      // Create new PDF document (A4 format)
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Add title
      doc.setFontSize(22);
      doc.setTextColor(63, 81, 181); // Indigo color
      doc.text('Mood Journal', pageWidth / 2, 20, { align: 'center' });
      
      // Add export date
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Exported on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
      
      // Add content
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      
      // Sort entries by date (recent first)
      const sortedEntries = [...entries].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      
      // Calculate positions
      let yPosition = 50;
      const lineHeight = 10;
      
      // Process each entry
      sortedEntries.forEach((entry, index) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Add entry header with date and mood
        const moodEmoji = getMoodEmoji(entry.mood);
        doc.setFontSize(16);
        doc.setTextColor(63, 81, 181);
        doc.text(`Entry: ${entry.date} - Mood: ${formatMood(entry.mood)} ${moodEmoji}`, 20, yPosition);
        yPosition += lineHeight * 1.5;
        
        // Add weather if available
        if (entry.weather) {
          doc.setFontSize(12);
          doc.setTextColor(100, 100, 100);
          doc.text(`Weather: ${entry.weather.description}, ${Math.round(entry.weather.temp)}°C`, 20, yPosition);
          yPosition += lineHeight;
        }
        
        // Add note
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        
        // Split long text into multiple lines to fit on the page
        const maxWidth = pageWidth - 40; // 20pt margins on each side
        const textLines = doc.splitTextToSize(entry.note, maxWidth);
        
        doc.text(textLines, 20, yPosition);
        yPosition += (textLines.length * lineHeight) + 10;
        
        // Add separator between entries (except for the last one)
        if (index < sortedEntries.length - 1) {
          doc.setDrawColor(200, 200, 200);
          doc.line(20, yPosition - 5, pageWidth - 20, yPosition - 5);
          yPosition += lineHeight;
        }
      });
      
      // Save the PDF
      doc.save(`mood-journal-export-${new Date().toISOString().slice(0, 10)}.pdf`);
      setIsOpen(false);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export failed');
    }
  };
  
  // Helper to get emoji for mood
  const getMoodEmoji = (mood) => {
    const emojis = {
      'very-happy': '😄',
      'happy': '🙂',
      'neutral': '😐',
      'sad': '😞',
      'angry': '😡'
    };
    return emojis[mood] || '';
  };
  
  // Helper to format mood strings for display
  const formatMood = (mood) => {
    return mood.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={toggleDropdown}
        className="p-3 rounded-full bg-indigo-100 dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 text-indigo-700 dark:text-indigo-300"
        aria-label="Export entries"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute bottom-16 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2 w-40">
          <button 
            onClick={exportAsCSV}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded"
          >
            Export as CSV
          </button>
          <button 
            onClick={exportAsPDF}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded"
          >
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
} 