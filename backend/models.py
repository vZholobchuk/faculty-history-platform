from flask_sqlalchemy import SQLAlchemy

# Ініціалізуємо базу даних
db = SQLAlchemy()

# Описуємо таблицю "Події" (Events)
class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)  # Назва події
    year = db.Column(db.Integer, nullable=False)       # Рік
    description = db.Column(db.Text, nullable=True)    # Опис
    category = db.Column(db.String(50), nullable=False) # Категорія (наука, спорт...)
    media_url = db.Column(db.String(300), nullable=True) # Посилання на фото/відео
    
    def to_dict(self):
        """Метод, щоб зручно віддавати дані у форматі JSON для фронтенду"""
        return {
            "id": self.id,
            "title": self.title,
            "year": self.year,
            "description": self.description,
            "category": self.category,
            "media_url": self.media_url
        }
    