from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from models import db, Event, EventPhoto, EventVideo, EventDocument, Person, Document, GalleryAlbum, GalleryPhoto, GalleryVideoAlbum, GalleryVideo, User
import os
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required

CATEGORIES = {
    "education": {
        "label": "Освіта",
        "icon": "bi-book-fill",
    },
    "science": {
        "label": "Наука",
        "icon": "bi-flask-fill",
    },
    "students": {
        "label": "Студенти",
        "icon": "bi-person-fill",
    },
    "tech_innovation": {
        "label": "Технології та інновації",
        "icon": "bi-laptop-fill",
    },
    "campus_development": {
        "label": "Розвиток кампусу",
        "icon": "bi-building-fill",
    },
    "culture_social": {
        "label": "Культурний та соціальний вплив",
        "icon": "bi-people-fill",
    },
    "leadership": {
        "label": "Лідерство та управління",
        "icon": "bi-person-lines-fill",
    },
    "international": {
        "label": "Міжнародні відносини",
        "icon": "bi-globe2",
    },
    "community": {
        "label": "Залучення громади та випускники",
        "icon": "bi-people-fill",
    }
}

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

# Secret code for registration (In production, use env var)
ADMIN_SECRET_CODE = "faculty2026" 

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/timeline')
def timeline():
    year_filter = request.args.get('year', type=int)
    category_filter = request.args.get('category')

    query = Event.query

    if year_filter:
        query = query.filter_by(year=year_filter)

    if category_filter:
        query = query.filter_by(category=category_filter)

    events = query.order_by(Event.year.asc()).all()
    
    # Fallback if database is empty - populate with default data
    if not events and not year_filter and not category_filter:
         if Event.query.count() == 0:
            default_events = [
                Event(year=1940, title="Заснування інституту", category="education", description="Утворено Станіславський учительський інститут. Це початкова точка розвитку вищої освіти в нашому регіоні."),
                Event(year=1991, title="Статус університету", category="education", description="На базі педагогічного інституту створено Прикарпатський університет. Важлива віха в історії закладу."),
                Event(year=2004, title="Національний статус", category="science", description="Університету присвоєно статус національного за вагомий внесок у розвиток науки та культури України."),
                Event(year=2023, title="Відкриття IT-хабу", category="tech_innovation", description="Створення сучасного коворкінгу для студентів IT-спеціальностей на базі факультету.")
            ]
            for event in default_events:
                db.session.add(event)
            db.session.commit()
            events = Event.query.order_by(Event.year.asc()).all()

    return render_template('timeline.html', events=events, CATEGORIES=CATEGORIES)

@app.route('/event/<int:id>')
def event_detail(id):
    event = Event.query.get_or_404(id)
    return render_template('event_detail.html', event=event, CATEGORIES=CATEGORIES)

@app.route('/gallery')
def gallery():
    albums = GalleryAlbum.query.all()
    video_albums = GalleryVideoAlbum.query.all()
    return render_template('gallery.html', albums=albums, video_albums=video_albums)

@app.route('/persons')
def persons():
    persons = Person.query.all()
    # Check if DB is unexpectedly empty and prevent errors by passing empty list if needed, 
    # but ideally seed data should handle this.
    return render_template('persons.html', persons=persons)

@app.route('/person/<int:id>')
def person_detail(id):
    person = Person.query.get_or_404(id)
    return render_template('person_detail.html', person=person)

@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/archive')
def archive():
    return render_template('archive.html')

@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')

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
        short_description=data.get('short_description', data.get('description', '')), # Fallback to description
        full_description=data.get('full_description', data.get('description', '')),   # Fallback to description
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

    # Обробляємо відео
    videos_data = data.get('videos', [])
    for v_data in videos_data:
        video = EventVideo(video_url=v_data.get('url'), caption=v_data.get('caption', ''), event_id=new_event.id)
        db.session.add(video)

    # Обробляємо документи
    docs_data = data.get('documents', [])
    for d_data in docs_data:
        doc = EventDocument(title=d_data.get('title'), file_url=d_data.get('url'), event_id=new_event.id)
        db.session.add(doc)

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

# API: Login
@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    
    # 1. Check database first
    user = User.query.filter_by(username=username).first()
    
    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)

    # 2. Check legacy hardcoded admin (fallback for smooth transition)
    if username == 'admin' and password == 'admin123':
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)

    return jsonify({"msg": "Невірний логін або пароль"}), 401

# API: Register
@app.route('/api/register', methods=['POST'])
def register_api():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    secret_code = data.get('secret_code')
    
    if not username or not password:
        return jsonify({"msg": "Логін та пароль обов'язкові"}), 400
        
    if secret_code != ADMIN_SECRET_CODE:
        return jsonify({"msg": "Невірний секретний код адміністратора"}), 403
        
    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Користувач з таким логіном вже існує"}), 400
        
    new_user = User(
        username=username,
        password_hash=generate_password_hash(password)
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"msg": "Адміністратор успішно створений"}), 201

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
    event.short_description = data.get('short_description', data.get('description', event.short_description))
    event.full_description = data.get('full_description', data.get('description', event.full_description))
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

    if 'videos' in data:
         EventVideo.query.filter_by(event_id=id).delete()
         for v_data in data['videos']:
            video = EventVideo(video_url=v_data.get('url'), caption=v_data.get('caption', ''), event_id=event.id)
            db.session.add(video)

    if 'documents' in data:
         EventDocument.query.filter_by(event_id=id).delete()
         for d_data in data['documents']:
            doc = EventDocument(title=d_data.get('title'), file_url=d_data.get('url'), event_id=event.id)
            db.session.add(doc)

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


# --- ГАЛЕРЕЯ АЛЬБОМІВ (ФОТО) ---

@app.route('/api/gallery/albums', methods=['GET'])
def get_gallery_albums():
    albums = GalleryAlbum.query.all()
    return jsonify([a.to_dict() for a in albums])

@app.route('/api/gallery/albums', methods=['POST'])
@jwt_required()
def add_gallery_album():
    data = request.json
    if not data or not 'title' in data:
        return jsonify({"error": "Title is required"}), 400

    new_album = GalleryAlbum(
        title=data['title'],
        description=data.get('description', ''),
        cover_url=data.get('cover_url', '')
    )
    db.session.add(new_album)
    db.session.flush()

    for photo_url in data.get('photos', []):
        photo = GalleryPhoto(url=photo_url, album_id=new_album.id)
        db.session.add(photo)

    db.session.commit()
    return jsonify(new_album.to_dict()), 201

@app.route('/api/gallery/albums/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_gallery_album(id):
    album = GalleryAlbum.query.get_or_404(id)
    db.session.delete(album)
    db.session.commit()
    return jsonify({"message": "Album deleted"})

# --- ГАЛЕРЕЯ АЛЬБОМІВ (ВІДЕО) ---

@app.route('/api/gallery/video_albums', methods=['GET'])
def get_video_albums():
    albums = GalleryVideoAlbum.query.all()
    # Manual to_dict for VideoAlbum if not defined in model explicitly (it wasn't in my previous view)
    # Let's check model again or just manually construct
    result = []
    for album in albums:
        album_dict = {
            "id": album.id,
            "title": album.title,
            "description": album.description,
            "cover_url": album.cover_url,
            "videos": [{"url": v.video_url, "caption": v.caption} for v in album.videos]
        }
        result.append(album_dict)
    return jsonify(result)

@app.route('/api/gallery/video_albums', methods=['POST'])
@jwt_required()
def add_video_album():
    data = request.json
    if not data or not 'title' in data:
        return jsonify({"error": "Title is required"}), 400

    new_album = GalleryVideoAlbum(
        title=data['title'],
        description=data.get('description', ''),
        cover_url=data.get('cover_url', '')
    )
    db.session.add(new_album)
    db.session.flush()

    for v_data in data.get('videos', []):
        video = GalleryVideo(
            video_url=v_data.get('url'), 
            caption=v_data.get('caption', ''), 
            album_id=new_album.id
        )
        db.session.add(video)

    db.session.commit()
    # Manual to_dict construction
    return jsonify({
        "id": new_album.id,
        "title": new_album.title,
        "description": new_album.description,
        "cover_url": new_album.cover_url,
        "videos": [{"url": v.video_url, "caption": v.caption} for v in new_album.videos]
    }), 201

@app.route('/api/gallery/video_albums/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_video_album(id):
    album = GalleryVideoAlbum.query.get_or_404(id)
    db.session.delete(album)
    db.session.commit()
    return jsonify({"message": "Video Album deleted"})

# --- UPDATE PERSON ---
@app.route('/api/persons/<int:id>', methods=['PUT'])
@jwt_required()
def update_person(id):
    person = Person.query.get_or_404(id)
    data = request.json
    
    person.name = data.get('name', person.name)
    person.role = data.get('role', person.role)
    person.photo_url = data.get('photo_url', person.photo_url)
    person.short_bio = data.get('short_bio', person.short_bio)
    person.full_bio = data.get('full_bio', person.full_bio)
    person.life_years = data.get('life_years', person.life_years)
    person.profession_sphere = data.get('profession_sphere', person.profession_sphere)
    person.faculty = data.get('faculty', person.faculty)

    db.session.commit()
    return jsonify(person.to_dict())

if __name__ == '__main__':
    app.run(debug=True, port=5000)
