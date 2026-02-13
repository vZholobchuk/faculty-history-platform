import React from 'react';

const ArchivePage = () => {
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
                                <input type="text" id="archiveSearch" className="form-control border-start-0 search-box" placeholder="Пошук документа за назвою або роком..." />
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <select className="form-select search-box">
                                <option defaultValue>Всі категорії</option>
                                <option>Офіційні накази</option>
                                <option>Наукові звіти</option>
                                <option>Студентські матеріали</option>
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
                                <tr>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-file-earmark-pdf-fill text-danger fs-3 me-3"></i>
                                            <div>
                                                <div className="fw-bold text-dark">Наказ про заснування факультету</div>
                                                <div className="small text-muted">Оригінальний відсканований примірник</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="category-badge cat-official text-uppercase">Офіційне</span></td>
                                    <td>1965</td>
                                    <td><span className="text-muted fw-bold">PDF</span></td>
                                    <td className="text-end">
                                        <a href="#" className="btn btn-outline-primary btn-sm btn-download">
                                            <i className="bi bi-eye me-1"></i> Перегляд
                                        </a>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-file-earmark-text-fill text-primary fs-3 me-3"></i>
                                            <div>
                                                <div className="fw-bold text-dark">Протокол Вченої ради №12</div>
                                                <div className="small text-muted">Обговорення нових програм навчання</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="category-badge cat-science text-uppercase">Наука</span></td>
                                    <td>1982</td>
                                    <td><span className="text-muted fw-bold">DOCX</span></td>
                                    <td className="text-end">
                                        <a href="#" className="btn btn-outline-primary btn-sm btn-download">
                                            <i className="bi bi-download me-1"></i> Скачати
                                        </a>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-file-earmark-image-fill text-success fs-3 me-3"></i>
                                            <div>
                                                <div className="fw-bold text-dark">Перший диплом випускника ПНУ</div>
                                                <div className="small text-muted">Архівний зразок диплома спеціаліста</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="category-badge cat-student text-uppercase">Студенти</span></td>
                                    <td>1970</td>
                                    <td><span className="text-muted fw-bold">JPG</span></td>
                                    <td className="text-end">
                                        <a href="#" className="btn btn-outline-primary btn-sm btn-download">
                                            <i className="bi bi-eye me-1"></i> Перегляд
                                        </a>
                                    </td>
                                </tr>
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
