from flask import Blueprint, request, render_template
from ..models import db, Event
from ..constants import CATEGORIES

timeline_bp = Blueprint("timeline", __name__)

@timeline_bp.route('/timeline')
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
                Event(year=1940, title="Заснування інституту", category="education", short_description="Утворено Станіславський учительський інститут. Це початкова точка розвитку вищої освіти в нашому регіоні."),
                Event(year=1991, title="Статус університету", category="education", short_description="На базі педагогічного інституту створено Прикарпатський університет. Важлива віха в історії закладу."),
                Event(year=2004, title="Національний статус", category="science", short_description="Університету присвоєно статус національного за вагомий внесок у розвиток науки та культури України."),
                Event(year=2023, title="Відкриття IT-хабу", category="tech_innovation", short_description="Створення сучасного коворкінгу для студентів IT-спеціальностей на базі факультету.")
            ]
            for event in default_events:
                db.session.add(event)
            db.session.commit()
            events = Event.query.order_by(Event.year.asc()).all()

    return render_template('timeline.html', events=events, CATEGORIES=CATEGORIES)