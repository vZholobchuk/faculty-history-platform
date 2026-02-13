import React, { useState, useEffect } from 'react';
import { fetchHistory } from '../services/api';

const TimelinePage = () => {
    const [historyData, setHistoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Всі категорії');

    useEffect(() => {
        const loadHistory = async () => {
            setIsLoading(true);
            try {
                const data = await fetchHistory(selectedCategory, searchTerm);
                setHistoryData(data);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };
        // Debounce search could be added here, but for mock local data frequent updates are fine.
        const timer = setTimeout(() => {
            loadHistory();
        }, 300); // Small debounce to avoid too many "requests" while typing

        return () => clearTimeout(timer);
    }, [selectedCategory, searchTerm]);

    return (
        <>
            <header className="timeline-header text-center">
                <div className="container">
                    <h1 className="display-4 fw-bold">Інтерактивна хронологія</h1>
                    <p className="lead opacity-75">Шлях становлення факультету від заснування до сьогодення</p>
                </div>
            </header>

            <div className="container">
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8">
                        <div className="filter-section d-flex align-items-center gap-3">
                            <i className="bi bi-funnel text-primary fs-4"></i>
                            <input
                                type="text"
                                className="form-control border-0 bg-light rounded-pill"
                                placeholder="Пошук за роком або назвою..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                className="form-select border-0 bg-light rounded-pill"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option>Всі категорії</option>
                                <option>Освіта</option>
                                <option>Історія</option>
                                <option>Технології</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="timeline-wrapper">
                    <div className="timeline-line"></div>

                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger text-center" role="alert">
                            Failed to load timeline: {error.message}
                        </div>
                    ) : (
                        historyData.map((item, index) => (
                            <div key={item.id} className={`timeline-item ${index % 2 === 0 ? 'left-item' : 'right-item'} clearfix`}>
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <span className={`badge bg-${item.badgeColor || 'primary'} ${item.badgeColor === 'warning' ? 'text-dark' : ''} year-badge`}>{item.year}</span>
                                    <h4 className="fw-bold">{item.title}</h4>
                                    <p className="text-muted">{item.description}</p>

                                    {item.image && (
                                        <img src={item.image} className="img-fluid rounded-3 mt-3 shadow-sm" alt={item.year} />
                                    )}

                                    {item.category && (
                                        <div className={`small text-${item.badgeColor || 'primary'} fw-semibold`}>
                                            {item.icon && <i className={`bi ${item.icon} me-1`}></i>}
                                            {item.category}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default TimelinePage;
