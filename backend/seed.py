from app import app
from models import db, Event

# Цей скрипт запускається один раз, щоб наповнити базу
def seed_database():
    with app.app_context():
        # Спершу очистимо таблицю, щоб не було дублікатів (обережно з цим на реальному проекті!)
        db.drop_all()
        db.create_all()

        # Створюємо тестові події згідно з вашим PDF (Освіта, Наука)
        event1 = Event(
            title="Заснування факультету",
            year=1995,
            description="Урочисте підписання наказу про створення факультету.",
            category="освіта",
            media_url="https://example.com/photo1995.jpg"
        )

        event2 = Event(
            title="Відкриття лабораторії робототехніки",
            year=2010,
            description="Закуплено нове обладнання та відкрито аудиторію 305.",
            category="наука",
            media_url="https://example.com/robot.jpg"
        )
        
        event3 = Event(
            title="Перемога у хакатоні NASA",
            year=2023,
            description="Студенти 3-го курсу зайняли перше місце.",
            category="студенти",
            media_url="https://example.com/nasa.jpg"
        )

        # Додаємо в чергу на запис
        db.session.add(event1)
        db.session.add(event2)
        db.session.add(event3)

        # Зберігаємо зміни (Commit transaction)
        db.session.commit()
        print("База даних успішно наповнена!")

if __name__ == "__main__":
    seed_database()