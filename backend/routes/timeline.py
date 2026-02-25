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
    
    return render_template('timeline.html', events=events, CATEGORIES=CATEGORIES)