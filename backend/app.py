from flask import Flask, jsonify, request  
from flask_cors import CORS
from models import db, Event, EventPhoto
import os
from werkzeug.utils import secure_filename
from flask_jwt_extended import JWTManager, create_access_token, jwt_required

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = 'super-secret-key-change-me' 
jwt = JWTManager(app)

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'static', 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///faculty.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return "Faculty History API is working!"

# Оновлений ендпоінт з фільтрацією
@app.route('/api/events', methods=['GET'])
def get_events():
    # Отримуємо параметри з URL (наприклад, ?category=наука&year=2010)
    category = request.args.get('category')
    year = request.args.get('year')
    
    query = Event.query

    # Якщо передали категорію — фільтруємо
    if category:
        query = query.filter(Event.category.ilike(f'%{category}%')) # ilike робить пошук нечутливим до регістру
    
    # Якщо передали рік — фільтруємо
    if year:
        query = query.filter_by(year=year)
    
    # Сортуємо події від старих до нових
    events = query.order_by(Event.year.asc()).all()

    return jsonify([event.to_dict() for event in events])


# Новий ендпоінт для ДОДАВАННЯ подій (POST)
@app.route('/api/events', methods=['POST'])
@jwt_required()
def add_event():
    data = request.json
    
    if not data or not 'title' in data or not 'year' in data:
        return jsonify({"error": "Title and Year are required"}), 400

    # Створюємо подію
    new_event = Event(
        title=data['title'],
        year=data['year'],
        description=data.get('description', ''),
        category=data['category'],
        media_url=data.get('media_url', '') # Це обкладинка
    )

    # Зберігаємо подію, щоб отримати її ID
    db.session.add(new_event)
    db.session.flush() # Це важливо! Ми ще не робимо commit, але вже отримуємо ID

    # Обробляємо список фото для галереї (якщо він є)
    gallery_urls = data.get('gallery', []) # Очікуємо список ["url1", "url2"]
    
    for url in gallery_urls:
        photo = EventPhoto(url=url, event_id=new_event.id)
        db.session.add(photo)

    # Тепер зберігаємо все разом
    db.session.commit()

    return jsonify(new_event.to_dict()), 201
@app.route('/api/upload', methods=['POST'])
@jwt_required()
def upload_file():
    # Перевіряємо, чи є файл у запиті
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        # Очищаємо назву файлу від небезпечних символів
        filename = secure_filename(file.filename)
        # Зберігаємо файл у папку
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        return jsonify({'url': f'/static/uploads/{filename}'}), 201

# для входу (Login)
@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    # Перевірка пароля 
    if username != 'admin' or password != 'admin123':
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)

if __name__ == '__main__':
    app.run(debug=True, port=5000)