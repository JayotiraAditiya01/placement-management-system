import os
import uuid
import json
import logging
from datetime import datetime

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    get_jwt,
)

from sqlalchemy import func

from database.db import db

from students.models import Student

from auth.models import College

# ==================================================
# 🚀 PLACEMENT DRIVE IMPORTS
# ==================================================
from placement_drive.models import (
    StudentPhaseStatus,
    PlacementDrive,
    PlacementPhase
)

# ==================================================
# 🔗 BLUEPRINT
# ==================================================
student_bp = Blueprint(
    "students",
    __name__,
    url_prefix="/api/students"
)

# ==================================================
# 🔥 LOGGER
# ==================================================
logger = logging.getLogger(__name__)

# ==================================================
# 📂 UPLOADS
# ==================================================
UPLOAD_FOLDER = "uploads/resumes"

ALLOWED_EXTENSIONS = {
    "pdf"
}

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

# ==================================================
# 📁 FILE VALIDATION
# ==================================================
def allowed_file(filename):

    return (
        "." in filename
        and
        filename.rsplit(
            ".",
            1
        )[1].lower()
        in ALLOWED_EXTENSIONS
    )

# ==================================================
# 🔢 SAFE FLOAT
# ==================================================
def safe_float(value):

    try:

        return float(value)

    except:

        return None

# ==================================================
# 🏫 GET COLLEGE FROM CLAIMS
# ==================================================
def get_college_from_claims(claims):

    college_name = claims.get(
        "college",
        ""
    )

    if not college_name:
        return None

    return College.query.filter(

        func.lower(
            College.college_name
        )

        ==

        college_name.strip().lower()

    ).first()

# ==================================================
# 👨‍🎓 SERIALIZER
# ==================================================
def serialize_student(student):

    # ==================================================
    # 🚀 FETCH LATEST PLACEMENT STATUS
    # ==================================================
    latest_status = (

        StudentPhaseStatus.query

        .filter_by(
            student_id=student.id
        )

        .order_by(
            StudentPhaseStatus.updated_at.desc()
        )

        .first()
    )

    # ==================================================
    # 🚀 DEFAULTS
    # ==================================================
    current_company = None

    current_phase = None

    placement_result = None

    phases_cleared = []

    all_phases = []

    drive_name = None

    # ==================================================
    # 🚀 IF STATUS EXISTS
    # ==================================================
    if latest_status:

        # ==================================================
        # 🚀 FETCH DRIVE
        # ==================================================
        drive = PlacementDrive.query.get(
            latest_status.drive_id
        )

        # ==================================================
        # 🚀 FETCH PHASE
        # ==================================================
        phase = PlacementPhase.query.get(
            latest_status.phase_id
        )

        # ==================================================
        # 🚀 COMPANY
        # ==================================================
        current_company = (

            drive.company_name

            if drive

            else None
        )

        # ==================================================
        # 🚀 DRIVE NAME
        # ==================================================
        drive_name = (

            drive.drive_name

            if drive

            else None
        )

        # ==================================================
        # 🚀 CURRENT PHASE
        # ==================================================
        current_phase = (

            phase.phase_name

            if phase

            else None
        )

        # ==================================================
        # 🚀 PLACEMENT RESULT
        # ==================================================
        placement_result = (
            latest_status.overall_status
        )

        # ==================================================
        # 🚀 FETCH REAL DRIVE PHASES
        # ONLY ADMIN-CREATED PHASES
        # ==================================================
        drive_phases = (

            PlacementPhase.query

            .filter_by(
                drive_id=latest_status.drive_id
            )

            .order_by(
                PlacementPhase.phase_order.asc()
            )

            .all()
        )

        for phase_item in drive_phases:

            all_phases.append({

                "id":
                    phase_item.id,

                "phase_name":
                    phase_item.phase_name,

                "phase_order":
                    phase_item.phase_order,
            })

        # ==================================================
        # 🚀 FETCH CLEARED PHASES
        # ==================================================
        cleared_phases = (

            StudentPhaseStatus.query

            .filter_by(

                student_id=student.id,

                drive_id=latest_status.drive_id,

                status="CLEARED"
            )

            .all()
        )

        for cleared in cleared_phases:

            cleared_phase = (
                PlacementPhase.query.get(
                    cleared.phase_id
                )
            )

            if cleared_phase:

                phases_cleared.append(
                    cleared_phase.phase_name
                )

    # ==================================================
    # 🚀 RETURN DATA
    # ==================================================
    return {

        # ==================================================
        # BASIC DETAILS
        # ==================================================
        "id":
            student.id,

        "name":
            student.name,

        "email":
            student.email,

        "branch":
            student.branch,

        "section":
            student.section,

        "classRollNo":
            student.classRollNo,

        "universityRollNo":
            student.universityRollNo,

        "cgpa":
            student.cgpa,

        "skills":
            student.skills,

        "phone":
            student.phone,

        "city":
            student.city,

        "bio":
            student.bio,

        "languages":

            student.languages.split(",")

            if student.languages

            else [],

        "status":
            student.status,

        "resume":
            student.resume,

        "linkedin":
            student.linkedin,

        "statusUpdatedAt":

            student.status_updated_at.isoformat()

            if student.status_updated_at

            else None,

        "createdAt":

            student.created_at.isoformat()

            if student.created_at

            else None,

        # ==================================================
        # 🚀 PLACEMENT JOURNEY DATA
        # ==================================================
        "currentCompany":
            current_company,

        "driveName":
            drive_name,

        "currentPhase":
            current_phase,

        "phasesCleared":
            phases_cleared,

        "placementResult":
            placement_result,

        # ==================================================
        # 🚀 ONLY ADMIN-CREATED PHASES
        # ==================================================
        "allPhases":
            all_phases,
    }

# ==================================================
# 🔥 ADMIN GET STUDENTS
# ==================================================
@student_bp.route(
    "/",
    methods=["GET"]
)
@jwt_required()
def get_all_students():

    try:

        claims = get_jwt()

        if claims.get("role") != "ADMIN":

            return jsonify({
                "error":
                    "Unauthorized access"
            }), 403

        college = get_college_from_claims(
            claims
        )

        if not college:

            return jsonify({
                "error":
                    "College not found"
            }), 404

        students = (

            Student.query

            .filter_by(
                college_id=college.id
            )

            .order_by(
                Student.created_at.desc()
            )

            .all()
        )

        return jsonify({

            "students": [

                serialize_student(s)

                for s in students
            ]

        }), 200

    except Exception as e:

        logger.error(
            f"Get students error: {str(e)}"
        )

        return jsonify({
            "error":
                "Internal server error"
        }), 500

# ==================================================
# 🔥 ADMIN MARK STATUS
# ==================================================
@student_bp.route(
    "/mark/<int:student_id>",
    methods=["PUT"]
)
@jwt_required()
def mark_student_status(student_id):

    try:

        claims = get_jwt()

        if claims.get("role") != "ADMIN":

            return jsonify({
                "error":
                    "Unauthorized"
            }), 403

        college = get_college_from_claims(
            claims
        )

        if not college:

            return jsonify({
                "error":
                    "College not found"
            }), 404

        student = Student.query.filter_by(

            id=student_id,

            college_id=college.id

        ).first()

        if not student:

            return jsonify({
                "error":
                    "Student not found"
            }), 404

        # ==================================================
        # 🚀 SAFE JSON
        # ==================================================
        data = (
            request.get_json()
            or {}
        )

        new_status = data.get(
            "status"
        )

        if not new_status:

            return jsonify({
                "error":
                    "Status is required"
            }), 400

        # ==================================================
        # 🚀 NORMALIZE
        # ==================================================
        new_status = (

            new_status
            .upper()
            .strip()
        )

        if new_status not in [
            "PLACED",
            "UNPLACED",
            "PENDING"
        ]:

            return jsonify({
                "error":
                    "Invalid status"
            }), 400

        logger.info(
            f"Updating student "
            f"{student.id} → "
            f"{new_status}"
        )

        # ==================================================
        # 🚀 UPDATE STATUS
        # ==================================================
        student.status = new_status

        student.status_updated_at = (
            datetime.utcnow()
        )

        db.session.commit()

        db.session.refresh(student)

        return jsonify({

            "message":
                "Status updated successfully",

            "student":
                serialize_student(student)

        }), 200

    except Exception as e:

        db.session.rollback()

        logger.error(
            f"Status update error: {str(e)}"
        )

        return jsonify({
            "error":
                "Internal server error"
        }), 500

# ==================================================
# 🔥 STUDENT SUBMIT PROFILE
# ==================================================
@student_bp.route(
    "/",
    methods=["POST"]
)
@jwt_required()
def submit_profile():

    try:

        email = get_jwt_identity()

        claims = get_jwt()

        if claims.get("role") != "STUDENT":

            return jsonify({
                "error":
                    "Only students allowed"
            }), 403

        college = get_college_from_claims(
            claims
        )

        if not college:

            return jsonify({
                "error":
                    "College not found"
            }), 404

        student = Student.query.filter_by(

            email=email.lower().strip(),

            college_id=college.id

        ).first()

        # ==================================================
        # 🚀 CREATE STUDENT
        # ==================================================
        if not student:

            student = Student(

                email=email.lower().strip(),

                college_id=college.id,

                status="PENDING"
            )

            student.set_password(
                "TEMP"
            )

            db.session.add(student)

            db.session.commit()

        # ==================================================
        # 🚀 FORM DATA
        # ==================================================
        data = (

            request.form

            if request.form

            else request.get_json()

            or {}
        )

        file = request.files.get(
            "resumeFile"
        )

        # ==================================================
        # 🚀 RESUME FILE
        # ==================================================
        if (

            file

            and

            allowed_file(
                file.filename
            )
        ):

            filename = secure_filename(
                file.filename
            )

            unique_name = (
                f"{uuid.uuid4()}_{filename}"
            )

            path = os.path.join(

                UPLOAD_FOLDER,

                unique_name
            )

            file.save(path)

            student.resume = (
                f"/uploads/resumes/{unique_name}"
            )

        # ==================================================
        # 🚀 RESUME LINK
        # ==================================================
        if data.get("resumeLink"):

            student.resume = data.get(
                "resumeLink"
            )

        # ==================================================
        # 🚀 LANGUAGES
        # ==================================================
        if data.get("languages"):

            try:

                langs = json.loads(
                    data.get("languages")
                )

                student.languages = ",".join(
                    langs
                )

            except:

                student.languages = data.get(
                    "languages"
                )

        # ==================================================
        # 🚀 UPDATE PROFILE
        # ==================================================
        student.update_profile({

            "name":
                data.get("name"),

            "branch":
                data.get("branch"),

            "section":
                data.get("section"),

            "classRollNo":
                data.get("classRollNo"),

            "universityRollNo":
                data.get(
                    "universityRollNo"
                ),

            "cgpa":
                safe_float(
                    data.get("cgpa")
                ),

            "skills":
                data.get("skills"),

            "phone":
                data.get("phone"),

            "city":
                data.get("city"),

            "bio":
                data.get("bio"),

            "linkedin":
                data.get("linkedin"),
        })

        db.session.commit()

        return jsonify(
            serialize_student(student)
        ), 200

    except Exception as e:

        db.session.rollback()

        logger.error(
            f"Profile submit error: {str(e)}"
        )

        return jsonify({
            "error":
                "Internal server error"
        }), 500

# ==================================================
# 🔥 GET MY PROFILE
# ==================================================
@student_bp.route(
    "/me",
    methods=["GET"]
)
@jwt_required()
def get_my_profile():

    try:

        email = get_jwt_identity()

        claims = get_jwt()

        if claims.get("role") != "STUDENT":

            return jsonify({
                "error":
                    "Unauthorized"
            }), 403

        college = get_college_from_claims(
            claims
        )

        if not college:

            return jsonify({
                "error":
                    "College not found"
            }), 404

        student = Student.query.filter_by(

            email=email.lower(),

            college_id=college.id

        ).first()

        if not student:

            return jsonify({
                "error":
                    "Student not registered"
            }), 404

        return jsonify(
            serialize_student(student)
        ), 200

    except Exception as e:

        logger.error(
            f"Get profile error: {str(e)}"
        )

        return jsonify({
            "error":
                "Internal server error"
        }), 500