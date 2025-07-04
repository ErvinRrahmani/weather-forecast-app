// Weather API response types
export interface WeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

// Simplified weather data for display
export interface WeatherData {
  id: string;
  cityName: string;
  country: string;
  temperature: number;
  description: string;
  minTemp: number;
  maxTemp: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  timestamp: number;
}

// Search history item
export interface SearchHistoryItem {
  id: string;
  cityName: string;
  country: string;
  searchedAt: number;
  weatherData?: WeatherData;
}

// Application state types
export interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export interface SearchHistoryState {
  items: SearchHistoryItem[];
  recentlyRemoved: SearchHistoryItem | null;
}

// API error type
export interface ApiError {
  message: string;
  code?: string | number;
}

// Search form data
export interface SearchFormData {
  cityName: string;
} 