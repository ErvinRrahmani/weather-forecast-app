import type { WeatherResponse, WeatherData } from '../types/weather';
import { ERROR_MESSAGES } from '../constants/api';

/**
 * Transforms raw weather API response to simplified weather data
 * Following Single Responsibility Principle - only handles data transformation
 */
export const transformWeatherData = (response: WeatherResponse): WeatherData => {
  const weather = response.weather[0];
  
  return {
    id: `${response.id}-${Date.now()}`,
    cityName: response.name,
    country: response.sys.country,
    temperature: Math.round(response.main.temp),
    description: weather.description,
    minTemp: Math.round(response.main.temp_min),
    maxTemp: Math.round(response.main.temp_max),
    windSpeed: response.wind.speed,
    humidity: response.main.humidity,
    icon: weather.icon,
    timestamp: Date.now(),
  };
};

/**
 * Formats temperature with unit
 */
export const formatTemperature = (temp: number, unit: string = '°C'): string => {
  return `${temp}${unit}`;
};

/**
 * Formats wind speed with unit
 */
export const formatWindSpeed = (speed: number, unit: string = 'm/s'): string => {
  return `${speed} ${unit}`;
};

/**
 * Capitalizes first letter of each word
 */
export const capitalizeWords = (text: string): string => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Formats date/time for display
 */
export const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

/**
 * Generates weather icon URL
 */
export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

/**
 * Maps API error codes to user-friendly messages
 * Following Open/Closed Principle - easy to extend with new error codes
 */
export const mapApiErrorToMessage = (error: any): string => {
  if (error.response?.status) {
    switch (error.response.status) {
      case 404:
        return ERROR_MESSAGES.CITY_NOT_FOUND;
      case 401:
        return ERROR_MESSAGES.API_KEY_INVALID;
      case 429:
        return ERROR_MESSAGES.RATE_LIMIT_EXCEEDED;
      default:
        return ERROR_MESSAGES.GENERIC_ERROR;
    }
  }
  
  if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  return error.message || ERROR_MESSAGES.GENERIC_ERROR;
};

/**
 * Validates city name input
 */
export const validateCityName = (cityName: string): { isValid: boolean; error?: string } => {
  const trimmed = cityName.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'City name is required' };
  }
  
  if (trimmed.length < 2) {
    return { isValid: false, error: 'City name must be at least 2 characters long' };
  }
  
  if (trimmed.length > 50) {
    return { isValid: false, error: 'City name must be less than 50 characters' };
  }
  
  // Basic validation for special characters (including unicode letters)
  const validPattern = /^[\p{L}\s\-'\.]+$/u;
  if (!validPattern.test(trimmed)) {
    return { isValid: false, error: 'City name contains invalid characters' };
  }
  
  return { isValid: true };
}; 