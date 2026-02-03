import requests
import json

# Адреса нашого сервера
url = 'http://127.0.0.1:5000/api/events'

# Дані нової події, яку ми хочемо створити
new_event = {
    "title": "Тестова подія через Python",
    "year": 2024,
    "category": "студенти",
    "description": "Ми перевіряємо, чи працює POST запит.",
    "media_url": ""
}

# Відправляємо запит
response = requests.post(url, json=new_event)

# Дивимось, що відповів сервер
print(f"Status Code: {response.status_code}")
print("Response:", response.json())