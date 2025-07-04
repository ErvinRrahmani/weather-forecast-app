import { describe, it, expect } from 'vitest';
import {
  transformWeatherData,
  formatTemperature,
  formatWindSpeed,
  capitalizeWords,
  getWeatherIconUrl,
  validateCityName,
  mapApiErrorToMessage,
} from '../weatherUtils';
import type { WeatherResponse } from '../../types/weather';

describe('weatherUtils', () => {
  describe('transformWeatherData', () => {
    it('should transform API response to weather data correctly', () => {
      const mockResponse: WeatherResponse = {
        coord: { lon: -0.1257, lat: 51.5085 },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        base: 'stations',
        main: {
          temp: 15.5,
          feels_like: 14.2,
          temp_min: 12.3,
          temp_max: 18.7,
          pressure: 1013,
          humidity: 65,
        },
        visibility: 10000,
        wind: { speed: 3.5, deg: 230 },
        clouds: { all: 0 },
        dt: 1634567890,
        sys: { type: 2, id: 2019646, country: 'GB', sunrise: 1634534123, sunset: 1634571234 },
        timezone: 3600,
        id: 2643743,
        name: 'London',
        cod: 200,
      };

      const result = transformWeatherData(mockResponse);

      expect(result).toEqual({
        id: expect.stringContaining('2643743-'),
        cityName: 'London',
        country: 'GB',
        temperature: 16, // rounded from 15.5
        description: 'clear sky',
        minTemp: 12, // rounded from 12.3
        maxTemp: 19, // rounded from 18.7
        windSpeed: 3.5,
        humidity: 65,
        icon: '01d',
        timestamp: expect.any(Number),
      });
    });
  });

  describe('formatTemperature', () => {
    it('should format temperature with default unit', () => {
      expect(formatTemperature(25)).toBe('25°C');
    });

    it('should format temperature with custom unit', () => {
      expect(formatTemperature(77, '°F')).toBe('77°F');
    });

    it('should handle negative temperatures', () => {
      expect(formatTemperature(-5)).toBe('-5°C');
    });
  });

  describe('formatWindSpeed', () => {
    it('should format wind speed with default unit', () => {
      expect(formatWindSpeed(3.5)).toBe('3.5 m/s');
    });

    it('should format wind speed with custom unit', () => {
      expect(formatWindSpeed(7.8, 'mph')).toBe('7.8 mph');
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize first letter of each word', () => {
      expect(capitalizeWords('clear sky')).toBe('Clear Sky');
      expect(capitalizeWords('scattered clouds')).toBe('Scattered Clouds');
      expect(capitalizeWords('HEAVY RAIN')).toBe('Heavy Rain');
    });

    it('should handle single word', () => {
      expect(capitalizeWords('sunny')).toBe('Sunny');
    });

    it('should handle empty string', () => {
      expect(capitalizeWords('')).toBe('');
    });
  });

  describe('getWeatherIconUrl', () => {
    it('should generate correct icon URL', () => {
      expect(getWeatherIconUrl('01d')).toBe('https://openweathermap.org/img/wn/01d@2x.png');
      expect(getWeatherIconUrl('10n')).toBe('https://openweathermap.org/img/wn/10n@2x.png');
    });
  });

  describe('validateCityName', () => {
    it('should validate correct city names', () => {
      expect(validateCityName('London')).toEqual({ isValid: true });
      expect(validateCityName('New York')).toEqual({ isValid: true });
      expect(validateCityName("St. John's")).toEqual({ isValid: true });
      expect(validateCityName('São Paulo')).toEqual({ isValid: true });
    });

    it('should reject empty or whitespace-only names', () => {
      expect(validateCityName('')).toEqual({
        isValid: false,
        error: 'City name is required',
      });
      expect(validateCityName('   ')).toEqual({
        isValid: false,
        error: 'City name is required',
      });
    });

    it('should reject names that are too short', () => {
      expect(validateCityName('A')).toEqual({
        isValid: false,
        error: 'City name must be at least 2 characters long',
      });
    });

    it('should reject names that are too long', () => {
      const longName = 'A'.repeat(51);
      expect(validateCityName(longName)).toEqual({
        isValid: false,
        error: 'City name must be less than 50 characters',
      });
    });

    it('should reject names with invalid characters', () => {
      expect(validateCityName('City123')).toEqual({
        isValid: false,
        error: 'City name contains invalid characters',
      });
      expect(validateCityName('City@#$')).toEqual({
        isValid: false,
        error: 'City name contains invalid characters',
      });
    });
  });

  describe('mapApiErrorToMessage', () => {
    it('should map 404 error to city not found message', () => {
      const error = { response: { status: 404 } };
      expect(mapApiErrorToMessage(error)).toBe('City not found. Please check the spelling and try again.');
    });

    it('should map 401 error to invalid API key message', () => {
      const error = { response: { status: 401 } };
      expect(mapApiErrorToMessage(error)).toBe('Invalid API key. Please check your configuration.');
    });

    it('should map 429 error to rate limit message', () => {
      const error = { response: { status: 429 } };
      expect(mapApiErrorToMessage(error)).toBe('Too many requests. Please try again later.');
    });

    it('should map network error to network message', () => {
      const error = { code: 'NETWORK_ERROR' };
      expect(mapApiErrorToMessage(error)).toBe('Network error. Please check your connection and try again.');
    });

    it('should return custom error message when available', () => {
      const error = { message: 'Custom error message' };
      expect(mapApiErrorToMessage(error)).toBe('Custom error message');
    });

    it('should return generic error message for unknown errors', () => {
      const error = { response: { status: 500 } };
      expect(mapApiErrorToMessage(error)).toBe('Something went wrong. Please try again.');
    });
  });
}); 