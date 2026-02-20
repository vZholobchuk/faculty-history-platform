from flask import Flask
from flask_cors import CORS
from .models import db
import os
from flask_jwt_extended import JWTManager
from .config import Config
from datetime import timedelta

def create_app():
    app = Flask(
        __name__,
        template_folder="../frontend/templates",
        static_folder="../frontend/static"
    )

    app.config.from_object(Config)

    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=7)

    CORS(app, supports_credentials=True)

    app.config['JWT_SECRET_KEY'] = 'super-secret-key-change-me' 
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.config["JWT_ACCESS_COOKIE_NAME"] = "access_token"
    app.config["JWT_COOKIE_SECURE"] = False
    app.config["JWT_COOKIE_SAMESITE"] = "Lax"

    app.config["JWT_ACCESS_COOKIE_PATH"] = "/"
    app.config["JWT_REFRESH_COOKIE_PATH"] = "/"

    app.config["JWT_COOKIE_CSRF_PROTECT"] = False
    jwt = JWTManager(app)

    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'static', 'uploads')
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///faculty.db"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    with app.app_context():
        db.create_all()
    
    from .routes.home import home_bp
    app.register_blueprint(home_bp)

    from .routes.timeline import timeline_bp
    app.register_blueprint(timeline_bp)

    from .routes.event_detail import event_detail_bp
    app.register_blueprint(event_detail_bp)

    from .routes.gallery import gallery_bp
    app.register_blueprint(gallery_bp)

    from .routes.persons import persons_bp
    app.register_blueprint(persons_bp)

    from .routes.person_detail import person_detail_bp
    app.register_blueprint(person_detail_bp)

    from .routes.admin import admin_bp
    app.register_blueprint(admin_bp)

    from .routes.archive import archive_bp
    app.register_blueprint(archive_bp)

    from .routes.login import login_bp
    app.register_blueprint(login_bp)

    from .routes.register import register_bp
    app.register_blueprint(register_bp)

    from .routes.api.api import api_bp
    app.register_blueprint(api_bp)

    return app