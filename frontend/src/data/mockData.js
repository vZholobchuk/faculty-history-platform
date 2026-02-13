
export const STATS_DATA = [
    {
        icon: 'bi-people-fill',
        count: '5000+',
        label: 'Випускників'
    },
    {
        icon: 'bi-mortarboard-fill',
        count: '6',
        label: 'Провідних кафедр'
    },
    {
        icon: 'bi-calendar-check-fill',
        count: '1940',
        label: 'Рік заснування'
    }
];

export const FEATURES_DATA = [
    'Інтерактивна лінія часу (1940-2025)',
    'Повнотекстовий пошук в архіві документів',
    'Галерея фото та відео подій факультету',
    'Профілі видатних постатей університету'
];

export const HISTORY_DATA = [
    {
        id: 1,
        year: 1941,
        title: 'Заснування інституту',
        description: 'Утворено Станіславський учительський інститут. Це початкова точка розвитку вищої освіти в нашому регіоні.',
        category: 'Освіта',
        badgeColor: 'primary',
        icon: 'bi-tag-fill'
    },
    {
        id: 2,
        year: 1991,
        title: 'Статус університету',
        description: 'На базі педагогічного інституту створено Прикарпатський університет. Важлива віха в історії закладу.',
        category: 'Історія',
        badgeColor: 'primary',
        image: 'https://via.placeholder.com/400x200?text=History+1991'
    },
    {
        id: 3,
        year: 2004,
        title: 'Національний статус',
        description: 'Університету присвоєно статус національного за вагомий внесок у розвиток науки та культури України.',
        category: null,
        badgeColor: 'warning'
    },
    {
        id: 4,
        year: 2023,
        title: 'Відкриття IT-хабу',
        description: 'Створення сучасного коворкінгу для студентів IT-спеціальностей на базі факультету.',
        category: 'Технології',
        badgeColor: 'success',
        icon: 'bi-cpu-fill'
    }
];

export const NEWS_DATA = [
    {
        id: 1,
        title: 'Відкриття нової лабораторії робототехніки',
        date: '2023-11-15',
        summary: 'Факультет отримав найсучасніше обладнання для студентів спеціальності "Комп\'ютерна інженерія".'
    },
    {
        id: 2,
        title: 'Студентська олімпіада з програмування',
        date: '2023-10-20',
        summary: 'Команда нашого факультету посіла перше місце у всеукраїнському етапі змагань.'
    },
    {
        id: 3,
        title: 'Міжнародна конференція "IT Universe"',
        date: '2023-09-05',
        summary: 'Викладачі факультету представили свої наукові доробки на конференції у Варшаві.'
    }
];

export const GALLERY_DATA = [
    {
        id: 1,
        type: 'photo',
        title: 'Наукова конференція 2023',
        description: 'Зустріч молодих вчених факультету',
        thumbnail: 'https://pnu.edu.ua/wp-content/uploads/2023/05/DSC0987.jpg',
        count: 15
    },
    {
        id: 2,
        type: 'photo',
        title: 'Випуск магістрів 2020',
        description: 'Урочиста церемонія в головному корпусі',
        thumbnail: 'https://via.placeholder.com/400x300?text=Graduation+2020',
        count: 42
    },
    {
        id: 3,
        type: 'photo',
        title: 'Архів: Навчання у 80-х',
        description: "Перші комп'ютерні класи факультету",
        thumbnail: 'https://pnu.edu.ua/wp-content/uploads/2019/02/DSC04250.jpg',
        count: 8
    },
    {
        id: 4,
        type: 'video',
        title: 'Гімн та історія Університету',
        description: 'Офіційне представлення ПНУ імені Василя Стефаника.',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
        id: 5,
        type: 'video',
        title: 'Студентська життя в IT-хабі',
        description: 'Як проходять будні майбутніх програмістів на нашому факультеті.',
        thumbnail: 'https://img.youtube.com/vi/L_jWHffIx5E/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/embed/L_jWHffIx5E'
    },
    {
        id: 6,
        type: 'video',
        title: 'Opening Ceremony',
        description: 'Урочисте відкриття нового навчального року',
        thumbnail: 'https://via.placeholder.com/300',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        category: 'Events'
    }
];

export const PERSONS_DATA = [
    {
        id: 1,
        name: 'Василь Стефаник',
        role: 'Класик української літератури',
        category: 'Історична постать',
        categoryColor: 'primary',
        categoryBg: null,
        image: 'https://stefanyk.pnu.edu.ua/wp-content/uploads/sites/11/2017/03/stefanyk.jpg',
        bio: "Видатний майстер психологічної новели, громадський діяч. Його творчість є фундаментом ідентичності нашого університету, який носить його ім'я з 1992 року.",
        details: [
            { label: 'Роки життя', value: '1871–1936', icon: '📍' },
            { label: 'Головна праця', value: '"Синя книжечка"', icon: '📖' }
        ],
        btnText: 'Біографічний нарис',
        btnClass: 'btn-primary'
    },
    {
        id: 2,
        name: 'Професор Іванченко І.І.',
        role: 'Засновник кафедри',
        category: 'Наукова еліта',
        categoryColor: '#198754',
        categoryBg: 'rgba(25, 135, 84, 0.1)',
        jobTitleColor: 'text-success',
        image: 'https://via.placeholder.com/150?text=Professor',
        bio: 'Зробив вагомий внесок у розвиток наукової школи нашого факультету у 80-х роках минулого століття. Опублікував понад 200 наукових статей. ',
        details: [
            { label: 'Досягнення', value: 'Заслужений діяч науки', icon: '🏆' },
            { label: 'Сфера', value: 'Теоретична математика', icon: '🔬' }
        ],
        btnText: 'Наукові праці',
        btnClass: 'btn-outline-success'
    },
    {
        id: 3,
        name: 'Доцент Петренко О.М.',
        role: 'Заслужений викладач',
        category: 'Сучасна постать',
        categoryColor: '#fd7e14',
        categoryBg: 'rgba(253, 126, 20, 0.1)',
        jobTitleColor: 'text-warning',
        image: 'https://via.placeholder.com/150?text=IT+Expert',
        bio: 'Автор понад 100 методичних посібників, за якими навчалися цілі покоління студентів нашого університету. Розробник курсів з архітектури ПЗ.',
        details: [
            { label: 'Спеціалізація', value: 'IT та програмування', icon: '👨‍💻' },
            { label: 'Стаж', value: 'Понад 35 років викладання', icon: '🎓' }
        ],
        btnText: 'Досягнення',
        btnClass: 'btn-outline-dark'
    }
];

export const ARCHIVE_DATA = [
    {
        id: 1,
        title: 'Наказ про заснування факультету',
        subtitle: 'Оригінальний відсканований примірник',
        category: 'Офіційне',
        categoryClass: 'cat-official',
        year: 1965,
        format: 'PDF',
        iconClass: 'bi-file-earmark-pdf-fill text-danger',
        action: 'Перегляд',
        actionIcon: 'bi-eye'
    },
    {
        id: 2,
        title: 'Протокол Вченої ради №12',
        subtitle: 'Обговорення нових програм навчання',
        category: 'Наука',
        categoryClass: 'cat-science',
        year: 1982,
        format: 'DOCX',
        iconClass: 'bi-file-earmark-text-fill text-primary',
        action: 'Скачати',
        actionIcon: 'bi-download'
    },
    {
        id: 3,
        title: 'Перший диплом випускника ПНУ',
        subtitle: 'Архівний зразок диплома спеціаліста',
        category: 'Студенти',
        categoryClass: 'cat-student',
        year: 1970,
        format: 'JPG',
        iconClass: 'bi-file-earmark-image-fill text-success',
        action: 'Перегляд',
        actionIcon: 'bi-eye'
    }
];

export const DASHBOARD_CONFIG = [
    { id: 1, key: 'eventsCount', label: 'Подій', icon: 'bi-calendar-event', color: 'primary' },
    { id: 2, key: 'documentsCount', label: 'Документів', icon: 'bi-file-earmark-text', color: 'success' },
    { id: 3, key: 'mediaSize', label: 'Медіа файлів', icon: 'bi-hdd', color: 'info' },
    { id: 4, key: 'usersCount', label: 'Користувачів', icon: 'bi-people', color: 'warning' }
];

export const ADMIN_MENU_DATA = [
    { id: 1, label: 'Додати подію', active: true, action: 'createEvent' },
    { id: 2, label: 'Завантажити фото/відео', active: false, action: 'uploadMedia' },
    { id: 3, label: 'Редагувати архів', active: false, action: 'editArchive' },
    { id: 4, label: 'Видалити запис', active: false, textClass: 'text-danger', action: 'deleteRecord' }
];
