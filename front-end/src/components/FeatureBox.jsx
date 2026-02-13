import React from 'react';

const FeatureBox = ({ features }) => {
    return (
        <div className="feature-box shadow-sm">
            <h4 className="fw-bold mb-4"><i className="bi bi-info-circle me-2 text-primary"></i> Що доступно на сайті:</h4>
            <ul className="list-unstyled">
                {features.map((feature, index) => (
                    <li className="mb-3 d-flex align-items-center" key={index}>
                        <i className="bi bi-check2-circle text-success me-3 fs-5"></i>
                        {feature}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FeatureBox;
