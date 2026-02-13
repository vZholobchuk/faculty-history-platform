import React from 'react';

const PersonsPage = () => {
    return (
        <div className="container my-5">
            <header className="text-center mb-5">
                <h1 className="display-5 fw-bold text-dark">Видатні особистості факультету</h1>
                <p className="text-muted">Люди, які творили історію нашого університету протягом десятиліть</p>
            </header>

            <div className="row g-4">
                <div className="col-lg-4 col-md-6">
                    <div className="card person-card h-100 shadow-sm">
                        <span className="category-badge">Історична постать</span>

                        <div className="profile-img-container">
                            <img src="https://stefanyk.pnu.edu.ua/wp-content/uploads/sites/11/2017/03/stefanyk.jpg" className="profile-img" alt="Василь Стефаник" />
                        </div>

                        <div className="card-body text-center">
                            <h4 className="card-title fw-bold">Василь Стефаник</h4>
                            <p className="text-primary small mb-3">Класик української літератури</p>

                            <p className="biography-text">
                                Видатний майстер психологічної новели, громадський діяч. Його творчість є фундаментом ідентичності нашого університету, який носить його ім'я з 1992 року.
                            </p>

                            <div className="text-start bg-light p-3 rounded-3 mb-4">
                                <div className="small mb-1">📍 <strong>Роки життя:</strong> 1871–1936</div>
                                <div className="small">📖 <strong>Головна праця:</strong> "Синя книжечка"</div>
                            </div>

                            <a href="#" className="btn btn-primary w-100 py-2 fw-semibold">Біографічний нарис</a>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-md-6">
                    <div className="card person-card h-100 shadow-sm">
                        <span className="category-badge" style={{ color: '#198754', background: 'rgba(25, 135, 84, 0.1)' }}>Наукова еліта</span>

                        <div className="profile-img-container">
                            <img src="https://via.placeholder.com/150?text=Professor" className="profile-img" alt="Професор" />
                        </div>

                        <div className="card-body text-center">
                            <h4 className="card-title fw-bold">Професор Іванченко І.І.</h4>
                            <p className="text-success small mb-3">Засновник кафедри</p>

                            <p className="biography-text">
                                Зробив вагомий внесок у розвиток наукової школи нашого факультету у 80-х роках минулого століття. Опублікував понад 200 наукових статей.
                            </p>

                            <div className="text-start bg-light p-3 rounded-3 mb-4">
                                <div className="small mb-1">🏆 <strong>Досягнення:</strong> Заслужений діяч науки</div>
                                <div className="small">🔬 <strong>Сфера:</strong> Теоретична математика</div>
                            </div>

                            <a href="#" className="btn btn-outline-success w-100 py-2 fw-semibold">Наукові праці</a>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-md-6">
                    <div className="card person-card h-100 shadow-sm">
                        <span className="category-badge" style={{ color: '#fd7e14', background: 'rgba(253, 126, 20, 0.1)' }}>Сучасна постать</span>

                        <div className="profile-img-container">
                            <img src="https://via.placeholder.com/150?text=IT+Expert" className="profile-img" alt="Сучасник" />
                        </div>

                        <div className="card-body text-center">
                            <h4 className="card-title fw-bold">Доцент Петренко О.М.</h4>
                            <p className="text-warning small mb-3">Заслужений викладач</p>

                            <p className="biography-text">
                                Автор понад 100 методичних посібників, за якими навчалися цілі покоління студентів нашого університету. Розробник курсів з архітектури ПЗ.
                            </p>

                            <div className="text-start bg-light p-3 rounded-3 mb-4">
                                <div className="small mb-1">👨‍💻 <strong>Спеціалізація:</strong> IT та програмування</div>
                                <div className="small">🎓 <strong>Стаж:</strong> Понад 35 років викладання</div>
                            </div>

                            <a href="#" className="btn btn-outline-dark w-100 py-2 fw-semibold">Досягнення</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonsPage;
