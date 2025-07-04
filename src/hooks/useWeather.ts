import { useState, useCallback } from 'react';
import type { WeatherData, WeatherState } from '../types/weather';
import { weatherService } from '../services/weatherService';
import { validateCityName } from '../utils/weatherUtils';

/**
 * Custom hook for managing weather data and loading states
 */
export const useWeather = () => {
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: false,
    error: null,
  });

  /**
   * Fetches weather data for a given city
   * @param cityName - Name of the city to fetch weather for
   * @returns Promise that resolves to weather data or throws error
   */
  const fetchWeather = useCallback(async (cityName: string): Promise<WeatherData> => {
    // Validate input
    const validation = validateCityName(cityName);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const weatherData = await weatherService.getCurrentWeather(cityName.trim());
      
      setState({
        data: weatherData,
        loading: false,
        error: null,
      });

      return weatherData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });

      throw error;
    }
  }, []);

  /**
   * Clears current weather data and error state
   */
  const clearWeather = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  /**
   * Clears only the error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Refetches weather data for the current city
   */
  const refetchWeather = useCallback(async () => {
    if (state.data?.cityName) {
      await fetchWeather(state.data.cityName);
    }
  }, [state.data?.cityName, fetchWeather]);

  return {
    ...state,
    fetchWeather,
    clearWeather,
    clearError,
    refetchWeather,
  };
}; 