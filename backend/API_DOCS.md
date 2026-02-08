# Документація API "Історія Факультету" (v2.0)

Базова URL: `http://127.0.0.1:5000`

---

## 🔐 1. Авторизація (Для Адміністратора)
> ⚠️ Усі запити на зміну даних (POST, PUT, DELETE) вимагають токен.
> Додавайте заголовок до запиту: `Authorization: Bearer <ваш_токен>`

**Вхід в адмінку (Login)**
* **POST** `/api/login`
* Тіло: `{ "username": "admin", "password": "admin123" }`
* Відповідь: `{ "access_token": "eyJhbGciOiJIUzI1Ni..." }`

---

## 📅 2. Події (Timeline & Gallery)

**Отримати всі події**
* **GET** `/api/events`
* Параметри (необов'язкові): `?year=2024` або `?category=наука`
* Відповідь: Масив об'єктів подій (з галереєю фото).

**Додати нову подію (🔒)**
* **POST** `/api/events`
* Тіло (JSON):
    ```json
    {
      "title": "Відкриття лабораторії",
      "year": 2024,
      "category": "наука",
      "description": "Детальний опис...",
      "media_url": "/static/uploads/cover.jpg",  // Головне фото
      "gallery": [                               // Альбом (список фото)
         "/static/uploads/photo1.jpg",
         "/static/uploads/photo2.jpg"
      ]
    }
    ```

**Редагувати подію (🔒)**
* **PUT** `/api/events/<id>`
* Тіло: Ті самі поля, що і при створенні (можна частково).

**Видалити подію (🔒)**
* **DELETE** `/api/events/<id>`

---

## 🎓 3. Видатні Постаті (Persons)

**Отримати список людей**
* **GET** `/api/persons`

**Додати людину (🔒)**
* **POST** `/api/persons`
* Тіло (JSON):
    ```json
    {
      "name": "Іванов Іван Іванович",
      "role": "Декан (2010-2020)",
      "bio": "Коротка біографія...",
      "photo_url": "/static/uploads/ivanov.jpg"
    }
    ```

**Видалити людину (🔒)**
* **DELETE** `/api/persons/<id>`

---

## 📂 4. Архів Документів (Documents)

**Отримати всі документи**
* **GET** `/api/documents`

**Додати документ (🔒)**
* **POST** `/api/documents`
* Тіло (JSON):
    ```json
    {
      "title": "Наказ про зарахування",
      "category": "Накази",
      "file_url": "/static/uploads/order_123.pdf"
    }
    ```

**Видалити документ (🔒)**
* **DELETE** `/api/documents/<id>`

---

## ☁️ 5. Завантаження Файлів (Upload)
Використовується для завантаження картинок (jpg, png) та документів (pdf).

**Завантажити файл (🔒)**
* **POST** `/api/upload`
* Тіло: `FormData` з полем `file`.
* Відповідь:
    ```json
    {
      "url": "/static/uploads/filename.jpg"
    }
    ```