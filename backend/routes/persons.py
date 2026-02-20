from flask import Blueprint, render_template
from ..models import Person

persons_bp = Blueprint("persons", __name__)

@persons_bp.route('/persons')
def persons():
    persons = Person.query.all()
    
    return render_template('persons.html', persons=persons)