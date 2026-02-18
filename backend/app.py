from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from models import db, Event, EventPhoto,Person,Document
import os
from werkzeug.utils import secure_filename
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from .constants import CATEGORIES

app = Flask(
    __name__,
    template_folder="../frontend/templates",
    static_folder="../frontend/static"
)

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
    return render_template('index.html')

@app.route('/timeline')
def timeline():
    events = [
        {
            "year": 1940, 
            "title": "Заснування інституту", 
            "category": "education", 
            "description": "Утворено Станіславський учительський інститут. Це початкова точка розвитку вищої освіти в нашому регіоні."
        },
        {
            "year": 1991,
            "title": "Статус університету",
            "category": "education",
            "description": "На базі педагогічного інституту створено Прикарпатський університет. Важлива віха в історії закладу."
        },
        {
            "year": 2004,
            "title": "Національний статус",
            "category": "science",
            "description": "Університету присвоєно статус національного за вагомий внесок у розвиток науки та культури України."
        },
        {
            "year": 2023,
            "title": "Відкриття IT-хабу",
            "category": "tech_innovation",
            "description": "Створення сучасного коворкінгу для студентів IT-спеціальностей на базі факультету."
    }]

    year_filter = request.args.get('year', type=int)
    category_filter = request.args.get('category')

    filtered_events = events

    if year_filter:
        filtered_events = [e for e in filtered_events if e['year'] == year_filter]

    if category_filter:
        filtered_events = [e for e in filtered_events if e['category'] == category_filter]

    return render_template('timeline.html', events=filtered_events, CATEGORIES=CATEGORIES)

@app.route('/gallery')
def gallery():
    return render_template('gallery.html')

@app.route('/persons')
def persons():
    return render_template('persons.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/archive')
def archive():
    return render_template('archive.html')

# Оновлений ендпоінт з фільтрацією
@app.route('/api/events', methods=['GET'])
def get_events():
    year = request.args.get('year')
    category = request.args.get('category')
    search = request.args.get('search')  # <--- НОВЕ: Параметр пошуку

    query = Event.query

    if year:
        query = query.filter_by(year=year)
    if category:
        query = query.filter_by(category=category)
    
    # НОВЕ: Пошук по частині назви (нечутливий до регістру)
    if search:
        query = query.filter(Event.title.ilike(f'%{search}%'))

    events = query.order_by(Event.year.desc()).all()
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

# --- РЕДАГУВАННЯ ТА ВИДАЛЕННЯ ПОДІЙ ---

# 1. Редагувати подію (PUT)
@app.route('/api/events/<int:id>', methods=['PUT'])
@jwt_required()
def update_event(id):
    # Шукаємо подію по ID
    event = Event.query.get(id)
    
    if not event:
        return jsonify({"message": "Event not found"}), 404

    data = request.json
    
    # Оновлюємо тільки ті поля, які прийшли (якщо поля немає, залишаємо старе)
    event.title = data.get('title', event.title)
    event.year = data.get('year', event.year)
    event.description = data.get('description', event.description)
    event.category = data.get('category', event.category)
    event.media_url = data.get('media_url', event.media_url)

    # Якщо прислали нову галерею — стару видаляємо і пишемо нову
    if 'gallery' in data:
        # Видаляємо старі зв'язки
        EventPhoto.query.filter_by(event_id=id).delete()
        # Додаємо нові
        for url in data['gallery']:
            photo = EventPhoto(url=url, event_id=event.id)
            db.session.add(photo)

    db.session.commit()
    return jsonify(event.to_dict())

# 2. Видалити подію (DELETE)
@app.route('/api/events/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_event(id):
    event = Event.query.get(id)
    
    if not event:
        return jsonify({"message": "Event not found"}), 404

    # Видаляємо подію (фото з галереї видаляться автоматично через cascade)
    db.session.delete(event)
    db.session.commit()

    return jsonify({"message": "Event deleted successfully"})

# --- РОБОТА З ЛЮДЬМИ (PERSONS) ---

# 1. Отримати список всіх людей (для сторінки "Гордість факультету")
@app.route('/api/persons', methods=['GET'])
def get_persons():
    persons = Person.query.all()
    return jsonify([p.to_dict() for p in persons])

# 2. Додати нову людину 
@app.route('/api/persons', methods=['POST'])
@jwt_required()
def add_person():
    data = request.json
    
    if not data or not 'name' in data:
        return jsonify({"error": "Name is required"}), 400

    new_person = Person(
        name=data['name'],
        role=data.get('role', 'Випускник'),
        bio=data.get('bio', ''),
        photo_url=data.get('photo_url', '')
    )

    db.session.add(new_person)
    db.session.commit()

    return jsonify(new_person.to_dict()), 201

# 3. Видалити людину 
@app.route('/api/persons/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_person(id):
    person = Person.query.get(id)
    if not person:
        return jsonify({"message": "Person not found"}), 404
        
    db.session.delete(person)
    db.session.commit()
    return jsonify({"message": "Person deleted"})

# --- АРХІВ ДОКУМЕНТІВ ---

# 1. Отримати всі документи
@app.route('/api/documents', methods=['GET'])
def get_documents():
    docs = Document.query.all()
    return jsonify([d.to_dict() for d in docs])

# 2. Додати документ (Тільки Адмін)
@app.route('/api/documents', methods=['POST'])
@jwt_required()
def add_document():
    data = request.json
    
    if not data or not 'title' in data or not 'file_url' in data:
        return jsonify({"error": "Title and File URL are required"}), 400

    new_doc = Document(
        title=data['title'],
        category=data.get('category', 'Різне'),
        file_url=data['file_url']
    )

    db.session.add(new_doc)
    db.session.commit()

    return jsonify(new_doc.to_dict()), 201

# 3. Видалити документ (Тільки Адмін)
@app.route('/api/documents/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_document(id):
    doc = Document.query.get(id)
    if not doc:
        return jsonify({"message": "Document not found"}), 404
        
    db.session.delete(doc)
    db.session.commit()
    return jsonify({"message": "Document deleted"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)