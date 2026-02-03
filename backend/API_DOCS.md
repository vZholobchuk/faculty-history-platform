# Документація API для "Історії Факультету"

Базова URL: `http://127.0.0.1:5000`

## 1. Авторизація (Для адмінів)
**POST** `/api/login`
- Відправляєш JSON: `{ "username": "admin", "password": "admin123" }`
- Отримуєш: `{ "access_token": "довгий_токен..." }`
> ⚠️ Цей токен треба зберігати (в localStorage) і додавати до кожного захищеного запиту в заголовок:
> `Authorization: Bearer твій_токен`

## 2. Події (Events)
**GET** `/api/events` (Публічний доступ)
- Параметри (необов'язкові): `?year=2010` або `?category=наука`
- Відповідь: Масив подій `[ {id, title, year...}, ... ]`

**POST** `/api/events` (🔒 Потрібен Токен)
- Тіло запиту (JSON):
  ```json
  {
    "title": "Назва події",
    "year": 2024,
    "category": "студенти",
    "media_url": "/static/uploads/cover.jpg",  // Головне фото (обкладинка)
    "gallery": [                               // НОВЕ: Список фото для альбому
       "/static/uploads/photo1.jpg",
       "/static/uploads/photo2.jpg"
    ]
  }