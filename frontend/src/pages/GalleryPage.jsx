import React, { useState } from 'react';

const GalleryPage = () => {
    const [activeTab, setActiveTab] = useState('photos');

    return (
        <>
            <header className="gallery-header text-center">
                <div className="container">
                    <h1 className="display-4 fw-bold">Медіа-архів факультету</h1>
                    <p className="lead opacity-75">Фото та відео звіти з життя університету крізь об'єктив камери</p>
                </div>
            </header>

            <div className="container mb-5">
                <ul className="nav nav-pills justify-content-center mb-5" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === 'photos' ? 'active' : ''}`}
                            onClick={() => setActiveTab('photos')}
                            type="button"
                        >
                            Фотоальбоми
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === 'videos' ? 'active' : ''}`}
                            onClick={() => setActiveTab('videos')}
                            type="button"
                        >
                            Відео подій
                        </button>
                    </li>
                </ul>

                <div className="tab-content">
                    {activeTab === 'photos' && (
                        <div className="tab-pane fade show active" role="tabpanel">
                            <div className="row g-4">
                                <div className="col-lg-4 col-md-6">
                                    <div className="card album-card shadow-sm">
                                        <div className="album-img-wrapper">
                                            <img src="https://pnu.edu.ua/wp-content/uploads/2023/05/DSC0987.jpg" alt="Конференція 2023" />
                                            <span className="photo-count"><i className="bi bi-camera me-1"></i> 15 фото</span>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="fw-bold mb-1">Наукова конференція 2023</h5>
                                            <p className="small text-muted mb-3">Зустріч молодих вчених факультету</p>
                                            <button className="btn btn-outline-primary w-100 rounded-pill">Дивитись слайд-шоу</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="card album-card shadow-sm">
                                        <div className="album-img-wrapper">
                                            <img src="https://via.placeholder.com/400x300?text=Graduation+2020" alt="Випуск 2020" />
                                            <span className="photo-count"><i className="bi bi-camera me-1"></i> 42 фото</span>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="fw-bold mb-1">Випуск магістрів 2020</h5>
                                            <p className="small text-muted mb-3">Урочиста церемонія в головному корпусі</p>
                                            <button className="btn btn-outline-primary w-100 rounded-pill">Дивитись слайд-шоу</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="card album-card shadow-sm">
                                        <div className="album-img-wrapper">
                                            <img src="https://pnu.edu.ua/wp-content/uploads/2019/02/DSC04250.jpg" alt="Архів 1980" />
                                            <span className="photo-count"><i className="bi bi-camera me-1"></i> 8 фото</span>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="fw-bold mb-1">Архів: Навчання у 80-х</h5>
                                            <p className="small text-muted mb-3">Перші комп'ютерні класи факультету</p>
                                            <button className="btn btn-outline-primary w-100 rounded-pill">Дивитись слайд-шоу</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'videos' && (
                        <div className="tab-pane fade show active" role="tabpanel">
                            <div className="row g-4">
                                <div className="col-lg-6">
                                    <div className="video-box h-100">
                                        <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm">
                                            <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Університет ПНУ" allowFullScreen></iframe>
                                        </div>
                                        <div className="p-3">
                                            <h5 className="fw-bold">Гімн та історія Університету</h5>
                                            <p className="small text-muted">Офіційне представлення ПНУ імені Василя Стефаника.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="video-box h-100">
                                        <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm">
                                            <iframe src="https://www.youtube.com/embed/L_jWHffIx5E" title="IT Life" allowFullScreen></iframe>
                                        </div>
                                        <div className="p-3">
                                            <h5 className="fw-bold">Студентське життя в IT-хабі</h5>
                                            <p className="small text-muted">Як проходять будні майбутніх програмістів на нашому факультеті.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default GalleryPage;
