import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
                <div className="container">
                    <Link className="navbar-brand" to="/">КНУ Історія</Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/" end>Головна</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/timeline">Хронологія</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/archive">Архів</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/gallery">Галерея</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/persons">Постаті</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/admin">Адмін-панель</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <main className="flex-grow-1">
                <Outlet />
            </main>

            <footer className="bg-dark text-white text-center py-5 mt-auto">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-md-4 text-start">
                            <h5 className="fw-bold text-warning">КНУ Історія</h5>
                            <p className="small text-secondary">Цифровий проект факультету математики та інформатики.</p>
                        </div>
                        <div className="col-md-4">
                            <h5 className="fw-bold mb-3">Навігація</h5>
                            <ul className="list-unstyled small">
                                <li><Link to="/timeline" className="text-secondary text-decoration-none">Хронологія</Link></li>
                                <li><Link to="/archive" className="text-secondary text-decoration-none">Архів</Link></li>
                                <li><Link to="/gallery" className="text-secondary text-decoration-none">Галерея</Link></li>
                            </ul>
                        </div>
                        <div className="col-md-4 text-end">
                            <h5 className="fw-bold mb-3">Контакти</h5>
                            <p className="small text-secondary">вул. Шевченка, 57<br />Івано-Франківськ, Україна</p>
                        </div>
                    </div>
                    <hr className="border-secondary" />
                    <p className="mb-0 small text-secondary">© 2026 Прикарпатський національний університет імені Василя Стефаника</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
