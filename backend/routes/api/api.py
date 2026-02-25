from flask import Blueprint, jsonify, request, current_app, make_response
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, create_access_token, set_access_cookies, create_refresh_token, get_jwt_identity, set_refresh_cookies, unset_jwt_cookies
from werkzeug.security import generate_password_hash, check_password_hash
from ...models import db, Event, EventPhoto, EventVideo, EventDocument, Person, Document, GalleryAlbum, GalleryPhoto, GalleryVideoAlbum, GalleryVideo, User
from ...constants import CATEGORIES
from sqlalchemy import text
from sqlalchemy.orm import selectinload
import os
import uuid
import shutil

api_bp = Blueprint(
    'api',
    __name__,
    url_prefix="/api"
)

@api_bp.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username or not password:
        return jsonify({"msg": "Username and password are required"}), 400
    
    user = User.query.filter_by(username=username).first()
    
    if user:
        # Check if hash matches
        is_valid_hash = False
        try:
            is_valid_hash = check_password_hash(user.password, password)
        except ValueError:
            pass # In case the hash string is malformed
            
        # Fallback: Check if password was stored in plain text
        is_plain_text = (user.password == password)
        if is_valid_hash or is_plain_text:
            # Migrate plain text to hashed password
            if is_plain_text:
                user.password = generate_password_hash(password, method='pbkdf2:sha256')
                db.session.commit()

            access_token = create_access_token(identity=username)
            refresh_token = create_refresh_token(identity=username)
            response = make_response(jsonify({"msg": "Login successful"}))
            
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)

            return response
    
    return jsonify({"msg": "Невірний логін або пароль"}), 401

@api_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    secret_code = data.get('secret_code')
    
    if not username or not password:
        return jsonify({"msg": "Логін та пароль обов'язкові"}), 400
        
    if secret_code != current_app.config["ADMIN_SECRET_CODE"]:
        return jsonify({"msg": "Невірний секретний код адміністратора"}), 403
        
    user = User.query.filter_by(username=username).first()
    new_hash = generate_password_hash(password, method='pbkdf2:sha256')

    if user:
        user.password = new_hash
        db.session.commit()
        return jsonify({"msg": "Пароль існуючого адміністратора оновлено"}), 200
        
    new_user = User(
        username=username,
        password=new_hash
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"msg": "Адміністратор успішно створений"}), 201

@api_bp.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@api_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()

    access_token = create_access_token(identity=current_user)
    refresh_token = create_refresh_token(identity=current_user)

    response = jsonify({"message": "Tokens refreshed"})

    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    
    return response

@api_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    unique_filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"

    upload_file=os.path.join(
        current_app.config['TEMP_UPLOAD_FOLDER'],
        unique_filename
    )

    file.save(upload_file)

    return jsonify({'url': f'/static/temp/{unique_filename}'}), 201

def promote_file(temp_url):
    if not temp_url or '/static/temp/' not in temp_url:
        return temp_url

    filename = temp_url.split('/')[-1]

    temp_path = os.path.join(
        current_app.config['TEMP_UPLOAD_FOLDER'],
        filename
    )

    perm_path = os.path.join(
        current_app.config['UPLOAD_FOLDER'],
        filename
    )

    if os.path.exists(temp_path):
        shutil.move(temp_path, perm_path)

    return f'/static/uploads/{filename}'

@api_bp.route('/cleanup-temp', methods=['POST'])
@jwt_required()
def cleanup_temp():
    data = request.json
    url = data.get('url')

    if not url or '/static/temp/' not in url:
        return jsonify({'message': 'Invalid url'}), 400

    filename = url.split('/')[-1]

    file_path = os.path.join(
        current_app.config['TEMP_UPLOAD_FOLDER'],
        filename
    )

    if os.path.exists(file_path):
        os.remove(file_path)

    return jsonify({'message': 'Deleted'})

# Check Database Connection
@api_bp.route('/check_connection')
def check_connection():
    try:
        # Explicitly declare the SQL query as text()
        result = db.session.execute(text("SELECT 1"))
        if result.fetchone():
            return jsonify({"message": "Connection to the database is successful!"}), 200
    except Exception as e:
        return jsonify({"error": f"Database connection failed: {str(e)}"}), 500

# Events
@api_bp.route('/events', methods=['POST'])
@jwt_required()
def add_event():
    data = request.json
    
    if not data or not 'title' in data or not 'year' in data:
        return jsonify({"error": "Title and Year are required"}), 400

    media_url = promote_file(data.get('media_url', ''))

    new_event = Event(
        title=data['title'],
        year=data['year'],
        short_description=data.get('short_description', ''),
        full_description=data.get('full_description', ''),
        category=data['category'],
        media_url=media_url
    )
    
    db.session.add(new_event)
    db.session.flush()

    for url in data.get('gallery', []):
        promoted_url = promote_file(url)
        db.session.add(EventPhoto(url=promoted_url, event_id=new_event.id))

    for v in data.get('videos', []):
        db.session.add(EventVideo(
            video_url=v.get('url'),
            caption=v.get('caption', ''), 
            event_id=new_event.id
        ))

    for d in data.get('documents', []):
        db.session.add(EventDocument(
            title=d.get('title'), 
            file_url=d.get('url'), 
            event_id=new_event.id
        ))

    db.session.commit()

    return jsonify(new_event.to_dict()), 201

@api_bp.route('/events', methods=['GET'])
@jwt_required()
def get_events():
    year = request.args.get('year')
    category = request.args.get('category')
    search = request.args.get('search')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 10, type=int)

    query = Event.query

    if year:
        query = query.filter_by(year=year)
    if category:
        query = query.filter_by(category=category)
    if search:
        query = query.filter(Event.title.ilike(f'%{search}%'))

    query = query.options(
        selectinload(Event.photos),
        selectinload(Event.videos),
        selectinload(Event.documents)
    )

    pagination = query.order_by(Event.year.desc(), Event.id.desc()).paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "events": [event.to_dict() for event in pagination.items],
        "categories": CATEGORIES,
        "page": page,
        "total_pages": pagination.pages,
        "total": pagination.total
    }), 200

@api_bp.route('/events/<int:id>', methods=['PUT'])
@jwt_required()
def update_event(id):
    event = Event.query.get(id)
    
    if not event:
        return jsonify({"message": "Event not found"}), 404

    data = request.json
    
    event.title = data.get('title', event.title)
    event.year = data.get('year', event.year)
    event.short_description = data.get('short_description', data.get('description', event.short_description))
    event.full_description = data.get('full_description', data.get('description', event.full_description))
    event.category = data.get('category', event.category)
    event.media_url = promote_file(data.get('media_url', event.media_url))

    if 'gallery' in data:
        EventPhoto.query.filter_by(event_id=id).delete()
        for url in data['gallery']:
            promoted_url = promote_file(url)
            db.session.add(EventPhoto(
                url=promoted_url,
                event_id=event.id
            ))

    if 'videos' in data:
         EventVideo.query.filter_by(event_id=id).delete()
         for v in data['videos']:
            db.session.add(EventVideo(
                video_url=v.get('url'), 
                caption=v.get('caption', ''),
                event_id=event.id
            ))

    if 'documents' in data:
         EventDocument.query.filter_by(event_id=id).delete()
         for d in data['documents']:
            db.session.add(EventDocument(
                title=d.get('title'),
                file_url=d.get('url'),
                event_id=event.id
            ))

    db.session.commit()
    return jsonify(event.to_dict())

@api_bp.route('/events/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_event(id):
    event = Event.query.get(id)
    
    if not event:
        return jsonify({"message": "Event not found"}), 404

    db.session.delete(event)
    db.session.commit()

    return jsonify({"message": "Event deleted successfully"})

@api_bp.route('/events/<int:id>', methods=['GET'])
@jwt_required()
def get_event(id):
    event = Event.query.get_or_404(id)
    return jsonify(event.to_dict())

# Persons
@api_bp.route('/persons', methods=['GET'])
@jwt_required()
def get_persons():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 10, type=int)
    pagination = Person.query.order_by(Person.id.desc()).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "persons": [p.to_dict() for p in pagination.items],
        "page": page,
        "total_pages": pagination.pages,
        "total": pagination.total
    })

@api_bp.route('/persons', methods=['POST'])
@jwt_required()
def add_person():
    data = request.json
    
    if not data or not 'name' in data:
        return jsonify({"error": "Name is required"}), 400

    new_person = Person(
        name=data['name'],
        role=data.get('role', 'Випускник'),
        photo_url=data.get('photo_url', ''),
        short_bio=data.get('short_bio', ''),
        full_bio=data.get('full_bio', ''),
        life_years=data.get('life_years', ''),
        profession_sphere=data.get('profession_sphere', '')
    )

    db.session.add(new_person)
    db.session.commit()

    return jsonify(new_person.to_dict()), 201

@api_bp.route('/persons/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_person(id):
    person = Person.query.get(id)
    if not person:
        return jsonify({"message": "Person not found"}), 404
        
    db.session.delete(person)
    db.session.commit()
    return jsonify({"message": "Person deleted"})

@api_bp.route('/persons/<int:id>', methods=['PUT'])
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

@api_bp.route('/persons/<int:id>', methods=['GET'])
@jwt_required()
def get_person(id):
    person = Person.query.get_or_404(id)
    return jsonify(person.to_dict())

# Documents
@api_bp.route('/documents', methods=['GET'])
@jwt_required()
def get_documents():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 10, type=int)
    pagination = Document.query.order_by(Document.id.desc()).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "documents": [d.to_dict() for d in pagination.items],
        "categories": CATEGORIES,
        "page": page,
        "total_pages": pagination.pages,
        "total": pagination.total
    })

@api_bp.route('/documents/<int:id>', methods=['GET'])
@jwt_required()
def get_document(id):
    doc = Document.query.get_or_404(id)
    return jsonify(doc.to_dict())

@api_bp.route('/documents', methods=['POST'])
@jwt_required()
def add_document():
    data = request.json
    
    if not data or not 'title' in data or not 'file_url' in data:
        return jsonify({"error": "Title and File URL are required"}), 400

    file_url = promote_file(data['file_url'])

    new_doc = Document(
        title=data['title'],
        subtitle=data.get('subtitle', ''),
        category=data.get('category', ''),
        year=data.get('year'),
        file_type=data.get('file_type', ''),
        file_url=file_url
    )

    db.session.add(new_doc)
    db.session.commit()

    return jsonify(new_doc.to_dict()), 201

@api_bp.route('/documents/<int:id>', methods=['PUT'])
@jwt_required()
def update_document(id):
    doc = Document.query.get_or_404(id)
    data = request.json
    
    doc.title = data.get('title', doc.title)
    doc.subtitle = data.get('subtitle', doc.subtitle)
    doc.category = data.get('category', doc.category)
    doc.year = data.get('year', doc.year)
    doc.file_type = data.get('file_type', doc.file_type)
    
    if 'file_url' in data and data['file_url'] != doc.file_url:
        doc.file_url = promote_file(data['file_url'])

    db.session.commit()
    return jsonify(doc.to_dict())

@api_bp.route('/documents/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_document(id):
    doc = Document.query.get(id)
    if not doc:
        return jsonify({"message": "Document not found"}), 404
        
    db.session.delete(doc)
    db.session.commit()
    return jsonify({"message": "Document deleted"})

# Gallery
@api_bp.route('/gallery/albums', methods=['GET'])
@jwt_required()
def get_gallery_albums():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 9, type=int)
    
    query = GalleryAlbum.query.options(selectinload(GalleryAlbum.photos))
    pagination = query.order_by(GalleryAlbum.id.desc()).paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        "albums": [a.to_dict() for a in pagination.items],
        "page": page,
        "total_pages": pagination.pages,
        "total": pagination.total
    })

@api_bp.route('/gallery/albums', methods=['POST'])
@jwt_required()
def add_gallery_album():
    data = request.json
    if not data or not 'title' in data:
        return jsonify({"error": "Title is required"}), 400

    new_album = GalleryAlbum(
        title=data['title'],
        description=data.get('description', ''),
        cover_url=promote_file(data.get('cover_url', ''))
    )
    db.session.add(new_album)
    db.session.flush()

    for photo_url in data.get('photos', []):
        promoted_url = promote_file(photo_url)
        photo = GalleryPhoto(url=promoted_url, album_id=new_album.id)
        db.session.add(photo)

    db.session.commit()
    return jsonify(new_album.to_dict()), 201

@api_bp.route('/gallery/albums/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_gallery_album(id):
    album = GalleryAlbum.query.get_or_404(id)
    db.session.delete(album)
    db.session.commit()
    return jsonify({"message": "Album deleted"})

@api_bp.route('/gallery/video_albums', methods=['GET'])
@jwt_required()
def get_video_albums():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 9, type=int)
    
    query = GalleryVideoAlbum.query.options(selectinload(GalleryVideoAlbum.videos))
    pagination = query.order_by(GalleryVideoAlbum.id.desc()).paginate(page=page, per_page=per_page, error_out=False)

    result = []
    for album in pagination.items:
        album_dict = {
            "id": album.id,
            "title": album.title,
            "description": album.description,
            "cover_url": album.cover_url,
            "videos": [{"url": v.video_url, "caption": v.caption} for v in album.videos]
        }
        result.append(album_dict)
    
    return jsonify({
        "video_albums": result,
        "page": page,
        "total_pages": pagination.pages,
        "total": pagination.total
    })

@api_bp.route('/gallery/video_albums', methods=['POST'])
@jwt_required()
def add_video_album():
    data = request.json
    if not data or not 'title' in data:
        return jsonify({"error": "Title is required"}), 400

    new_album = GalleryVideoAlbum(
        title=data['title'],
        description=data.get('description', ''),
        cover_url=promote_file(data.get('cover_url', ''))
    )
    db.session.add(new_album)
    db.session.flush()

    for v_data in data.get('videos', []):
        video = GalleryVideo(
            video_url=promote_file(v_data.get('url')), 
            caption=v_data.get('caption', ''), 
            album_id=new_album.id
        )
        db.session.add(video)

    db.session.commit()

    return jsonify({
        "id": new_album.id,
        "title": new_album.title,
        "description": new_album.description,
        "cover_url": new_album.cover_url,
        "videos": [{"url": v.video_url, "caption": v.caption} for v in new_album.videos]
    }), 201

@api_bp.route('/gallery/video_albums/<int:id>', methods=['PUT'])
@jwt_required()
def update_video_album(id):
    album = GalleryVideoAlbum.query.get_or_404(id)
    data = request.json

    # Update main fields
    album.title = data.get('title', album.title)
    album.description = data.get('description', album.description)

    if 'cover_url' in data and data['cover_url'] != album.cover_url:
        album.cover_url = promote_file(data['cover_url'])

    # Update videos if provided
    if 'videos' in data:
        # Remove old videos
        GalleryVideo.query.filter_by(album_id=id).delete()

        # Add new ones
        for v_data in data['videos']:
            video = GalleryVideo(
                video_url=promote_file(v_data.get('url')),
                caption=v_data.get('caption', ''),
                album_id=id
            )
            db.session.add(video)

    db.session.commit()

    return jsonify({
        "id": album.id,
        "title": album.title,
        "description": album.description,
        "cover_url": album.cover_url,
        "videos": [{"url": v.video_url, "caption": v.caption} for v in album.videos]
    })

@api_bp.route('/gallery/video_albums/<int:id>', methods=['GET'])
@jwt_required()
def get_album(id):
    album = GalleryVideoAlbum.query.get_or_404(id)

    return jsonify({
        "id": album.id,
        "title": album.title,
        "description": album.description,
        "cover_url": album.cover_url,
        "videos": [
            {
                "id": v.id,
                "url": v.video_url,
                "caption": v.caption
            }
            for v in album.videos
        ]
    })

@api_bp.route('/gallery/video_albums/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_video_album(id):
    album = GalleryVideoAlbum.query.get_or_404(id)
    db.session.delete(album)
    db.session.commit()
    return jsonify({"message": "Video Album deleted"})