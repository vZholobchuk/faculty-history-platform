
import { STATS_DATA, HISTORY_DATA, NEWS_DATA } from '../data/mockData';

// Simulated network delay
const DELAY_MS = 800;

// Helper to simulate async API call
const simulateApiCall = (data, delay = DELAY_MS) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random error (optional, currently disabled)
            // if (Math.random() < 0.1) reject(new Error('Simulated network error'));
            resolve(data);
        }, delay);
    });
};

/**
 * Service Layer for API Communication
 * Currently using mock data, but structured to be easily replaced with real API calls.
 */
export const api = {
    /**
     * Fetch statistics for the home page.
     * @returns {Promise<Array>}
     */
    fetchStats: async () => {
        // Future Real Implementation:
        // const response = await fetch('/api/stats');
        // if (!response.ok) throw new Error('Failed to fetch stats');
        // return response.json();

        return simulateApiCall(STATS_DATA);
    },

    /**
     * Fetch history timeline events.
     * @returns {Promise<Array>}
     */
    fetchHistory: async () => {
        // Future Real Implementation:
        // const response = await fetch('/api/history');
        // return response.json();

        return simulateApiCall(HISTORY_DATA);
    },

    /**
     * Fetch latest news.
     * @returns {Promise<Array>}
     */
    fetchNews: async () => {
        return simulateApiCall(NEWS_DATA);
    }
};

// Export individual functions for convenience as well
export const fetchStats = api.fetchStats;
export const fetchHistory = api.fetchHistory;
export const fetchNews = api.fetchNews;
