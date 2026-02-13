import React, { useState, useEffect } from 'react';
import { fetchArchive } from '../services/api';

const ArchivePage = () => {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Всі категорії');

    useEffect(() => {
        const loadArchive = async () => {
            setIsLoading(true);
            try {
                const data = await fetchArchive(searchQuery, selectedCategory);
                setDocuments(data);
            } catch (err) {
                setError('Не вдалося завантажити архів документів. Спробуйте пізніше.');
                console.error('Archive load error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            loadArchive();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory]);

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
            <header className="archive-header text-center">
                <div className="container">
                    <h1 className="display-4 fw-bold">Цифровий Архів</h1>
                    <p className="lead opacity-75">Зберігаємо документи, що формували майбутнє нашого університету</p>
                </div>
            </header>

            <div className="container mb-5">
                <div className="archive-container">

                    <div className="row mb-4 g-3">
                        <div className="col-lg-6">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0 search-box"><i className="bi bi-search text-muted"></i></span>
                                <input
                                    type="text"
                                    id="archiveSearch"
                                    className="form-control border-start-0 search-box"
                                    placeholder="Пошук документа за назвою або роком..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <select
                                className="form-select search-box"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option>Всі категорії</option>
                                <option>Офіційне</option>
                                <option>Наука</option>
                                <option>Студенти</option>
                            </select>
                        </div>
                        <div className="col-lg-3">
                            <button className="btn btn-primary w-100 search-box fw-bold"><i className="bi bi-funnel me-2"></i> Фільтрувати</button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">Назва документа</th>
                                    <th scope="col">Категорія</th>
                                    <th scope="col">Рік</th>
                                    <th scope="col">Формат</th>
                                    <th scope="col" className="text-end">Дія</th>
                                </tr>
                            </thead>
                            <tbody id="archiveTableBody">
                                {documents.map((doc) => (
                                    <tr key={doc.id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <i className={`${doc.iconClass} fs-3 me-3`}></i>
                                                <div>
                                                    <div className="fw-bold text-dark">{doc.title}</div>
                                                    <div className="small text-muted">{doc.subtitle}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className={`category-badge ${doc.categoryClass} text-uppercase`}>{doc.category}</span></td>
                                        <td>{doc.year}</td>
                                        <td><span className="text-muted fw-bold">{doc.format}</span></td>
                                        <td className="text-end">
                                            <a href="#" className="btn btn-outline-primary btn-sm btn-download">
                                                <i className={`${doc.actionIcon} me-1`}></i> {doc.action}
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <nav className="mt-4">
                        <ul className="pagination justify-content-center">
                            <li className="page-item disabled"><a className="page-link rounded-circle me-2" href="#"><i className="bi bi-chevron-left"></i></a></li>
                            <li className="page-item active"><a className="page-link rounded-circle me-2" href="#">1</a></li>
                            <li className="page-item"><a className="page-link rounded-circle me-2" href="#">2</a></li>
                            <li className="page-item"><a className="page-link rounded-circle" href="#"><i className="bi bi-chevron-right"></i></a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default ArchivePage;
