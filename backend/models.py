from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# --- КОРИСТУВАЧІ (Admin Auth) ---
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username
        }

# --- ГЛОБАЛЬНА ГАЛЕРЕЯ (ФОТО) ---
class GalleryAlbum(db.Model):
    __tablename__ = 'gallery_albums'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    cover_url = db.Column(db.String(300), nullable=False)
    
    photos = db.relationship('GalleryPhoto', backref='album', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "cover_url": self.cover_url,
            "photos": [photo.url for photo in self.photos]
        }

class GalleryPhoto(db.Model):
    __tablename__ = 'gallery_photos'
    
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(300), nullable=False)
    album_id = db.Column(db.Integer, db.ForeignKey('gallery_albums.id'), nullable=False)

# --- ГЛОБАЛЬНА ГАЛЕРЕЯ (ВІДЕО) ---
class GalleryVideoAlbum(db.Model):
    __tablename__ = 'gallery_video_albums'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    cover_url = db.Column(db.String(300), nullable=False) # Обкладинка для відео-альбому
    
    videos = db.relationship('GalleryVideo', backref='album', lazy=True, cascade="all, delete-orphan")

class GalleryVideo(db.Model):
    __tablename__ = 'gallery_videos'
    
    id = db.Column(db.Integer, primary_key=True)
    video_url = db.Column(db.String(500), nullable=False)
    caption = db.Column(db.String(200), nullable=True)
    album_id = db.Column(db.Integer, db.ForeignKey('gallery_video_albums.id'), nullable=False)


# --- Старі моделі (TIMELINE) ---

class EventPhoto(db.Model):
    __tablename__ = 'event_photos'
    
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(300), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)

class EventVideo(db.Model):
    __tablename__ = 'event_videos'
    
    id = db.Column(db.Integer, primary_key=True)
    video_url = db.Column(db.String(500), nullable=False) 
    caption = db.Column(db.String(200), nullable=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)

class EventDocument(db.Model):
    __tablename__ = 'event_documents'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    file_url = db.Column(db.String(300), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)

class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    short_description = db.Column(db.String(500), nullable=True)
    full_description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), nullable=False)
    media_url = db.Column(db.String(300), nullable=True)
    
    photos = db.relationship('EventPhoto', backref='event', lazy=True, cascade="all, delete-orphan")
    videos = db.relationship('EventVideo', backref='event', lazy=True, cascade="all, delete-orphan")
    documents = db.relationship('EventDocument', backref='event', lazy=True, cascade="all, delete-orphan")
    
    @property
    def description(self):
         return self.short_description if self.short_description else self.full_description

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "year": self.year,
            "short_description": self.short_description,
            "full_description": self.full_description,
            "description": self.description,
            "category": self.category,
            "media_url": self.media_url,
            "gallery": [photo.url for photo in self.photos],
            "videos": [{"url": v.video_url, "caption": v.caption} for v in self.videos],
            "documents": [{"title": d.title, "url": d.file_url} for d in self.documents]
        }
    
class Person(db.Model):
    __tablename__ = 'persons'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    photo_url = db.Column(db.String(300), nullable=True)
    short_bio = db.Column(db.String(500), nullable=True)
    full_bio = db.Column(db.Text, nullable=True)
    life_years = db.Column(db.String(50), nullable=True)
    profession_sphere = db.Column(db.String(150), nullable=True)
    faculty = db.Column(db.String(150), nullable=True)

    @property
    def bio(self):
        return self.short_bio if self.short_bio else self.full_bio

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role,
            "photo_url": self.photo_url,
            "short_bio": self.short_bio,
            "full_bio": self.full_bio,
            "bio": self.bio,
            "life_years": self.life_years,
            "profession_sphere": self.profession_sphere,
            "faculty": self.faculty
        }    
    
class Document(db.Model):
    __tablename__ = 'documents'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    file_url = db.Column(db.String(300), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "file_url": self.file_url
        }    