import React, { useState, useEffect } from 'react';
import { fetchDashboardStats, createEvent, uploadMedia, addArchiveDocument, deleteHistoryEvent, fetchHistory } from '../services/api';
import { DASHBOARD_CONFIG, ADMIN_MENU_DATA } from '../data/mockData';

const AdminPage = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeAction, setActiveAction] = useState('createEvent');

    // Loading state for form submission
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form 1: Add Event State
    const [eventForm, setEventForm] = useState({
        year: '',
        title: '',
        description: '',
        category: 'Освіта',
        imageFile: null
    });

    // Form 2: Upload Gallery Media State
    const [mediaForm, setMediaForm] = useState({
        type: 'photo',
        caption: '',
        file: null,
        videoUrl: ''
    });

    // Form 3: Edit Archive State
    const [archiveForm, setArchiveForm] = useState({
        title: '',
        year: '',
        category: 'Офіційне',
        file: null
    });

    // Delete List State
    const [eventsList, setEventsList] = useState([]);
    const [isEventsLoading, setIsEventsLoading] = useState(false);

    const loadStatsData = async () => {
        try {
            const data = await fetchDashboardStats();
            setStats(data);
        } catch (err) {
            setError('Не вдалося завантажити статистику панелі адміністратора.');
            console.error('Dashboard stats load error:', err);
        }
    };

    useEffect(() => {
        const init = async () => {
            await loadStatsData();
            setIsLoading(false);
        };
        init();
    }, []);

    useEffect(() => {
        if (activeAction === 'deleteRecord') {
            loadAllEvents();
        }
    }, [activeAction]);

    const loadAllEvents = async () => {
        setIsEventsLoading(true);
        try {
            const data = await fetchHistory();
            setEventsList(data);
        } catch (error) {
            console.error("Failed to load events list", error);
        } finally {
            setIsEventsLoading(false);
        }
    };

    const handleMenuClick = (action) => {
        setActiveAction(action);
        setIsSubmitting(false); // Reset submitting state on tab switch
    };

    // Generic Input Change Handler
    const handleInputChange = (e, setForm) => {
        const { name, value, files } = e.target;
        if (files) {
            setForm(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    // Submit Handler for Add Event
    const handleEventSubmit = async (e) => {
        e.preventDefault();
        if (!eventForm.year || !eventForm.title || !eventForm.description) {
            alert('Будь ласка, заповніть всі обов\'язкові поля');
            return;
        }

        setIsSubmitting(true);
        try {
            await createEvent(eventForm);
            alert('Success! Data sent to API (simulation)');
            setEventForm({ year: '', title: '', description: '', category: 'Освіта', imageFile: null });
            // Reset file input manually if needed, but react state handling does it for values usually. 
            // For file inputs, controlled components are tricky. 
            // We can use a ref or just let the reset happen. Use key to reset file input later if needed.
            document.getElementById('eventImageInput').value = "";
        } catch (error) {
            alert('Error sending data');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Submit Handler for Upload Media
    const handleMediaSubmit = async (e) => {
        e.preventDefault();

        // Specific validation based on type
        if (mediaForm.type === 'photo' && !mediaForm.file) {
            alert('Будь ласка, оберіть фото-файл');
            return;
        }
        if (mediaForm.type === 'video' && !mediaForm.videoUrl) {
            alert('Будь ласка, введіть посилання на відео');
            return;
        }

        setIsSubmitting(true);
        try {
            await uploadMedia(mediaForm);
            alert('Success! Media data sent to API (simulation)');
            setMediaForm({ type: 'photo', caption: '', file: null, videoUrl: '' });

            // Reset safe optional chaining in case element doesn't exist (e.g. if type is currently video)
            const fileInput = document.getElementById('mediaFileInput');
            if (fileInput) fileInput.value = "";
        } catch (error) {
            alert('Error uploading media');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Submit Handler for Archive Document
    const handleArchiveSubmit = async (e) => {
        e.preventDefault();
        if (!archiveForm.title || !archiveForm.year || !archiveForm.file) {
            alert('Будь ласка, заповніть всі поля та оберіть файл');
            return;
        }

        setIsSubmitting(true);
        try {
            await addArchiveDocument(archiveForm);
            alert('Success! Document data sent to API (simulation)');
            setArchiveForm({ title: '', year: '', category: 'Офіційне', file: null });
            document.getElementById('archiveFileInput').value = "";
        } catch (error) {
            alert('Error adding document');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цей запис?')) {
            try {
                await deleteHistoryEvent(id);
                setEventsList(prev => prev.filter(item => item.id !== id));
            } catch (error) {
                alert('Помилка при видаленні');
            }
        }
    };

    if (isLoading && !stats) {
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
        <div className="container mt-5 mb-5">
            {/* Dashboard Stats Section */}
            <div className="row mb-4 g-3">
                {DASHBOARD_CONFIG.map((config) => (
                    <div key={config.id} className="col-md-3 col-sm-6">
                        <div className={`card shadow-sm border-start border-4 border-${config.color} h-100`}>
                            <div className="card-body d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="text-muted small text-uppercase fw-bold mb-1">{config.label}</div>
                                    <div className="h3 fw-bold mb-0 text-dark">
                                        {stats ? stats[config.key] : '-'}
                                    </div>
                                </div>
                                <div className={`fs-1 text-${config.color} opacity-25`}>
                                    <i className={`bi ${config.icon}`}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row">
                <div className="col-md-3">
                    <div className="list-group shadow-sm">
                        {ADMIN_MENU_DATA.map((item) => (
                            <button
                                key={item.id}
                                className={`list-group-item list-group-item-action ${activeAction === item.action ? 'active' : ''} ${item.textClass || ''}`}
                                onClick={() => handleMenuClick(item.action)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="col-md-9">
                    <div className="card shadow-sm p-4">

                        {/* 1. Add Event Form */}
                        {activeAction === 'createEvent' && (
                            <>
                                <h3>Створення нової картки події</h3>
                                <hr />
                                <form onSubmit={handleEventSubmit}>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-bold">Дата/Рік <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="year"
                                                value={eventForm.year}
                                                onChange={(e) => handleInputChange(e, setEventForm)}
                                                placeholder="напр. 2024"
                                            />
                                        </div>
                                        <div className="col-md-8 mb-3">
                                            <label className="form-label fw-bold">Назва події <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="title"
                                                value={eventForm.title}
                                                onChange={(e) => handleInputChange(e, setEventForm)}
                                                placeholder="Введіть коротку назву"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Опис події <span className="text-danger">*</span></label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            name="description"
                                            value={eventForm.description}
                                            onChange={(e) => handleInputChange(e, setEventForm)}
                                        ></textarea>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Категорія</label>
                                            <select
                                                className="form-select"
                                                name="category"
                                                value={eventForm.category}
                                                onChange={(e) => handleInputChange(e, setEventForm)}
                                            >
                                                <option>Освіта</option>
                                                <option>Історія</option>
                                                <option>Технології</option>
                                                <option>Наука</option>
                                                <option>Студенти</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Обкладинка (Фото)</label>
                                            <input
                                                type="file"
                                                id="eventImageInput"
                                                className="form-control"
                                                name="imageFile"
                                                accept="image/*"
                                                onChange={(e) => handleInputChange(e, setEventForm)}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3 text-end">
                                        <button type="submit" className="btn btn-primary px-5" disabled={isSubmitting}>
                                            {isSubmitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Publication...</> : 'Опублікувати на сайті'}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        {/* 2. Upload Media Form */}
                        {activeAction === 'uploadMedia' && (
                            <>
                                <h3>Завантаження медіа в Галерею</h3>
                                <hr />
                                <form onSubmit={handleMediaSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Тип медіа</label>
                                            <select
                                                className="form-select"
                                                name="type"
                                                value={mediaForm.type}
                                                onChange={(e) => handleInputChange(e, setMediaForm)}
                                            >
                                                <option value="photo">Фотоальбом</option>
                                                <option value="video">Відео</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            {mediaForm.type === 'photo' ? (
                                                <>
                                                    <label className="form-label fw-bold">Файл фото <span className="text-danger">*</span></label>
                                                    <input
                                                        type="file"
                                                        id="mediaFileInput"
                                                        className="form-control"
                                                        name="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleInputChange(e, setMediaForm)}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <label className="form-label fw-bold">Посилання на YouTube <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="videoUrl"
                                                        value={mediaForm.videoUrl}
                                                        onChange={(e) => handleInputChange(e, setMediaForm)}
                                                        placeholder="https://www.youtube.com/embed/..."
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Підпис / Опис</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="caption"
                                            value={mediaForm.caption}
                                            onChange={(e) => handleInputChange(e, setMediaForm)}
                                            placeholder="Короткий опис файлу"
                                        />
                                    </div>
                                    <div className="mt-3 text-end">
                                        <button type="submit" className="btn btn-success px-5" disabled={isSubmitting}>
                                            {isSubmitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Uploading...</> : 'Завантажити в Галерею'}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        {/* 3. Edit Archive Form */}
                        {activeAction === 'editArchive' && (
                            <>
                                <h3>Додати документ в Архів</h3>
                                <hr />
                                <form onSubmit={handleArchiveSubmit}>
                                    <div className="row">
                                        <div className="col-md-8 mb-3">
                                            <label className="form-label fw-bold">Назва документа <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="title"
                                                value={archiveForm.title}
                                                onChange={(e) => handleInputChange(e, setArchiveForm)}
                                                placeholder="Назва наказу, звіту тощо"
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-bold">Рік видання <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="year"
                                                value={archiveForm.year}
                                                onChange={(e) => handleInputChange(e, setArchiveForm)}
                                                placeholder="1985"
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Категорія</label>
                                            <select
                                                className="form-select"
                                                name="category"
                                                value={archiveForm.category}
                                                onChange={(e) => handleInputChange(e, setArchiveForm)}
                                            >
                                                <option>Офіційне</option>
                                                <option>Наука</option>
                                                <option>Студенти</option>
                                                <option>Інше</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Файл документа (PDF) <span className="text-danger">*</span></label>
                                            <input
                                                type="file"
                                                id="archiveFileInput"
                                                className="form-control"
                                                name="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => handleInputChange(e, setArchiveForm)}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3 text-end">
                                        <button type="submit" className="btn btn-warning px-5" disabled={isSubmitting}>
                                            {isSubmitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : 'Зберегти документ'}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        {/* 4. Delete Record Table */}
                        {activeAction === 'deleteRecord' && (
                            <>
                                <h3>Управління архівом подій</h3>
                                <hr />
                                {isEventsLoading ? (
                                    <div className="text-center">Loading list...</div>
                                ) : (
                                    <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Рік</th>
                                                    <th>Назва</th>
                                                    <th className="text-end">Дія</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {eventsList.map(item => (
                                                    <tr key={item.id}>
                                                        <td>{item.year}</td>
                                                        <td>{item.title}</td>
                                                        <td className="text-end">
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                <i className="bi bi-trash"></i> Видалити
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {eventsList.length === 0 && (
                                                    <tr>
                                                        <td colSpan="3" className="text-center text-muted">Список пустий</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
