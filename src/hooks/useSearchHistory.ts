import { useState, useEffect, useCallback } from 'react';
import type { SearchHistoryItem } from '../types/weather';
import { STORAGE_KEYS } from '../constants/api';

/**
 * Custom hook for managing search history
 * Following Single Responsibility Principle - only handles search history logic
 * Following Interface Segregation Principle - provides only needed methods
 */
export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [recentlyRemoved, setRecentlyRemoved] = useState<SearchHistoryItem | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
        if (stored) {
          const parsedHistory = JSON.parse(stored);
          setHistory(Array.isArray(parsedHistory) ? parsedHistory : []);
        }
      } catch (error) {
        console.warn('Failed to load search history from localStorage:', error);
        setHistory([]);
      }
    };

    loadHistory();
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.warn('Failed to save search history to localStorage:', error);
    }
  }, [history]);

  /**
   * Adds a new search to history or updates existing one
   * @param cityName - Name of the searched city
   * @param country - Country code
   */
  const addToHistory = useCallback((cityName: string, country: string) => {
    setHistory(prev => {
      // Check if city already exists in history
      const existingIndex = prev.findIndex(
        item => item.cityName.toLowerCase() === cityName.toLowerCase() && 
                item.country === country
      );

      const newItem: SearchHistoryItem = {
        id: `${cityName}-${country}-${Date.now()}`,
        cityName,
        country,
        searchedAt: Date.now(),
      };

      if (existingIndex >= 0) {
        // Update existing item and move to top
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], searchedAt: Date.now() };
        return [updated[existingIndex], ...updated.filter((_, index) => index !== existingIndex)];
      } else {
        // Add new item to top, limit to 10 items
        return [newItem, ...prev.slice(0, 9)];
      }
    });
  }, []);

  /**
   * Removes an item from history
   * @param id - ID of the item to remove
   */
  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => {
      const itemToRemove = prev.find(item => item.id === id);
      if (itemToRemove) {
        setRecentlyRemoved(itemToRemove);
        // Clear recently removed after 5 seconds
        setTimeout(() => setRecentlyRemoved(null), 5000);
      }
      return prev.filter(item => item.id !== id);
    });
  }, []);

  /**
   * Restores the most recently removed item
   */
  const undoRemove = useCallback(() => {
    if (recentlyRemoved) {
      setHistory(prev => [recentlyRemoved, ...prev]);
      setRecentlyRemoved(null);
    }
  }, [recentlyRemoved]);

  /**
   * Clears all search history
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    setRecentlyRemoved(null);
  }, []);

  /**
   * Gets a specific history item by ID
   * @param id - ID of the item to find
   * @returns SearchHistoryItem or undefined
   */
  const getHistoryItem = useCallback((id: string): SearchHistoryItem | undefined => {
    return history.find(item => item.id === id);
  }, [history]);

  return {
    history,
    recentlyRemoved,
    addToHistory,
    removeFromHistory,
    undoRemove,
    clearHistory,
    getHistoryItem,
  };
}; 