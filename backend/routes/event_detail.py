from flask import Blueprint, render_template
from ..models import Event
from ..constants import CATEGORIES

event_detail_bp = Blueprint("event_detail", __name__)

@event_detail_bp.route('/event/<int:id>')
def event_detail(id):
    event = Event.query.get_or_404(id)
    return render_template('event_detail.html', event=event, CATEGORIES=CATEGORIES)