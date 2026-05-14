from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from sqlalchemy import func
import logging
from datetime import datetime
import pytz

from database.db import db
from auth.models import College
from students.models import Student
from admin.models import Announcement

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

logger = logging.getLogger(__name__)

# ==================================================
# 🌏 IST TIMEZONE SETUP
# ==================================================
IST = pytz.timezone("Asia/Kolkata")


def convert_utc_to_ist(utc_dt):
    """Convert UTC datetime to IST safely"""
    if not utc_dt:
        return None

    if utc_dt.tzinfo is None:
        utc_dt = pytz.utc.localize(utc_dt)

    return utc_dt.astimezone(IST)


# ==================================================
# 🔧 HELPERS
# ==================================================

def get_college_from_claims(claims):
    try:
        college_name = claims.get("college")

        if not college_name:
            logger.warning("JWT missing college field")
            return None

        college = College.query.filter(
            func.lower(College.college_name) == college_name.strip().lower()
        ).first()

        if not college:
            logger.warning("College not found in DB")

        return college

    except Exception as e:
        logger.error(f"Error fetching college: {str(e)}")
        return None


def is_admin(claims):
    return claims.get("role") == "ADMIN"


def unauthorized():
    return jsonify({"error": "Unauthorized"}), 403


# ==================================================
# 🆕 ADMIN PROFILE (UNCHANGED)
# ==================================================

@admin_bp.route("/profile", methods=["GET"])
@jwt_required()
def admin_profile():
    try:
        claims = get_jwt()

        if not is_admin(claims):
            return unauthorized()

        college = get_college_from_claims(claims)

        if not college:
            return jsonify({"error": "College not found"}), 404

        return jsonify({
            "admin_email": claims.get("email", "Not available"),
            "college_name": college.college_name,
            "id": claims.get("id", "N/A")
        }), 200

    except Exception as e:
        logger.error(f"Profile error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# ==================================================
# 📊 ADMIN DASHBOARD (UNCHANGED)
# ==================================================

@admin_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    try:
        claims = get_jwt()

        if not is_admin(claims):
            return unauthorized()

        college = get_college_from_claims(claims)
        if not college:
            return jsonify({"error": "College not found"}), 404

        total = db.session.query(func.count(Student.id)).filter_by(
            college_id=college.id
        ).scalar()

        placed = db.session.query(func.count(Student.id)).filter_by(
            college_id=college.id,
            status="PLACED"
        ).scalar()

        return jsonify({
            "stats": {
                "total_students": total,
                "placed_students": placed,
                "placement_rate": round((placed / total * 100), 2) if total else 0
            }
        }), 200

    except Exception as e:
        logger.error(f"Dashboard error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# ==================================================
# 📢 CREATE ANNOUNCEMENT (🔥 FINAL FIX)
# ==================================================

@admin_bp.route("/announcements", methods=["POST"])
@jwt_required()
def create_announcement():
    try:
        claims = get_jwt()

        if not is_admin(claims):
            return unauthorized()

        college = get_college_from_claims(claims)
        if not college:
            return jsonify({"error": "College not found"}), 404

        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        title = data.get("title")
        message = data.get("message")

        if not title or not message:
            return jsonify({"error": "Title and message required"}), 400

        # 🔥 STORE IN UTC (FINAL FIX)
        new_announcement = Announcement(
            title=title,
            message=message,
            college_id=college.id,
            created_at=datetime.utcnow()
        )

        db.session.add(new_announcement)
        db.session.commit()

        # 🔥 RETURN IN IST
        ist_time = convert_utc_to_ist(new_announcement.created_at)

        return jsonify({
            "id": new_announcement.id,
            "title": new_announcement.title,
            "message": new_announcement.message,
            "college_id": new_announcement.college_id,
            "created_at": ist_time.isoformat()
        }), 201

    except Exception as e:
        db.session.rollback()
        logger.error(f"Create announcement error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# ==================================================
# 📢 GET ANNOUNCEMENTS (🔥 FINAL FIX)
# ==================================================

@admin_bp.route("/announcements", methods=["GET"])
@jwt_required()
def fetch_announcements():
    try:
        claims = get_jwt()

        college = get_college_from_claims(claims)
        if not college:
            return jsonify({"error": "College not found"}), 404

        announcements = Announcement.query.filter_by(
            college_id=college.id
        ).order_by(Announcement.created_at.desc()).all()

        return jsonify([
            {
                "id": a.id,
                "title": a.title,
                "message": a.message,
                "college_id": a.college_id,
                "created_at": convert_utc_to_ist(a.created_at).isoformat()
                if a.created_at else None
            }
            for a in announcements
        ]), 200

    except Exception as e:
        logger.error(f"Fetch announcement error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# ==================================================
# 🗑 DELETE ANNOUNCEMENT (UNCHANGED)
# ==================================================

@admin_bp.route("/announcements/<int:announcement_id>", methods=["DELETE"])
@jwt_required()
def delete_announcement(announcement_id):
    try:
        claims = get_jwt()

        if not is_admin(claims):
            return unauthorized()

        college = get_college_from_claims(claims)
        if not college:
            return jsonify({"error": "College not found"}), 404

        announcement = Announcement.query.filter_by(
            id=announcement_id,
            college_id=college.id
        ).first()

        if not announcement:
            return jsonify({"error": "Announcement not found"}), 404

        db.session.delete(announcement)
        db.session.commit()

        return jsonify({"message": "Announcement deleted"}), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Delete announcement error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500