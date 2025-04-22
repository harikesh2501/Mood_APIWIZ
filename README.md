# Mood Journal

A modern, interactive web application for tracking your daily emotions and moods in harmony with the weather. Built with React and Vite.

## Features

- **Daily Mood Tracking**: Log your emotions with a simple mood selector
- **Weather Integration**: App detects and displays current weather, adapting the UI theme to match
- **Calendar View**: Visualize your mood entries on a monthly calendar
- **Mood Trends**: Interactive charts showing your mood patterns over time (daily, weekly, monthly)
- **Dark/Light Mode**: Toggle between themes for comfortable use day or night
- **Data Export**: Export your mood journal entries as PDF
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: All entries are stored locally in your browser (no server required)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/mood-journal.git
   cd mood-journal
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. **Weather API Setup (Important)**:
   - Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
   - Create a `.env` file in the root directory with this content:
     ```
     VITE_OPENWEATHER_API_KEY=your_api_key_here
     ```
   - Note: The app includes a default API key for demo purposes, but it's recommended to use your own for production

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```
   (Note: The port may vary if 5173 is already in use)

## Required Packages

This project uses the following dependencies:

- **React**: UI library
- **Vite**: Fast development environment and build tool
- **TailwindCSS**: Utility-first CSS framework for styling
- **Chart.js & react-chartjs-2**: For mood trend visualizations
- **jsPDF**: For exporting journal entries as PDF
- **Axios**: For weather API integration

All dependencies are listed in `package.json` and will be installed with `npm install`.

## Usage

1. **Add a Mood Entry**:
   - Select your current mood using the emoji buttons
   - Add optional notes about your day
   - Your mood will be saved with the current date and weather

2. **View Past Entries**:
   - Use the calendar to browse through your mood history
   - Click on dates with entries to view details

3. **Analyze Trends**:
   - The Mood Trends section shows patterns in your emotional state
   - Toggle between weekly, monthly, and all-time views

4. **Export Data**:
   - Use the export button to download your journal as a PDF

5. **Location Permissions**:
   - The weather feature requires access to your location
   - When prompted, allow the browser to access your location for weather data
   - If denied, the app will still function but without weather integration

## Browser Storage Usage

This application uses localStorage to store your mood journal entries. This means that your data is stored in your browser and will persist across sessions and device restarts. However, please note that localStorage has a limited capacity (usually around 5MB per origin) and is not suitable for storing large amounts of data.

For security reasons, localStorage data is isolated to the origin (domain and protocol) of the web application. This means that data stored by one application cannot be accessed by another application, even if they are on the same domain.

If you clear your browser's cache or use private browsing mode, your localStorage data will be lost. To back up your data, you can export your mood journal entries as a PDF using the Data Export feature.

## Development

- Run `npm run dev` for development with hot module replacement
- Run `npm run build` to create a production build
- Run `npm run preview` to preview the production build locally

## License

This project is licensed under the MIT License - see the LICENSE file for details.# Mood_APIWIZ
