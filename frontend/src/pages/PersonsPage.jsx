import React, { useState, useEffect } from 'react';
import { fetchPersons } from '../services/api';

const PersonsPage = () => {
    const [persons, setPersons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPersons = async () => {
            try {
                const data = await fetchPersons();
                setPersons(data);
            } catch (err) {
                setError('Не вдалося завантажити інформацію про особистостей. Спробуйте пізніше.');
                console.error('Persons load error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadPersons();
    }, []);

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Завантаження...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center m-5" role="alert">
                {error}
            </div>
        );
    }

    return (
        <div className="container my-5">
            <header className="text-center mb-5">
                <h1 className="display-5 fw-bold text-dark">Видатні особистості факультету</h1>
                <p className="text-muted">Люди, які творили історію нашого університету протягом десятиліть</p>
            </header>

            <div className="row g-4">
                {persons.map((person) => (
                    <div key={person.id} className="col-lg-4 col-md-6">
                        <div className="card person-card h-100 shadow-sm">
                            <span
                                className="category-badge"
                                style={{
                                    color: person.categoryColor.startsWith('#') ? person.categoryColor : undefined,
                                    backgroundColor: person.categoryBg || undefined
                                }}
                            >
                                {person.category}
                            </span>
                            {/* If color is a bootstrap class like 'primary', we might need to handle it differently, 
                                but in the mock data 'primary' is used for badgeColor which usually implies specific class.
                                However, looking at original code: <span className="category-badge"> (default blue) and others with style.
                                Let's stick to inline style if provided, or default class.
                                Actually mockData has categoryColor: 'primary' for ID 1.
                                And hex codes for others.
                                The original code used CSS class for default (primary color likely).
                            */}

                            <div className="profile-img-container">
                                <img src={person.image} className="profile-img" alt={person.name} />
                            </div>

                            <div className="card-body text-center">
                                <h4 className="card-title fw-bold">{person.name}</h4>
                                <p className={`small mb-3 ${person.jobTitleColor || 'text-primary'}`}>{person.role}</p>

                                <p className="biography-text">
                                    {person.bio}
                                </p>

                                <div className="text-start bg-light p-3 rounded-3 mb-4">
                                    {person.details.map((detail, index) => (
                                        <div key={index} className={`small ${index === 0 ? 'mb-1' : ''}`}>
                                            {detail.icon} <strong>{detail.label}:</strong> {detail.value}
                                        </div>
                                    ))}
                                </div>

                                <a href="#" className={`btn w-100 py-2 fw-semibold ${person.btnClass || 'btn-primary'}`}>
                                    {person.btnText}
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PersonsPage;
