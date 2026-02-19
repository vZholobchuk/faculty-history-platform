from flask import Blueprint, render_template
from ..models import Person

person_detail_bp = Blueprint("person_deatils", __name__)

@person_detail_bp.route('/persons/<int:id>')
def person_detail(id):
    person = Person.query.get_or_404(id)
    return render_template('person_detail.html', person=person)