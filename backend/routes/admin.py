from flask import Blueprint, render_template
from ..constants import CATEGORIES, FILE_TYPES

admin_bp = Blueprint("admin", __name__)

@admin_bp.route('/admin')
def admin():
    return render_template('admin.html', CATEGORIES=CATEGORIES, FILE_TYPES=FILE_TYPES)
