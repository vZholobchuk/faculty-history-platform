import React from 'react';

const TimelinePage = () => {
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
                            <input type="number" className="form-control border-0 bg-light rounded-pill" placeholder="Пошук за роком (напр. 1992)" />
                            <select className="form-select border-0 bg-light rounded-pill">
                                <option>Всі категорії</option>
                                <option>Освіта</option>
                                <option>Наука</option>
                                <option>Студенти</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="timeline-wrapper">
                    <div className="timeline-line"></div>

                    <div className="timeline-item left-item clearfix">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                            <span className="badge bg-primary year-badge">1940</span>
                            <h4 className="fw-bold">Заснування інституту</h4>
                            <p className="text-muted">Утворено Станіславський учительський інститут. Це початкова точка розвитку вищої освіти в нашому регіоні.</p>
                            <div className="small text-primary fw-semibold"><i className="bi bi-tag-fill me-1"></i> Освіта</div>
                        </div>
                    </div>

                    <div className="timeline-item right-item clearfix">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                            <span className="badge bg-primary year-badge">1991</span>
                            <h4 className="fw-bold">Статус університету</h4>
                            <p className="text-muted">На базі педагогічного інституту створено Прикарпатський університет. Важлива віха в історії закладу.</p>
                            <img src="https://via.placeholder.com/400x200?text=History+1991" className="img-fluid rounded-3 mt-3 shadow-sm" alt="1991" />
                        </div>
                    </div>

                    <div className="timeline-item left-item clearfix">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                            <span className="badge bg-warning text-dark year-badge">2004</span>
                            <h4 className="fw-bold">Національний статус</h4>
                            <p className="text-muted">Університету присвоєно статус національного за вагомий внесок у розвиток науки та культури України.</p>
                        </div>
                    </div>

                    <div className="timeline-item right-item clearfix">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                            <span className="badge bg-success year-badge">2023</span>
                            <h4 className="fw-bold">Відкриття IT-хабу</h4>
                            <p className="text-muted">Створення сучасного коворкінгу для студентів IT-спеціальностей на базі факультету.</p>
                            <div className="small text-success fw-semibold"><i className="bi bi-cpu-fill me-1"></i> Технології</div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default TimelinePage;
