import { SearchForm } from './components/SearchForm';
import { WeatherDisplay } from './components/WeatherDisplay';
import { SearchHistory } from './components/SearchHistory';
import { useWeather } from './hooks/useWeather';
import { useSearchHistory } from './hooks/useSearchHistory';
import './App.css';

/**
 * Main application component that coordinates the weather app
 */
function App() {
  const { 
    data: weatherData, 
    loading: weatherLoading, 
    error: weatherError, 
    fetchWeather, 
    clearError 
  } = useWeather();
  
  const { 
    history, 
    recentlyRemoved, 
    addToHistory, 
    removeFromHistory, 
    undoRemove,
    clearHistory 
  } = useSearchHistory();

  const handleSearch = async (cityName: string) => {
    try {
      clearError();
      const data = await fetchWeather(cityName);
      if (data) {
        addToHistory(data.cityName, data.country);
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleHistoryClick = (cityName: string) => {
    handleSearch(cityName);
  };

  const handleRefresh = () => {
    if (weatherData) {
      handleSearch(weatherData.cityName);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="text-center pt-12 pb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Weather Forecast
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            Get real-time weather information for any city around the world
          </p>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 pb-12">
          {/* Search Form */}
          <SearchForm 
            onSearch={handleSearch} 
            loading={weatherLoading}
          />

          {/* Error Display */}
          {weatherError && (
            <div className="w-full max-w-lg mx-auto mb-8">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800">Weather Error</h3>
                    <p className="text-red-700 text-sm mt-1">{weatherError}</p>
                  </div>
                </div>
                <button
                  onClick={clearError}
                  className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl transition-colors duration-200 text-sm font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Weather Display */}
          {weatherData && (
            <div className="mb-8">
              <WeatherDisplay 
                weatherData={weatherData} 
                onRefresh={handleRefresh}
                loading={weatherLoading}
              />
            </div>
          )}

          {/* Search History */}
          <SearchHistory
            history={history}
            onSelectCity={handleHistoryClick}
            onRemoveItem={removeFromHistory}
            onUndoRemove={recentlyRemoved ? undoRemove : undefined}
            onClearAll={clearHistory}
            canUndo={!!recentlyRemoved}
            loading={weatherLoading}
          />
        </main>

        {/* Footer */}
        <footer className="text-center py-8 text-gray-500 text-sm">
          <p>Built with React, TypeScript, and Tailwind CSS</p>
          <p className="mt-1">Weather data provided by OpenWeatherMap</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
