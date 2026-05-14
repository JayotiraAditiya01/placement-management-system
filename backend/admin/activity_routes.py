from flask import Blueprint, request, jsonify
from database.db import db
from sqlalchemy.sql import func
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from flask_jwt_extended import (
    jwt_required,
    get_jwt,
    get_jwt_identity
)

# ==================================================
# 🇮🇳 IST TIMEZONE
# ==================================================

IST = ZoneInfo("Asia/Kolkata")

# ==================================================
# BLUEPRINT
# ==================================================

activity_bp = Blueprint(
    "activity_bp",
    __name__
)

# ==================================================
# MODEL
# ==================================================

class ActivityLog(db.Model):

    __tablename__ = "activity_logs"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # ==================================================
    # 🔥 COLLEGE ID
    # ==================================================

    college_id = db.Column(
        db.Integer,
        nullable=False
    )

    # ==================================================
    # 🔥 USER ID
    # ==================================================

    user_id = db.Column(
        db.Integer,
        nullable=False
    )

    # ==================================================
    # 🔥 ROLE
    # ==================================================

    role = db.Column(
        db.String(20),
        nullable=False
    )

    # ==================================================
    # 🔥 MODULE
    # ==================================================

    module = db.Column(
        db.String(100),
        nullable=False
    )

    # ==================================================
    # 🔥 ACTION
    # ==================================================

    action = db.Column(
        db.Text,
        nullable=False
    )

    # ==================================================
    # 🔥 TYPE
    # ==================================================

    type = db.Column(
        db.String(50),
        default="info"
    )

    # ==================================================
    # 🇮🇳 IST TIMESTAMP
    # ==================================================

    created_at = db.Column(
        db.DateTime(timezone=True),

        default=lambda:
            datetime.now(IST),

        nullable=False
    )

# ==================================================
# ADD ACTIVITY LOG
# ==================================================

@activity_bp.route(
    "/add",
    methods=["POST"]
)
@jwt_required()
def add_activity_log():

    try:

        data = (
            request.get_json()
            or {}
        )

        # ==================================================
        # 🔥 JWT CLAIMS
        # ==================================================

        claims = get_jwt()

        role = claims.get(
            "role"
        )

        user_id = claims.get(
            "id"
        )

        # ==================================================
        # 🔥 FALLBACK USER ID
        # ==================================================

        if not user_id:

            identity = get_jwt_identity()

            # ==================================================
            # 🔥 ADMIN FALLBACK
            # ==================================================

            if role == "ADMIN":

                user_id = claims.get(
                    "id"
                )

            # ==================================================
            # 🔥 STUDENT FALLBACK
            # ==================================================

            elif role == "STUDENT":

                email = claims.get(
                    "email"
                ) or identity

                if email:

                    from students.models import Student

                    student = Student.query.filter_by(
                        email=email
                    ).first()

                    if student:

                        user_id = student.id

        # ==================================================
        # 🔥 SAFETY CHECK
        # ==================================================

        if not user_id:

            return jsonify({

                "success": False,

                "message":
                    "User ID missing in token"

            }), 401

        # ==================================================
        # 🔥 VALIDATION
        # ==================================================

        if (

            not data.get("module")

            or

            not data.get("action")
        ):

            return jsonify({

                "success": False,

                "message":
                    "Module and action required"

            }), 400

        # ==================================================
        # 🇮🇳 SAVE WITH IST
        # ==================================================

        current_ist_time = datetime.now(
            IST
        )

        # ==================================================
        # 🔥 CREATE NEW LOG
        # ==================================================

        new_log = ActivityLog(

            college_id=data.get(
                "college_id"
            ),

            user_id=user_id,

            role=role,

            module=data.get(
                "module"
            ),

            action=data.get(
                "action"
            ),

            type=data.get(
                "type",
                "info"
            ),

            created_at=
                current_ist_time
        )

        db.session.add(
            new_log
        )

        db.session.commit()

        return jsonify({

            "success": True,

            "message":
                "Activity log added successfully",

        })

    except Exception as e:

        db.session.rollback()

        print(
            "ACTIVITY LOG ERROR:",
            str(e)
        )

        return jsonify({

            "success": False,

            "message": str(e),

        }), 500

# ==================================================
# GET ALL LOGS
# ==================================================

@activity_bp.route(
    "/all/<int:college_id>",
    methods=["GET"]
)
@jwt_required()
def get_activity_logs(
    college_id
):

    try:

        # ==================================================
        # 🔥 JWT CLAIMS
        # ==================================================

        claims = get_jwt()

        role = claims.get(
            "role"
        )

        user_id = claims.get(
            "id"
        )

        # ==================================================
        # 🔥 FALLBACK USER ID
        # ==================================================

        if not user_id:

            identity = get_jwt_identity()

            if role == "STUDENT":

                email = claims.get(
                    "email"
                ) or identity

                if email:

                    from students.models import Student

                    student = Student.query.filter_by(
                        email=email
                    ).first()

                    if student:

                        user_id = student.id

        # ==================================================
        # 🔥 SAFETY CHECK
        # ==================================================

        if not user_id:

            return jsonify({

                "success": False,

                "message":
                    "User ID missing in token"

            }), 401

        # ==================================================
        # 🔥 FETCH ONLY USER LOGS
        # ==================================================

        logs = (

            ActivityLog.query

            .filter_by(

                college_id=college_id,

                user_id=user_id,

                role=role
            )

            .order_by(
                ActivityLog.created_at.desc()
            )

            .all()
        )

        formatted_logs = []

        for log in logs:

            # ==================================================
            # 🇮🇳 CONVERT TO IST
            # ==================================================

            try:

                ist_time = (
                    log.created_at
                    .astimezone(IST)
                    .strftime(
                        "%d %b %Y, %I:%M:%S %p"
                    )
                )

            except:

                ist_time = str(
                    log.created_at
                )

            formatted_logs.append({

                "id":
                    log.id,

                "module":
                    log.module,

                "action":
                    log.action,

                "type":
                    log.type,

                "role":
                    log.role,

                "user_id":
                    log.user_id,

                "timestamp":
                    ist_time,
            })

        return jsonify({

            "success": True,

            "logs": formatted_logs,

        })

    except Exception as e:

        print(
            "FETCH LOGS ERROR:",
            str(e)
        )

        return jsonify({

            "success": False,

            "message": str(e),

        }), 500

# ==================================================
# DELETE SINGLE LOG
# ==================================================

@activity_bp.route(
    "/delete/<int:log_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_single_log(
    log_id
):

    try:

        # ==================================================
        # 🔥 JWT CLAIMS
        # ==================================================

        claims = get_jwt()

        user_id = claims.get(
            "id"
        )

        role = claims.get(
            "role"
        )

        # ==================================================
        # 🔥 FALLBACK USER ID
        # ==================================================

        if not user_id:

            identity = get_jwt_identity()

            if role == "STUDENT":

                email = claims.get(
                    "email"
                ) or identity

                if email:

                    from students.models import Student

                    student = Student.query.filter_by(
                        email=email
                    ).first()

                    if student:

                        user_id = student.id

        # ==================================================
        # 🔥 FETCH ONLY OWN LOG
        # ==================================================

        log = ActivityLog.query.filter_by(

            id=log_id,

            user_id=user_id,

            role=role

        ).first()

        if not log:

            return jsonify({

                "success": False,

                "message":
                    "Log not found"

            }), 404

        db.session.delete(
            log
        )

        db.session.commit()

        return jsonify({

            "success": True,

            "message":
                "Log deleted successfully"

        })

    except Exception as e:

        db.session.rollback()

        print(
            "DELETE LOG ERROR:",
            str(e)
        )

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500

# ==================================================
# DELETE FILTERED LOGS
# ==================================================

@activity_bp.route(
    "/delete-filtered",
    methods=["DELETE"]
)
@jwt_required()
def delete_filtered_logs():

    try:

        data = (
            request.get_json()
            or {}
        )

        # ==================================================
        # 🔥 JWT CLAIMS
        # ==================================================

        claims = get_jwt()

        user_id = claims.get(
            "id"
        )

        role = claims.get(
            "role"
        )

        # ==================================================
        # 🔥 FALLBACK USER ID
        # ==================================================

        if not user_id:

            identity = get_jwt_identity()

            if role == "STUDENT":

                email = claims.get(
                    "email"
                ) or identity

                if email:

                    from students.models import Student

                    student = Student.query.filter_by(
                        email=email
                    ).first()

                    if student:

                        user_id = student.id

        college_id = data.get(
            "college_id"
        )

        filter_type = data.get(
            "filter"
        )

        # ==================================================
        # 🇮🇳 IST CURRENT TIME
        # ==================================================

        now = datetime.now(
            IST
        )

        # ==================================================
        # 🔥 ONLY OWN LOGS
        # ==================================================

        logs_query = (

            ActivityLog.query.filter_by(

                college_id=college_id,

                user_id=user_id,

                role=role
            )
        )

        # ================= TODAY =================

        if filter_type == "TODAY":

            start_of_day = datetime(
                now.year,
                now.month,
                now.day,
                tzinfo=IST
            )

            logs_query = logs_query.filter(

                ActivityLog.created_at >=
                start_of_day
            )

        # ================= WEEK =================

        elif filter_type == "WEEK":

            week_ago = (
                now - timedelta(days=7)
            )

            logs_query = logs_query.filter(

                ActivityLog.created_at >=
                week_ago
            )

        # ================= MONTH =================

        elif filter_type == "MONTH":

            start_of_month = datetime(
                now.year,
                now.month,
                1,
                tzinfo=IST
            )

            logs_query = logs_query.filter(

                ActivityLog.created_at >=
                start_of_month
            )

        # ================= ALL =================

        elif filter_type == "ALL":

            logs_query = logs_query

        logs_to_delete = (
            logs_query.all()
        )

        deleted_count = len(
            logs_to_delete
        )

        for log in logs_to_delete:

            db.session.delete(
                log
            )

        db.session.commit()

        return jsonify({

            "success": True,

            "message":

                f"{deleted_count} logs deleted successfully"

        })

    except Exception as e:

        db.session.rollback()

        print(
            "DELETE FILTERED LOGS ERROR:",
            str(e)
        )

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500