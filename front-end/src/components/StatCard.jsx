import React from 'react';

const StatCard = ({ icon, count, label }) => {
    return (
        <div className="col-md-4">
            <div className="stat-card text-center">
                <i className={`bi ${icon} stat-icon`}></i>
                <h3 className="fw-bold">{count}</h3>
                <p className="text-muted mb-0">{label}</p>
            </div>
        </div>
    );
};

export default StatCard;
