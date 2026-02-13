import React, { useState, useEffect } from 'react';
import { fetchGallery } from '../services/api';

const GalleryPage = () => {
    const [activeTab, setActiveTab] = useState('photos');
    const [galleryData, setGalleryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGallery = async () => {
            setIsLoading(true);
            try {
                const data = await fetchGallery(activeTab);
                setGalleryData(data);
            } catch (err) {
                setError('Не вдалося завантажити галерею. Спробуйте пізніше.');
                console.error('Gallery load error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadGallery();
    }, [activeTab]);

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
                    <div className="tab-pane fade show active" role="tabpanel">
                        <div className="row g-4">
                            {galleryData.map((item) => (
                                <div key={item.id} className={item.type === 'video' ? "col-lg-6" : "col-lg-4 col-md-6"}>
                                    {item.type === 'photo' ? (
                                        <div className="card album-card shadow-sm h-100">
                                            <div className="album-img-wrapper position-relative">
                                                <img src={item.thumbnail} alt={item.title} className="card-img-top" style={{ height: '220px', objectFit: 'cover' }} />
                                                <span className="photo-count position-absolute bottom-0 end-0 bg-dark text-white px-2 py-1 m-2 rounded small opacity-75">
                                                    <i className="bi bi-camera me-1"></i> {item.count} фото
                                                </span>
                                            </div>
                                            <div className="card-body">
                                                <h5 className="fw-bold mb-1">{item.title}</h5>
                                                <p className="small text-muted mb-3">{item.description}</p>
                                                <button className="btn btn-outline-primary w-100 rounded-pill">Дивитись слайд-шоу</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="card video-card shadow-sm h-100 border-0">
                                            <div className="ratio ratio-16x9 rounded overflow-hidden position-relative group-hover-overlay">
                                                {item.videoUrl.includes('youtube') || item.videoUrl.includes('embed') ? (
                                                    <iframe src={item.videoUrl} title={item.title} allowFullScreen className="border-0"></iframe>
                                                ) : (
                                                    <>
                                                        <img src={item.thumbnail} alt={item.title} className="w-100 h-100 object-fit-cover" />
                                                        <div className="position-absolute top-50 start-50 translate-middle pointer-event-none">
                                                            <i className="bi bi-play-circle-fill text-white display-1 opacity-75"></i>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="card-body px-0">
                                                <h5 className="fw-bold mb-1">{item.title}</h5>
                                                <p className="small text-muted">{item.description}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {galleryData.length === 0 && (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-images fs-1 d-block mb-3"></i>
                                    <h5>В цій категорії поки немає матеріалів</h5>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GalleryPage;
