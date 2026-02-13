import { STATS_DATA, HISTORY_DATA, NEWS_DATA } from '../data/mockData';

// 1. Магія: Цей рядок сам визначить, куди стукати
// Якщо ми на хостингу — візьме адресу з налаштувань.
// Якщо на локалці — візьме 'http://localhost:8000'.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const DELAY_MS = 800;

const simulateApiCall = (data, delay = DELAY_MS) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, delay);
    });
};

export const api = {
    fetchStats: async () => {
        // Коли бекенд буде готовий, ти розкоментуєш ці 3 рядки:
        /*
        try {
            const response = await fetch(`${API_BASE_URL}/api/stats`);
            if (!response.ok) throw new Error('Failed to fetch stats');
            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            // Якщо сервер впав — повернемо старі дані, щоб сайт не був пустим!
            return STATS_DATA; 
        }
        */
       
        // А поки що працює це:
        console.log(`📡 Fetching stats from mock (simulation)...`);
        return simulateApiCall(STATS_DATA);
    },

    fetchHistory: async () => {
        /*
        const response = await fetch(`${API_BASE_URL}/api/history`);
        return await response.json();
        */
        return simulateApiCall(HISTORY_DATA);
    },

    fetchNews: async () => {
        /*
        const response = await fetch(`${API_BASE_URL}/api/news`);
        return await response.json();
        */
        return simulateApiCall(NEWS_DATA);
    }
};

export const fetchStats = api.fetchStats;
export const fetchHistory = api.fetchHistory;
export const fetchNews = api.fetchNews;