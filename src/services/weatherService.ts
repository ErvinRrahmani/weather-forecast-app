import type { WeatherResponse, WeatherData } from '../types/weather';
import { API_CONFIG, API_ENDPOINTS } from '../constants/api';
import { transformWeatherData, mapApiErrorToMessage } from '../utils/weatherUtils';

/**
 * Service for handling weather API requests
 */
export class WeatherService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL, apiKey: string = API_CONFIG.API_KEY) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Fetches current weather data for a given city
   * @param cityName - Name of the city to fetch weather for
   * @returns Promise with weather data
   */
  async getCurrentWeather(cityName: string): Promise<WeatherData> {
    try {
      const url = this.buildWeatherUrl(cityName);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw await this.handleApiError(response);
      }

      const data: WeatherResponse = await response.json();
      return transformWeatherData(data);
    } catch (error) {
      throw new Error(mapApiErrorToMessage(error));
    }
  }

  /**
   * Builds the complete URL for weather API request
   * @param cityName - Name of the city
   * @returns Complete API URL
   */
  private buildWeatherUrl(cityName: string): string {
    const params = new URLSearchParams({
      q: cityName,
      appid: this.apiKey,
      units: API_CONFIG.DEFAULT_UNITS,
    });

    return `${this.baseUrl}${API_ENDPOINTS.CURRENT_WEATHER}?${params.toString()}`;
  }

  /**
   * Handles API error responses
   * @param response - Failed fetch response
   * @returns Error object with appropriate message
   */
  private async handleApiError(response: Response): Promise<Error> {
    let errorMessage = 'Unknown error occurred';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If JSON parsing fails, use status text
      errorMessage = response.statusText || errorMessage;
    }

    const error = new Error(errorMessage) as any;
    error.response = { status: response.status };
    return error;
  }
}

// Export singleton instance for convenience
export const weatherService = new WeatherService();

// Export factory function for testing/dependency injection
export const createWeatherService = (baseUrl?: string, apiKey?: string): WeatherService => {
  return new WeatherService(baseUrl, apiKey);
}; 