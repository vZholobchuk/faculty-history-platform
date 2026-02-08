import requests

# 1. Логінимось
login_url = 'http://127.0.0.1:5000/api/login'
token = requests.post(login_url, json={"username": "admin", "password": "admin123"}).json()['access_token']
headers = {'Authorization': f'Bearer {token}'}

# 2. Спочатку створимо подію, яку не шкода видалити
create_url = 'http://127.0.0.1:5000/api/events'
new_event = {
    "title": "Подія для видалення",
    "year": 2024,
    "category": "тест",
    "media_url": ""
}
res = requests.post(create_url, json=new_event, headers=headers)
event_id = res.json()['id']
print(f"Створено подію з ID: {event_id}")

# 3. А тепер ВИДАЛИМО її
delete_url = f'http://127.0.0.1:5000/api/events/{event_id}'
del_res = requests.delete(delete_url, headers=headers)

print(f"Статус видалення: {del_res.status_code}")
print("Відповідь:", del_res.json())

# 4. Перевіримо, чи вона зникла (має бути 404 або просто не знайти її)
check_res = requests.get(f'http://127.0.0.1:5000/api/events')
events = check_res.json()
found = any(e['id'] == event_id for e in events)
print(f"Чи є подія в базі? {'ТАК' if found else 'НІ (Успіх)'}")