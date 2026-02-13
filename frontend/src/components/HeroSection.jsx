import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <header className="hero-section text-center">
            <div className="container">
                <h1 className="display-3 fw-bold mb-3">Цифрова спадщина факультету</h1>
                <p className="lead mb-5 opacity-90">Від заснування до сучасності — зберігаємо кожну сторінку нашої спільної історії</p>
                <div className="d-flex justify-content-center gap-3">
                    <Link to="/timeline" className="btn btn-pnu">Відкрити хронологію</Link>
                    <Link to="/archive" className="btn btn-outline-light rounded-pill px-4">Переглянути архів</Link>
                </div>
            </div>
        </header>
    );
};

export default HeroSection;
