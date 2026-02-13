import React from 'react';

const AdminPage = () => {
    return (
        <div className="container mt-5 mb-5">
            <div className="row">
                <div className="col-md-3">
                    <div className="list-group shadow-sm">
                        <button className="list-group-item list-group-item-action active">Додати подію</button>
                        <button className="list-group-item list-group-item-action">Завантажити фото/відео</button>
                        <button className="list-group-item list-group-item-action">Редагувати архів</button>
                        <button className="list-group-item list-group-item-action text-danger">Видалити запис</button>
                    </div>
                </div>

                <div className="col-md-9">
                    <div className="card shadow-sm p-4">
                        <h3>Створення нової картки події</h3>
                        <hr />
                        <form>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold">Дата/Рік</label>
                                    <input type="text" className="form-control" placeholder="напр. 2024" />
                                </div>
                                <div className="col-md-8 mb-3">
                                    <label className="form-label fw-bold">Назва події</label>
                                    <input type="text" className="form-control" placeholder="Введіть коротку назву" />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Опис події</label>
                                <textarea className="form-control" rows="4"></textarea>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">Категорія</label>
                                    <select className="form-select">
                                        <option>Освіта</option>
                                        <option>Наука</option>
                                        <option>Студенти</option>
                                        <option>Міжнародні проекти</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">Завантажити медіа</label>
                                    <input type="file" className="form-control" />
                                </div>
                            </div>
                            <div className="mt-3 text-end">
                                <button type="reset" className="btn btn-secondary me-2">Очистити</button>
                                <button type="submit" className="btn btn-primary px-5">Опублікувати на сайті</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
