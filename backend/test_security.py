import requests

# 1. Спробуємо додати подію БЕЗ токена (Має бути помилка 401)
url_events = 'http://127.0.0.1:5000/api/events'
print("Спроба злому (без пароля)...")
res = requests.post(url_events, json={"title": "Hacker Event", "year": 2099})
print(f"Результат: {res.status_code} (Очікуємо 401)\n")

# 2. Логінимось як Адмін
url_login = 'http://127.0.0.1:5000/api/login'
admin_data = {"username": "admin", "password": "admin123"}
print("Вхід у систему...")
login_res = requests.post(url_login, json=admin_data)

if login_res.status_code == 200:
    token = login_res.json()['access_token']
    print(f"Успіх! Отримали токен: {token[:15]}...\n")
    
    # 3. Додаємо подію З ТОКЕНОМ
    headers = {'Authorization': f'Bearer {token}'} # Показуємо "браслет"
    
    new_event = {
        "title": "Офіційна подія від Адміна",
        "year": 2025,
        "category": "адмін",
        "description": "Створено через захищений канал."
    }
    
    print("Спроба додати подію з токеном...")
    final_res = requests.post(url_events, json=new_event, headers=headers)
    print(f"Результат: {final_res.status_code} (Очікуємо 201)")
    print(final_res.json())
else:
    print("Не вдалося увійти!")