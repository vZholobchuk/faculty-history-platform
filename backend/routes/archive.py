from flask import Blueprint, url_for, request, render_template
from ..constants import CATEGORIES, FILE_TYPES

archive_bp = Blueprint("archive", __name__)

@archive_bp.route('/archive')
def archive():
    archive=[
        {
            "title": "Наказ про заснування факультету",
            "subtitle": "Оригінальний відсканований примірник",
            "category": "leadership",
            "year": 1965,
            "file_type": "pdf",
            "file_url": url_for("static", filename="html/text.pdf")
        },
        {
            "title": "Протокол Вченої ради №12",
            "subtitle": "Обговорення нових програм навчання",
            "category": "science",
            "year": 1982,
            "file_type": "docx",
            "file_url": url_for("static", filename="html/text.docx")
        },
        {
            "title": "Перший диплом випускника ПНУ",
            "subtitle": "Архівний зразок диплома спеціаліста",
            "category": "students",
            "year": 1970,
            "file_type": "jpg",
            "file_url": url_for("static", filename="html/text.jpg")
        }
    ]

    query = request.args.get("search", "").lower()
    category = request.args.get("category", "")
    year = request.args.get("year", type=int)
    page = request.args.get("page", 1, type=int)
    per_page = 2

    filtered_archive = []

    for item in archive:
        if query and query not in item["title"].lower() and query not in item["subtitle"].lower():
            continue

        if category and category != item["category"]:
            continue

        if year:
            try:
                if int(year) != item["year"]:
                    continue
            except ValueError:
                pass
        filtered_archive.append(item)
            
    total_items = len(filtered_archive)
    total_pages = (total_items + per_page - 1) // per_page

    start = (page - 1) * per_page
    end = start + per_page
    paginated_archive = filtered_archive[start:end]

    return render_template('archive.html', 
                    CATEGORIES=CATEGORIES, 
                    FILE_TYPES=FILE_TYPES, 
                    archive=paginated_archive,
                    query=query,
                    selected_year=year,
                    selected_category=category,
                    current_page=page,
                    per_page=per_page,
                    total_pages=total_pages
    )
