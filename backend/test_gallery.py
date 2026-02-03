import requests

# Спочатку треба отримати токен (встав сюди код логіну з test_security.py)
# ... припустимо, ми вже маємо змінну token ...
# Або просто тимчасово вимкни @jwt_required в app.py для тесту, якщо ліньки копіювати.

# Але краще зробимо правильно. Ось повний код:
login_url = 'http://127.0.0.1:5000/api/login'
token = requests.post(login_url, json={"username": "admin", "password": "admin123"}).json()['access_token']
headers = {'Authorization': f'Bearer {token}'}

# Створюємо подію з АЛЬБОМОМ
event_data = {
    "title": "Випускний 2024 (з альбомом)",
    "year": 2024,
    "category": "студенти",
    "description": "Багато фото щасливих випускників.",
    "media_url": "/static/uploads/cover.jpg", # Головне фото
    "gallery": [                              # АЛЬБОМ
        "/static/uploads/photo1.jpg",
        "/static/uploads/photo2.jpg",
        "/static/uploads/photo3.jpg"
    ]
}

res = requests.post('http://127.0.0.1:5000/api/events', json=event_data, headers=headers)
print("Створено:", res.json())

# Перевіряємо, чи повернулася галерея при зчитуванні
get_res = requests.get('http://127.0.0.1:5000/api/events')
last_event = get_res.json()[-1]
print("\nОстання подія з бази:")
print(f"Назва: {last_event['title']}")
print(f"Фото в альбомі: {last_event['gallery']}")
