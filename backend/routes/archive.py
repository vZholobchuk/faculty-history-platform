from flask import Blueprint, request, render_template
from ..constants import CATEGORIES, FILE_TYPES
from ..models import Document

archive_bp = Blueprint("archive", __name__)

@archive_bp.route('/archive')
def archive():
    query = request.args.get("search", "").lower()
    category = request.args.get("category", "")
    year_str = request.args.get("year", "")
    page = request.args.get("page", 1, type=int)
    per_page = 10

    db_query = Document.query

    if query:
        search_filter = Document.title.ilike(f"%{query}%") | Document.subtitle.ilike(f"%{query}%")
        db_query = db_query.filter(search_filter)

    if category:
        db_query = db_query.filter(Document.category == category)

    if year_str:
        try:
            year = int(year_str)
            db_query = db_query.filter(Document.year == year)
        except ValueError:
            pass
            
    # MSSQL requires explicit order_by before offset/limit (paginate)
    db_query = db_query.order_by(Document.year.desc(), Document.id.desc())
    pagination = db_query.paginate(page=page, per_page=per_page, error_out=False)
    
    paginated_archive = pagination.items
    total_pages = pagination.pages

    return render_template('archive.html', 
                    CATEGORIES=CATEGORIES, 
                    FILE_TYPES=FILE_TYPES, 
                    archive=paginated_archive,
                    query=query,
                    selected_year=year_str,
                    selected_category=category,
                    current_page=page,
                    per_page=per_page,
                    total_pages=total_pages
    )
