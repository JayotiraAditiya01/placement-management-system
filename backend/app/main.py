from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from developer.routes import developer_bp
from flask_jwt_extended import JWTManager
from app.extensions import mail
import os
import logging

# ================= IMPORTS =================
from database.db import init_db, create_tables

from students.routes import student_bp
from admin.routes import admin_bp
from auth.routes import auth_bp

from students.models import Student

# ================= NEW MODEL IMPORTS =================
from placement_drive.models import (
    PlacementDrive,
    PlacementPhase,
    StudentPhaseStatus
)

# ================= NEW BLUEPRINT IMPORT =================
from placement_drive.routes import placement_drive_bp

# ================= ACTIVITY BLUEPRINT IMPORT =================
from admin.activity_routes import activity_bp

# ==================================================
# 🔥 LOGGER SETUP
# ==================================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)

logger = logging.getLogger(__name__)


def create_app():

    app = Flask(__name__)

    logger.info("🚀 PlacementAI Backend Starting...")

    # ==================================================
    # 🔐 ENV VARIABLES
    # ==================================================
    DB_USER = os.getenv(
        "DB_USER",
        "postgres"
    )

    DB_PASSWORD = os.getenv(
        "DB_PASSWORD",
        "postgres"
    )

    DB_HOST = os.getenv(
        "DB_HOST",
        "localhost"
    )

    DB_NAME = os.getenv(
        "DB_NAME",
        "placement_db"
    )

    BASE_DIR = os.path.abspath(
        os.path.dirname(__file__)
    )

    # ==================================================
    # 🗄 DATABASE CONFIG
    # ==================================================
    POSTGRES_URI = os.getenv("DATABASE_URL")

    if not POSTGRES_URI:

        POSTGRES_URI = (
            f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
        )

    app.config["SQLALCHEMY_DATABASE_URI"] = POSTGRES_URI

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ==================================================
    # ⚡ CONNECTION POOLING
    # ==================================================
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_size": 25,
        "max_overflow": 40,
        "pool_timeout": 30,
        "pool_recycle": 1800,
    }

    # ==================================================
    # 🔐 JWT CONFIG
    # ==================================================
    app.config["JWT_SECRET_KEY"] = os.getenv(
        "JWT_SECRET_KEY",
        "placement_ai_super_secure_jwt_secret_2026"
    )

    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600

    # ==================================================
    # 📧 MAIL CONFIG (FIXED)
    # ==================================================
    app.config["MAIL_SERVER"] = os.getenv(
        "MAIL_SERVER",
        "smtp.gmail.com"
    )

    app.config["MAIL_PORT"] = int(
        os.getenv("MAIL_PORT", 587)
    )

    app.config["MAIL_USE_TLS"] = (
        os.getenv("MAIL_USE_TLS", "true").lower() == "true"
    )

    app.config["MAIL_USE_SSL"] = False

    app.config["MAIL_USERNAME"] = os.getenv(
        "MAIL_USERNAME"
    )

    app.config["MAIL_PASSWORD"] = os.getenv(
        "MAIL_PASSWORD"
    )

    app.config["MAIL_DEFAULT_SENDER"] = os.getenv(
        "MAIL_USERNAME"
    )

    app.config["MAIL_SUPPRESS_SEND"] = False

    app.config["MAIL_ASCII_ATTACHMENTS"] = False

    app.config["MAIL_TIMEOUT"] = 30

    # ==================================================
    # 📎 FILE UPLOAD LIMIT
    # ==================================================
    app.config["MAX_CONTENT_LENGTH"] = (
        5 * 1024 * 1024
    )  # 5MB

    # ==================================================
    # 🔌 INIT EXTENSIONS
    # ==================================================
    init_db(app)

    JWTManager(app)

    mail.init_app(app)

    # ==================================================
    # 🌐 CORS
    # ==================================================
    FRONTEND_URL = os.getenv(
        "FRONTEND_URL",
        "*"
    )

    CORS(
        app,
        supports_credentials=True,
        resources={
            r"/*": {
                "origins": FRONTEND_URL
            }
        }
    )

    # ==================================================
    # 📂 UPLOAD CONFIG
    # ==================================================
    UPLOAD_FOLDER = os.path.join(
        BASE_DIR,
        "uploads",
        "resumes"
    )

    os.makedirs(
        UPLOAD_FOLDER,
        exist_ok=True
    )

    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

    @app.route("/uploads/resumes/<path:filename>")
    def serve_resume(filename):

        return send_from_directory(
            UPLOAD_FOLDER,
            filename
        )

    # ==================================================
    # 🔗 REGISTER BLUEPRINTS
    # ==================================================
    app.register_blueprint(auth_bp)

    app.register_blueprint(student_bp)

    app.register_blueprint(admin_bp)

    app.register_blueprint(developer_bp)

    # ================= PLACEMENT DRIVE BLUEPRINT =================
    app.register_blueprint(
        placement_drive_bp,
        url_prefix="/api/placement-drive"
    )

    # ================= ACTIVITY BLUEPRINT =================
    app.register_blueprint(
        activity_bp,
        url_prefix="/api/activity"
    )

    # ==================================================
    # ❤️ HEALTH CHECK
    # ==================================================
    @app.route("/")
    def home():

        return {
            "status": "PlacementAI Backend Running",
            "health": "OK",
            "database": "PostgreSQL Connected"
        }

    # ==================================================
    # 🧪 DEBUG ROUTE
    # ==================================================
    if os.getenv("FLASK_ENV") != "production":

        @app.route("/api/debug/students")
        def debug_students():

            students = Student.query.limit(20).all()

            return jsonify([
                {
                    "id": s.id,
                    "name": s.name,
                    "status": s.status,
                    "statusUpdatedAt": (
                        s.status_updated_at.isoformat()
                        if s.status_updated_at
                        else None
                    )
                }
                for s in students
            ])

    # ==================================================
    # ❌ GLOBAL ERROR HANDLER
    # ==================================================
    @app.errorhandler(Exception)
    def handle_exception(e):

        logger.error(
            f"Global Error: {str(e)}"
        )

        return jsonify({
            "error": "Internal Server Error",
            "message": (
                str(e)
                if os.getenv("FLASK_ENV") != "production"
                else None
            )
        }), 500

    # ==================================================
    # 🛠 CREATE TABLES (DEV ONLY)
    # ==================================================
    if os.getenv("FLASK_ENV") != "production":

        create_tables(app)

    return app


# ==================================================
# ▶ CREATE APP INSTANCE FOR GUNICORN
# ==================================================
app = create_app()

# ==================================================
# ▶ RUN SERVER
# ==================================================
if __name__ == "__main__":

    DEBUG_MODE = (
        os.getenv("FLASK_ENV") != "production"
    )

    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
        debug=DEBUG_MODE
    )