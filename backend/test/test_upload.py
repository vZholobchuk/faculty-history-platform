import requests

url = 'http://127.0.0.1:5000/api/upload'
file_path = 'test.jpg' # Переконайся, що файл існує поруч зі скриптом

# Відкриваємо файл у режимі читання байтів ('rb')
with open(file_path, 'rb') as f:
    files = {'file': f}
    response = requests.post(url, files=files)

print(f"Status: {response.status_code}")
print("Response:", response.json())