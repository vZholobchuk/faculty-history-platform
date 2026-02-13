import { STATS_DATA, HISTORY_DATA, NEWS_DATA, GALLERY_DATA, PERSONS_DATA, ARCHIVE_DATA } from '../data/mockData';

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

    fetchHistory: async (category = 'Всі категорії', search = '') => {
        let data = [...HISTORY_DATA];

        if (category && category !== 'Всі категорії') {
            data = data.filter(item => item.category === category);
        }

        if (search) {
            const lowerSearch = search.toLowerCase();
            data = data.filter(item =>
                String(item.year).includes(lowerSearch) ||
                item.title.toLowerCase().includes(lowerSearch) ||
                item.description.toLowerCase().includes(lowerSearch)
            );
        }

        return simulateApiCall(data);
    },

    createEvent: async (eventData) => {
        console.table(eventData);
        // Log File object details if present
        if (eventData.imageFile) {
            console.log("File detected:", eventData.imageFile.name, eventData.imageFile.size, eventData.imageFile.type);
        }
        return new Promise(resolve => setTimeout(() => resolve({ success: true, id: Date.now() }), 1500));
    },

    uploadMedia: async (mediaData) => {
        console.table(mediaData);
        if (mediaData.file) {
            console.log("File detected:", mediaData.file.name, mediaData.file.size, mediaData.file.type);
        }
        if (mediaData.videoUrl) {
            console.log("Video URL detected:", mediaData.videoUrl);
        }
        return new Promise(resolve => setTimeout(() => resolve({ success: true, id: Date.now() }), 1500));
    },

    addArchiveDocument: async (docData) => {
        console.table(docData);
        if (docData.file) {
            console.log("File detected:", docData.file.name, docData.file.size, docData.file.type);
        }
        return new Promise(resolve => setTimeout(() => resolve({ success: true, id: Date.now() }), 1500));
    },

    deleteHistoryEvent: async (id) => {
        console.log("Mock Delete Event:", id);
        return simulateApiCall({ success: true, id });
    },

    fetchNews: async () => {
        /*
        const response = await fetch(`${API_BASE_URL}/api/news`);
        return await response.json();
        */
        return simulateApiCall(NEWS_DATA);
    },

    fetchGallery: async (mediaType = 'all') => {
        let data = [...GALLERY_DATA];

        if (mediaType === 'photos') {
            data = data.filter(item => item.type === 'photo');
        } else if (mediaType === 'videos') {
            data = data.filter(item => item.type === 'video');
        }

        return simulateApiCall(data);
    },

    fetchPersons: async () => {
        return simulateApiCall(PERSONS_DATA);
    },

    fetchArchive: async (searchQuery = '', category = 'Всі категорії') => {
        let data = [...ARCHIVE_DATA];

        if (category && category !== 'Всі категорії') {
            // Note: The mock data has categories like 'Офіційне', 'Наука', 'Студенти'. 
            // The dropdown might send 'Офіційні накази', 'Наукові звіти' etc.
            // We need to map or be consistent.
            // Let's assume strict matching for now, OR partial matching for flexibility in this mock.
            // Or better, let's fix the dropdown options in the Page to match data categories, 
            // OR map common prefixes.
            // For robustness in this simulation:
            data = data.filter(item => category.includes(item.category) || item.category.includes(category));
        }

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            data = data.filter(item =>
                item.title.toLowerCase().includes(lowerQuery) ||
                item.subtitle.toLowerCase().includes(lowerQuery) ||
                String(item.year).includes(lowerQuery)
            );
        }

        return simulateApiCall(data);
    },

    fetchDashboardStats: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/stats`);
            if (!response.ok) throw new Error('Failed to fetch stats');
            return await response.json();
        } catch (error) {
            console.warn("API Error (Stats), falling back to mock data:", error);

            // Fallback for demo purposes if backend is offline
            const eventsCount = HISTORY_DATA.length;
            const documentsCount = ARCHIVE_DATA.length;
            const usersCount = PERSONS_DATA.length;

            // Calculate total media files
            const mediaTotal = GALLERY_DATA.reduce((total, item) => {
                if (item.type === 'photo') {
                    return total + (item.count || 0);
                }
                return total + 1;
            }, 0);

            return simulateApiCall({
                eventsCount,
                documentsCount,
                mediaSize: mediaTotal,
                usersCount
            });
        }
    }
};

export const fetchStats = api.fetchStats;
export const fetchHistory = api.fetchHistory;
export const fetchNews = api.fetchNews;
export const fetchGallery = api.fetchGallery;
export const fetchPersons = api.fetchPersons;
export const fetchArchive = api.fetchArchive;
export const fetchDashboardStats = api.fetchDashboardStats;
export const createEvent = api.createEvent;
export const uploadMedia = api.uploadMedia;
export const addArchiveDocument = api.addArchiveDocument;
export const deleteHistoryEvent = api.deleteHistoryEvent;