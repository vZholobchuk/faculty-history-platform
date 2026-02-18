from app import app
from models import db, Event, EventPhoto, EventVideo, EventDocument, Person, GalleryAlbum, GalleryPhoto, GalleryVideoAlbum, GalleryVideo

def seed_database():
    with app.app_context():
        # WARNING: This wipes the DB. In production, use migrations.
        db.drop_all()
        db.create_all()

        # --- Секція Подій (Events) ---
        print("Seeding Events...")
        event1 = Event(
            title="Заснування факультету",
            year=1995,
            short_description="Урочисте підписання наказу про створення факультету.",
            full_description="""Це був історичний день, коли було підписано наказ №145 про заснування нового факультету. 
            Деканом було призначено професора Іваненка. На урочистостях були присутні ректор, мер міста та почесні гості. 
            Студенти підготували святковий концерт, а викладачі провели першу лекцію на тему "Історія нашого краю".""",
            category="education",
            media_url="https://static4.depositphotos.com/1000441/390/i/450/depositphotos_3900320-stock-photo-iron-chain-with-red-link.jpg"
        )
        db.session.add(event1)
        db.session.commit() # Save to get ID

        photo1 = EventPhoto(url="https://static4.depositphotos.com/1000441/390/i/450/depositphotos_3900320-stock-photo-iron-chain-with-red-link.jpg", event_id=event1.id)
        db.session.add(photo1)
        
        # Додаткові фото для тесту галереї
        photo1_2 = EventPhoto(url="https://static4.depositphotos.com/1000441/390/i/450/depositphotos_3900320-stock-photo-iron-chain-with-red-link.jpg", event_id=event1.id)
        photo1_3 = EventPhoto(url="https://pnu.edu.ua/wp-content/uploads/2021/08/IMG_9918.jpg", event_id=event1.id)
        db.session.add(photo1_2)
        db.session.add(photo1_3)

        video1 = EventVideo(video_url="https://www.youtube.com/watch?v=Getj_Fk68C8", caption="Історія ПНУ", event_id=event1.id)
        db.session.add(video1)
        doc1 = EventDocument(title="Наказ №1", file_url="https://example.com/order.pdf", event_id=event1.id)
        db.session.add(doc1)


        event2 = Event(
            title="Наукова конференція",
            year=2010,
            short_description="Міжнародна конференція істориків.",
            full_description="""Вперше в стінах нашого університету відбулася масштабна конференція за участі науковців з 15 країн світу. 
            Обговорювалися проблеми збереження історичної спадщини в умовах глобалізації. 
            Було презентовано понад 100 доповідей.""",
            category="science",
            media_url="" 
        )
        db.session.add(event2)
        db.session.commit()

        video2 = EventVideo(video_url="https://www.youtube.com/watch?v=LXb3EKWsInQ", caption="Виступ", event_id=event2.id)
        db.session.add(video2)


        event3 = Event(
            title="Хакатон NASA",
            year=2023,
            short_description="Студенти перемогли у конкурсі NASA.",
            full_description="""Команда студентів 3-го курсу "History Hackers" розробила унікальний проект візуалізації історичних даних, 
            який вразив журі конкурсу NASA Space Apps Challenge. Вони отримали грант на подальшу розробку та стажування в США.""",
            category="students",
            media_url="https://example.com/nasa.jpg"
        )
        db.session.add(event3)
        db.session.commit()

        doc2 = EventDocument(title="Результати", file_url="https://example.com/results.pdf", event_id=event3.id)
        db.session.add(doc2)
        
        # Додамо фото і для Хакатону, щоб було дві галереї
        photo3_1 = EventPhoto(url="https://www.spaceappschallenge.org/static/images/spaceapps-logo-2023.png", event_id=event3.id)
        photo3_2 = EventPhoto(url="https://www.spaceappschallenge.org/static/images/participant-cert.png", event_id=event3.id)
        db.session.add(photo3_1)
        db.session.add(photo3_2)


        event4 = Event(
            title="Зустріч випускників",
            year=2024,
            short_description="Традиційна зустріч випускників усіх років.",
            full_description="""Чудовий вечір спогадів, який зібрав випускників факультету за останні 30 років. 
            Було багато сміху, обіймів та планів на майбутнє. Створено фонд підтримки факультету.""",
            category="community",
            media_url=""
        )
        db.session.add(event4)

        
        # --- Секція Персон (Persons) ---
        print("Seeding Persons...")
        person1 = Person(
            name="Василь Стефаник",
            role="Патрон університету",
            photo_url="https://stefanyk.pnu.edu.ua/wp-content/uploads/sites/11/2017/03/stefanyk.jpg",
            short_bio="Класик української літератури, майстер психологічної новели, громадський діяч.",
            full_bio="""Василь Стефаник — видатний український письменник, майстер експресіоністичної новели, громадський діяч, політик. 
            Депутат Австрійського парламенту від Королівства Галичини та Володимирії.
            
            Однією з найвідоміших збірок є «Синя книжечка», яка принесла йому визнання. Його творчість глибоко психологічна, 
            зосереджена на трагедії селянського життя. Університет з гордістю носить його ім'я.""",
            life_years="1871–1936",
            profession_sphere="Література, Політика",
            faculty="Почесний патрон"
        )
        
        # ... (rest of persons) 
        person2 = Person(
            name="Грабовецький Володимир Васильович",
            role="Видатний історик",
            photo_url="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Hrabovetskyi.jpg/250px-Hrabovetskyi.jpg",
            short_bio="Український історик, доктор історичних наук, професор. Дослідник опришківського руху.",
            full_bio="""Володимир Грабовецький — відомий український вчений-історик, доктор історичних наук, професор, 
            заслужений діяч науки і техніки України. Автор понад 1000 наукових праць, серед яких фундаментальна монографія про Олексу Довбуша 
            та історію Івано-Франківська (Станіславова).
            
            Багато років очолював кафедру історії України. Його лекції завжди збирали повні аудиторії студентів.""",
            life_years="1928–2015",
            profession_sphere="Історія України, Краєзнавство",
            faculty="Факультет історії, політології і міжнародних відносин"
        )
        
        person3 = Person(
            name="Професор Шевченко Т.Г. (Приклад)",
            role="Завідувач кафедри (Приклад)",
            photo_url="", # Без фото для тесту заглушки
            short_bio="Вигадана персона для демонстрації. Засновник сучасної методики викладання.",
            full_bio="""Це тестовий запис для перевірки відображення персони без фотографії. 
            Тут описується його великий внесок у розвиток кафедри, сотні наукових праць та виховання плеяди молодих науковців.
            
            Він запровадив інноваційні методи навчання, які використовуються досі.""",
            life_years="1960–...",
            profession_sphere="Методика викладання",
            faculty="Педагогічний факультет"
        )

        db.session.add(person1)
        db.session.add(person2)
        db.session.add(person3)

        # --- Секція Галереї (Independent Albums - PHOTOS) ---
        print("Seeding Gallery Photos...")
        
        album1 = GalleryAlbum(
            title="Студентське життя 2023",
            description="Як наші студенти навчаються та відпочивають. Добірка найкращих моментів року.",
            cover_url="https://pnu.edu.ua/wp-content/uploads/2023/09/DSC_0055.jpg"
        )
        db.session.add(album1)
        db.session.commit()
        
        # Фото для альбому 1
        gp1 = GalleryPhoto(url="https://pnu.edu.ua/wp-content/uploads/2023/09/DSC_0055.jpg", album_id=album1.id)
        gp2 = GalleryPhoto(url="https://pnu.edu.ua/wp-content/uploads/2023/09/DSC_0088.jpg", album_id=album1.id)
        gp3 = GalleryPhoto(url="https://pnu.edu.ua/wp-content/uploads/2023/09/DSC_0120.jpg", album_id=album1.id)
        db.session.add(gp1)
        db.session.add(gp2)
        db.session.add(gp3)


        album2 = GalleryAlbum(
            title="Архітектура університету",
            description="Історичні корпуси та сучасні аудиторії нашого університету.",
            cover_url="https://pnu.edu.ua/wp-content/themes/pnu/assets/images/header-bg.jpg"
        )
        db.session.add(album2)
        db.session.commit()

        # Фото для альбому 2
        gp2_1 = GalleryPhoto(url="https://pnu.edu.ua/wp-content/themes/pnu/assets/images/header-bg.jpg", album_id=album2.id)
        gp2_2 = GalleryPhoto(url="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Pnu_main_building.jpg/1200px-Pnu_main_building.jpg", album_id=album2.id)
        db.session.add(gp2_1)
        db.session.add(gp2_2)

        # --- Секція Галереї (Independent Albums - VIDEOS) ---
        print("Seeding Gallery Videos...")

        valbum1 = GalleryVideoAlbum(
            title="Історія університету (Відео)",
            description="Архівні відеоматеріали та інтерв'ю з видатними випускниками.",
            cover_url="https://pnu.edu.ua/wp-content/uploads/2020/05/img_20200514_111146-1024x768.jpg" # Reuse image as cover
        )
        db.session.add(valbum1)
        db.session.commit()

        gv1 = GalleryVideo(video_url="https://www.youtube.com/watch?v=Getj_Fk68C8", caption="Документальний фільм про ПНУ", album_id=valbum1.id)
        gv2 = GalleryVideo(video_url="https://www.youtube.com/watch?v=LXb3EKWsInQ", caption="Святкування 80-річчя", album_id=valbum1.id)
        db.session.add(gv1)
        db.session.add(gv2)

        valbum2 = GalleryVideoAlbum(
            title="Студентські проекти",
            description="Відео-презентації найкращих студентських проектів IT та гуманітарного напрямку.",
            cover_url="https://via.placeholder.com/400x300?text=Student+Projects"
        )
        db.session.add(valbum2)
        db.session.commit()

        gv2_1 = GalleryVideo(video_url="https://www.youtube.com/watch?v=L_jWHffIx5E", caption="Проект 'Цифрова історія'", album_id=valbum2.id)
        db.session.add(gv2_1)

        db.session.commit()
        print("База даних успішно наповнена всіма даними!")

if __name__ == "__main__":
    seed_database()