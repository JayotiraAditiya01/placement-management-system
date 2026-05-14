from flask import Blueprint, request, jsonify
import logging

from database.db import db
from auth.models import College
from students.models import Student

from flask_jwt_extended import create_access_token
from datetime import timedelta
from sqlalchemy import func

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

logger = logging.getLogger(__name__)

# ==================================================
# 👨‍💻 DEVELOPER CONFIG
# ==================================================

DEVELOPER_EMAIL = "j.aditiya01@gmail.com"

DEVELOPER_PASSWORD = "Adii@2003"

# ==================================================
# 🔥 HELPERS
# ==================================================

def normalize_college_name(name):

    return (
        name.strip().lower()

        if name

        else ""
    )

def normalize_email(email):

    return (
        email.strip().lower()

        if email

        else ""
    )

def get_college_by_name(name):

    normalized = normalize_college_name(
        name
    )

    return College.query.filter(

        func.lower(
            College.college_name
        )

        ==

        normalized

    ).first()

# ==================================================
# 👨‍💻 DEVELOPER LOGIN
# ==================================================

@auth_bp.route(
    "/developer-login",
    methods=["POST"]
)
def developer_login():

    try:

        data = (
            request.get_json()
            or {}
        )

        email = normalize_email(
            data.get("email")
        )

        password = data.get(
            "password"
        )

        if not email or not password:

            return jsonify({

                "error":
                    "Email and password required"

            }), 400

        if (

            email != DEVELOPER_EMAIL

            or

            password != DEVELOPER_PASSWORD

        ):

            return jsonify({

                "error":
                    "Invalid developer credentials"

            }), 401

        token = create_access_token(

            identity=email,

            additional_claims={

                "role":
                    "DEVELOPER"
            },

            expires_delta=
                timedelta(hours=5)
        )

        return jsonify({

            "message":
                "Developer login successful",

            "access_token":
                token,

            "role":
                "DEVELOPER"

        }), 200

    except Exception as e:

        logger.error(

            f"Developer login error: {str(e)}"
        )

        return jsonify({

            "error":
                "Internal server error"

        }), 500

# ==================================================
# 🏫 CREATE COLLEGE
# ==================================================

@auth_bp.route(
    "/create-college",
    methods=["POST"]
)
def create_college():

    try:

        data = (
            request.get_json()
            or {}
        )

        college_name = data.get(
            "college_name"
        )

        admin_email = normalize_email(
            data.get("admin_email")
        )

        password = data.get(
            "password"
        )

        if (

            not college_name

            or

            not admin_email

            or

            not password
        ):

            return jsonify({

                "error":
                    "All fields required"

            }), 400

        if get_college_by_name(
            college_name
        ):

            return jsonify({

                "error":
                    "College already exists"

            }), 409

        if College.query.filter_by(
            admin_email=admin_email
        ).first():

            return jsonify({

                "error":
                    "Admin email already exists"

            }), 409

        college = College(

            college_name=
                normalize_college_name(
                    college_name
                ),

            admin_email=
                admin_email
        )

        college.set_password(
            password
        )

        if hasattr(
            college,
            "display_name"
        ):

            college.display_name = (
                college_name.strip()
            )

        db.session.add(
            college
        )

        db.session.commit()

        logger.info(
            f"College created: {college_name}"
        )

        return jsonify({

            "message":
                "College created successfully"

        }), 201

    except Exception as e:

        db.session.rollback()

        logger.error(

            f"Create college error: {str(e)}"
        )

        return jsonify({

            "error":
                "Internal server error"

        }), 500

# ==================================================
# 📋 GET COLLEGES
# ==================================================

@auth_bp.route(
    "/get-colleges",
    methods=["GET"]
)
def get_colleges():

    try:

        colleges = College.query.all()

        return jsonify({

            "colleges": [

                {

                    "id":
                        c.id,

                    "college_name":

                        getattr(
                            c,
                            "display_name",
                            None
                        )

                        or

                        c.college_name,

                    "admin_email":
                        c.admin_email

                }

                for c in colleges
            ]

        }), 200

    except Exception as e:

        logger.error(

            f"Get colleges error: {str(e)}"
        )

        return jsonify({

            "error":
                "Internal server error"

        }), 500

# ==================================================
# ❌ DELETE COLLEGE
# ==================================================

@auth_bp.route(
    "/delete-college/<int:id>",
    methods=["DELETE"]
)
def delete_college(id):

    try:

        college = College.query.get(
            id
        )

        if not college:

            return jsonify({

                "error":
                    "College not found"

            }), 404

        db.session.delete(
            college
        )

        db.session.commit()

        return jsonify({

            "message":
                "College deleted successfully"

        }), 200

    except Exception as e:

        db.session.rollback()

        logger.error(

            f"Delete college error: {str(e)}"
        )

        return jsonify({

            "error":
                "Internal server error"

        }), 500

# ==================================================
# 👨‍💼 ADMIN LOGIN
# ==================================================

@auth_bp.route(
    "/admin-login",
    methods=["POST"]
)
def admin_login():

    try:

        data = (
            request.get_json()
            or {}
        )

        college_name = data.get(
            "college_name"
        )

        password = data.get(
            "password"
        )

        if (

            not college_name

            or

            not password
        ):

            return jsonify({

                "error":
                    "All fields required"

            }), 400

        college = get_college_by_name(
            college_name
        )

        if not college:

            return jsonify({

                "error":
                    "College not found"

            }), 404

        if not college.check_password(
            password
        ):

            return jsonify({

                "error":
                    "Invalid password"

            }), 401

        # ==================================================
        # 🔥 ADMIN JWT
        # ==================================================

        token = create_access_token(

            identity=
                college.admin_email,

            additional_claims={

                "role":
                    "ADMIN",

                "college":

                    normalize_college_name(
                        college.college_name
                    ),

                "email":
                    college.admin_email,

                "id":
                    college.id
            },

            expires_delta=
                timedelta(hours=5)
        )

        return jsonify({

            "message":
                "Admin login successful",

            "access_token":
                token,

            "role":
                "ADMIN",

            "college":

                getattr(
                    college,
                    "display_name",
                    None
                )

                or

                college.college_name

        }), 200

    except Exception as e:

        logger.error(

            f"Admin login error: {str(e)}"
        )

        return jsonify({

            "error":
                "Internal server error"

        }), 500

# ==================================================
# 🎓 STUDENT LOGIN
# ==================================================

@auth_bp.route(
    "/student-login",
    methods=["POST"]
)
def student_login():

    try:

        data = (
            request.get_json()
            or {}
        )

        email = normalize_email(
            data.get("email")
        )

        password = data.get(
            "password"
        )

        college_name = data.get(
            "college_name"
        )

        if (

            not email

            or

            not password

            or

            not college_name
        ):

            return jsonify({

                "error":
                    "All fields required"

            }), 400

        college = get_college_by_name(
            college_name
        )

        if not college:

            return jsonify({

                "error":
                    "College not found"

            }), 404

        student = Student.query.filter_by(

            email=email,

            college_id=college.id

        ).first()

        # ==================================================
        # 🔥 AUTO CREATE STUDENT
        # ==================================================

        if not student:

            student = Student(

                email=email,

                college_id=college.id,

                status="PENDING"
            )

            student.set_password(
                password
            )

            db.session.add(
                student
            )

            db.session.commit()

        # ==================================================
        # 🔥 CHECK PASSWORD
        # ==================================================

        if not student.check_password(
            password
        ):

            return jsonify({

                "error":
                    "Invalid password"

            }), 401

        # ==================================================
        # 🔥 STUDENT JWT
        # ==================================================

        token = create_access_token(

            identity=email,

            additional_claims={

                "role":
                    "STUDENT",

                "college":

                    normalize_college_name(
                        college.college_name
                    ),

                # ==================================================
                # 🔥 REQUIRED FOR ACTIVITY ISOLATION
                # ==================================================

                "id":
                    student.id,

                "email":
                    student.email
            },

            expires_delta=
                timedelta(hours=5)
        )

        return jsonify({

            "message":
                "Student login successful",

            "access_token":
                token,

            "role":
                "STUDENT"

        }), 200

    except Exception as e:

        logger.error(

            f"Student login error: {str(e)}"
        )

        return jsonify({

            "error":
                "Internal server error"

        }), 500