from flask_sqlalchemy import SQLAlchemy
import logging
from sqlalchemy import text
import os

# ==================================================
# 🔥 GLOBAL DB INSTANCE
# ==================================================
db = SQLAlchemy()

# ==================================================
# 🔥 LOGGER
# ==================================================
logger = logging.getLogger(__name__)

# ==================================================
# 🔧 INIT FUNCTION (PRODUCTION + SCALING READY)
# ==================================================
def init_db(app):
    """ Initialize database with Flask app """

    try:

        # ==================================================
        # 🔥 CORE CONFIG
        # ==================================================
        app.config.setdefault(
            "SQLALCHEMY_TRACK_MODIFICATIONS",
            False
        )

        # ==================================================
        # 🚀 CONNECTION POOLING (OPTIMIZED FOR 3000 USERS)
        # ==================================================
        app.config.setdefault(
            "SQLALCHEMY_ENGINE_OPTIONS",
            {
                "pool_size": 25,
                "max_overflow": 40,
                "pool_timeout": 30,
                "pool_recycle": 1800,
                "pool_pre_ping": True
            }
        )

        # ==================================================
        # 🔒 RENDER POSTGRES SSL SUPPORT
        # ==================================================
        DATABASE_URL = app.config.get(
            "SQLALCHEMY_DATABASE_URI"
        )

        if DATABASE_URL and "render.com" in DATABASE_URL:

            engine_options = app.config.get(
                "SQLALCHEMY_ENGINE_OPTIONS",
                {}
            )

            engine_options["connect_args"] = {
                "sslmode": "require"
            }

            app.config[
                "SQLALCHEMY_ENGINE_OPTIONS"
            ] = engine_options

        # ==================================================
        # 🔗 INIT DB
        # ==================================================
        db.init_app(app)

        # ==================================================
        # 🧪 DB CONNECTION TEST
        # ==================================================
        with app.app_context():

            db.session.execute(
                text("SELECT 1")
            )

            logger.info(
                "✅ Database initialized and connected successfully"
            )

    except Exception as e:

        logger.error(
            f"❌ Database initialization failed: {str(e)}"
        )

        raise e


# ==================================================
# 🔧 CREATE TABLES (DEV ONLY)
# ==================================================
def create_tables(app):
    """ Create all tables (use only in development) """

    try:

        with app.app_context():

            db.create_all()

            logger.info(
                "📦 All tables created successfully"
            )

    except Exception as e:

        logger.error(
            f"❌ Table creation failed: {str(e)}"
        )

        raise e


# ==================================================
# 🔥 SAFE SESSION HANDLING (OPTIONAL FUTURE USE)
# ==================================================
def commit_session():
    """ Safe commit helper (optional use) """

    try:

        db.session.commit()

    except Exception as e:

        db.session.rollback()

        logger.error(
            f"❌ DB Commit failed: {str(e)}"
        )

        raise e


# ==================================================
# 🔥 OPTIONAL: HEALTH CHECK FUNCTION (FUTURE USE)
# ==================================================
def check_db_connection():
    """ Can be used in health APIs later """

    try:

        db.session.execute(
            text("SELECT 1")
        )

        return True

    except Exception as e:

        logger.error(
            f"❌ DB health check failed: {str(e)}"
        )

        return False