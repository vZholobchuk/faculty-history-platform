import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import StatCard from '../components/StatCard';
import FeatureBox from '../components/FeatureBox';

import { FEATURES_DATA } from '../data/mockData';
import { fetchStats } from '../services/api';

const HomePage = () => {
    const [stats, setStats] = useState([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [statsError, setStatsError] = useState(null);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchStats();
                setStats(data);
                setIsLoadingStats(false);
            } catch (err) {
                setStatsError(err);
                setIsLoadingStats(false);
            }
        };

        loadStats();
    }, []);

    return (
        <>
            <HeroSection />

            <section className="container mb-5">
                {isLoadingStats ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : statsError ? (
                    <div className="alert alert-danger text-center" role="alert">
                        Failed to load statistics: {statsError.message}
                    </div>
                ) : (
                    <div className="row g-4">
                        {stats.map((stat, index) => (
                            <StatCard
                                key={index}
                                icon={stat.icon}
                                count={stat.count}
                                label={stat.label}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className="about-section">
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <h2 className="section-title">Про платформу</h2>
                            <p className="lead">Ця інтерактивна платформа створена для збереження та популяризації цифрової спадщини нашого факультету.</p>
                            <p>Тут ви знайдете унікальні архівні документи, фотографії видатних викладачів та опис ключових подій, що сформували наш підрозділ протягом десятиліть. Ми прагнемо поєднати академічні традиції з сучасними технологіями.</p>
                            <div className="mt-4 d-flex gap-4">
                                <div>
                                    <h5 className="fw-bold text-primary">Місія</h5>
                                    <p className="small">Збереження пам'яті для майбутніх поколінь студентів.</p>
                                </div>
                                <div>
                                    <h5 className="fw-bold text-primary">Технології</h5>
                                    <p className="small">Інтерактивні карти, цифрові архіви та медіа-бібліотека.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <FeatureBox features={FEATURES_DATA} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
