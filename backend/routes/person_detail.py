from flask import Blueprint, render_template
from ..models import Person

person_detail_bp = Blueprint("person_detail", __name__)

@person_detail_bp.route('/persons_detail/<int:person_id>')
def person_detail(person_id):
    person = Person.query.get_or_404(person_id)
    return render_template('person_detail.html', person=person)