from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Таблиця для фотографій галереї
class EventPhoto(db.Model):
    __tablename__ = 'event_photos'
    
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(300), nullable=False) # Посилання на фото
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False) # Зв'язок з подією

class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), nullable=False)
    
    media_url = db.Column(db.String(300), nullable=True)
    
    photos = db.relationship('EventPhoto', backref='event', lazy=True, cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "year": self.year,
            "description": self.description,
            "category": self.category,
            "media_url": self.media_url,
            "gallery": [photo.url for photo in self.photos]
        }
    
class Person(db.Model):
    __tablename__ = 'persons'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)   # ПІБ
    role = db.Column(db.String(100), nullable=False)   # Хто це? (напр. "Декан 2010-2020")
    bio = db.Column(db.Text, nullable=True)            # Біографія
    photo_url = db.Column(db.String(300), nullable=True) # Фото

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role,
            "bio": self.bio,
            "photo_url": self.photo_url
        }    
    
#Документи
class Document(db.Model):
    __tablename__ = 'documents'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)    # Назва (напр. "Наказ №5")
    category = db.Column(db.String(100), nullable=False) # Категорія (напр. "Нормативні акти")
    file_url = db.Column(db.String(300), nullable=False) # Посилання на PDF файл

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "file_url": self.file_url
        }    