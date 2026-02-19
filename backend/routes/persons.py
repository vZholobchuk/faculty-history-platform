from flask import Blueprint, render_template
from ..models import Person

persons_bp = Blueprint("person", __name__)

@persons_bp.route('/persons')
def persons():
    persons = Person.query.all()
    # Check if DB is unexpectedly empty and prevent errors by passing empty list if needed, 
    # but ideally seed data should handle this.
    return render_template('persons.html', persons=persons)