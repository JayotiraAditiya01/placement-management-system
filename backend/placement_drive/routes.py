from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt,
)

from sqlalchemy import func, or_

from database.db import db

from placement_drive.models import (
    PlacementDrive,
    PlacementPhase,
    StudentPhaseStatus,
)

from students.models import Student

from auth.models import College

from datetime import datetime

import logging


# ==================================================
# 🔥 LOGGER
# ==================================================
logger = logging.getLogger(__name__)


# ==================================================
# 🔗 BLUEPRINT
# ==================================================
placement_drive_bp = Blueprint(
    "placement_drive",
    __name__,
    url_prefix="/api/placement-drive"
)


# ==================================================
# 🏫 GET COLLEGE FROM JWT CLAIMS
# ==================================================
def get_college_from_claims(claims):

    try:

        college_name = claims.get("college")

        if not college_name:
            return None

        college = College.query.filter(
            func.lower(College.college_name)
            == college_name.strip().lower()
        ).first()

        return college

    except Exception as e:

        logger.error(
            f"College fetch error: {str(e)}"
        )

        return None


# ==================================================
# 🔐 ADMIN CHECK
# ==================================================
def is_admin(claims):

    return claims.get("role") == "ADMIN"


# ==================================================
# ❌ UNAUTHORIZED RESPONSE
# ==================================================
def unauthorized():

    return jsonify({
        "error": "Unauthorized"
    }), 403


# ==================================================
# 👨‍🎓 SERIALIZE STUDENT
# ==================================================
def serialize_student(student):

    return {

        "id": student.id,

        "name": student.name,

        "email": student.email,

        "branch": student.branch,

        "section": student.section,

        "classRollNo": (
            student.classRollNo
        ),

        "universityRollNo": (
            student.universityRollNo
        ),

        "cgpa": student.cgpa,

        "skills": student.skills,

        "phone": student.phone,

        "city": student.city,

        "bio": student.bio,

        "languages": (
            student.languages.split(",")
            if student.languages
            else []
        ),

        "status": student.status,

        "resume": student.resume,

        "linkedin": student.linkedin,

        "statusUpdatedAt": (
            student.status_updated_at.isoformat()
            if student.status_updated_at
            else None
        ),

        "createdAt": (
            student.created_at.isoformat()
            if student.created_at
            else None
        ),
    }


# ==================================================
# 🚀 CREATE PLACEMENT DRIVE
# ==================================================
@placement_drive_bp.route(
    "/create",
    methods=["POST"]
)
@jwt_required()
def create_placement_drive():

    try:

        claims = get_jwt()

        if not is_admin(claims):
            return unauthorized()

        college = get_college_from_claims(
            claims
        )

        if not college:
            return jsonify({
                "success": False,
                "message": "College not found"
            }), 404

        data = request.get_json() or {}

        company_name = data.get(
            "company_name",
            ""
        ).strip()

        drive_name = data.get(
            "drive_name",
            ""
        ).strip()

        phases = data.get(
            "phases",
            []
        )

        if not company_name:

            return jsonify({
                "success": False,
                "message": "Company name is required"
            }), 400

        if not drive_name:

            return jsonify({
                "success": False,
                "message": "Drive name is required"
            }), 400

        if not phases or len(phases) == 0:

            return jsonify({
                "success": False,
                "message": "At least one phase is required"
            }), 400

        new_drive = PlacementDrive(
            company_name=company_name,

            drive_name=drive_name,

            college_id=college.id,

            created_at=datetime.utcnow()
        )

        db.session.add(new_drive)

        db.session.flush()

        for index, phase_name in enumerate(
            phases
        ):

            clean_phase = str(
                phase_name
            ).strip()

            if not clean_phase:
                continue

            new_phase = PlacementPhase(
                drive_id=new_drive.id,

                phase_order=index + 1,

                phase_name=clean_phase
            )

            db.session.add(new_phase)

        db.session.commit()

        logger.info(
            f"Placement drive created: "
            f"{new_drive.drive_name}"
        )

        return jsonify({
            "success": True,
            "message": "Placement drive created successfully",

            "drive": {
                "id": new_drive.id,

                "company_name": (
                    new_drive.company_name
                ),

                "drive_name": (
                    new_drive.drive_name
                ),
            }
        }), 201

    except Exception as e:

        db.session.rollback()

        logger.error(
            f"Create drive error: {str(e)}"
        )

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ==================================================
# 📥 GET ALL PLACEMENT DRIVES
# ==================================================
@placement_drive_bp.route(
    "/all",
    methods=["GET"]
)
@jwt_required()
def get_all_drives():

    try:

        claims = get_jwt()

        if not is_admin(claims):
            return unauthorized()

        college = get_college_from_claims(
            claims
        )

        if not college:

            return jsonify({
                "success": False,
                "message": "College not found"
            }), 404

        drives = PlacementDrive.query.filter_by(
            college_id=college.id
        ).order_by(
            PlacementDrive.created_at.desc()
        ).all()

        drives_data = []

        for drive in drives:

            phases = PlacementPhase.query.filter_by(
                drive_id=drive.id
            ).order_by(
                PlacementPhase.phase_order
            ).all()

            drives_data.append({

                "id": drive.id,

                "company_name": (
                    drive.company_name
                ),

                "drive_name": (
                    drive.drive_name
                ),

                "college_id": (
                    drive.college_id
                ),

                "created_at": (
                    drive.created_at.isoformat()
                    if drive.created_at
                    else None
                ),

                "total_phases": len(phases),

                "phases": [

                    {
                        "id": phase.id,

                        "phase_name": (
                            phase.phase_name
                        ),

                        "phase_order": (
                            phase.phase_order
                        ),
                    }

                    for phase in phases
                ]
            })

        return jsonify({
            "success": True,
            "count": len(drives_data),
            "drives": drives_data
        }), 200

    except Exception as e:

        logger.error(
            f"Fetch drives error: {str(e)}"
        )

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
# ==================================================
# 🗑 DELETE PLACEMENT DRIVE
# ==================================================
@placement_drive_bp.route(
    "/delete/<int:drive_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_placement_drive(drive_id):

    try:

        claims = get_jwt()

        if not is_admin(claims):
            return unauthorized()

        college = get_college_from_claims(
            claims
        )

        if not college:

            return jsonify({
                "success": False,
                "message": "College not found"
            }), 404

        # ==================================================
        # 🚀 FIND DRIVE
        # ==================================================
        drive = PlacementDrive.query.filter_by(
            id=drive_id,
            college_id=college.id
        ).first()

        if not drive:

            return jsonify({
                "success": False,
                "message": "Drive not found"
            }), 404

        # ==================================================
        # 🚀 DELETE PHASE STATUSES
        # ==================================================
        StudentPhaseStatus.query.filter_by(
            drive_id=drive.id
        ).delete()

        # ==================================================
        # 🚀 DELETE PHASES
        # ==================================================
        PlacementPhase.query.filter_by(
            drive_id=drive.id
        ).delete()

        # ==================================================
        # 🚀 DELETE DRIVE
        # ==================================================
        db.session.delete(drive)

        db.session.commit()

        logger.info(
            f"Placement drive deleted: "
            f"{drive.company_name}"
        )

        return jsonify({

            "success": True,

            "message":
                "Placement drive deleted successfully",
        }), 200

    except Exception as e:

        db.session.rollback()

        logger.error(
            f"Delete drive error: {str(e)}"
        )

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ==================================================
# 🔍 SEARCH STUDENTS
# ==================================================
@placement_drive_bp.route(
    "/search-students",
    methods=["GET"]
)
@jwt_required()
def search_students():

    try:

        claims = get_jwt()

        if not is_admin(claims):
            return unauthorized()

        college = get_college_from_claims(
            claims
        )

        if not college:

            return jsonify({
                "success": False,
                "message": "College not found"
            }), 404

        query = request.args.get(
            "query",
            ""
        ).strip()

        if not query:

            return jsonify({
                "success": True,
                "students": []
            }), 200

        students = Student.query.filter(
            Student.college_id == college.id,

            or_(

                Student.name.ilike(
                    f"%{query}%"
                ),

                Student.section.ilike(
                    f"%{query}%"
                ),

                Student.branch.ilike(
                    f"%{query}%"
                ),

                Student.classRollNo.ilike(
                    f"%{query}%"
                ),

                Student.universityRollNo.ilike(
                    f"%{query}%"
                ),
            )

        ).order_by(
            Student.created_at.desc()
        ).limit(20).all()

        return jsonify({
            "success": True,

            "count": len(students),

            "students": [
                serialize_student(s)
                for s in students
            ]
        }), 200

    except Exception as e:

        logger.error(
            f"Student search error: {str(e)}"
        )

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ==================================================
# 🎯 UPDATE PHASE STATUS
# ==================================================
@placement_drive_bp.route(
    "/update-phase-status",
    methods=["POST"]
)
@jwt_required()
def update_phase_status():

    try:

        # ==================================================
        # 🔐 JWT
        # ==================================================
        claims = get_jwt()

        if not is_admin(claims):
            return unauthorized()

        college = get_college_from_claims(
            claims
        )

        if not college:
            return jsonify({
                "success": False,
                "message": "College not found"
            }), 404

        # ==================================================
        # 📦 DATA
        # ==================================================
        data = request.get_json() or {}

        student_id = data.get(
            "student_id"
        )

        drive_id = data.get(
            "drive_id"
        )

        # 🚀 MULTI PHASE SUPPORT
        phase_ids = data.get(
            "phase_ids",
            []
        )

        status = str(
            data.get("status", "")
        ).upper().strip()

        remarks = data.get(
            "remarks",
            ""
        )

        # ==================================================
        # 🔐 VALIDATION
        # ==================================================
        if not student_id:
            return jsonify({
                "success": False,
                "message": "Student ID required"
            }), 400

        if not drive_id:
            return jsonify({
                "success": False,
                "message": "Drive ID required"
            }), 400

        if (
            not phase_ids or
            len(phase_ids) == 0
        ):
            return jsonify({
                "success": False,
                "message": "At least one phase required"
            }), 400

        if status not in [
            "PENDING",
            "CLEARED",
            "REJECTED"
        ]:
            return jsonify({
                "success": False,
                "message": "Invalid status"
            }), 400

        # ==================================================
        # 👨‍🎓 STUDENT VALIDATION
        # ==================================================
        student = Student.query.filter_by(
            id=student_id,
            college_id=college.id
        ).first()

        if not student:
            return jsonify({
                "success": False,
                "message": "Student not found"
            }), 404

        # ==================================================
        # 🚀 DRIVE VALIDATION
        # ==================================================
        drive = PlacementDrive.query.filter_by(
            id=drive_id,
            college_id=college.id
        ).first()

        if not drive:
            return jsonify({
                "success": False,
                "message": "Drive not found"
            }), 404

        # ==================================================
        # 📌 ALL PHASES
        # ==================================================
        all_phases = PlacementPhase.query.filter_by(
            drive_id=drive.id
        ).order_by(
            PlacementPhase.phase_order
        ).all()

        final_phase = (
            all_phases[-1]
            if all_phases
            else None
        )

        overall_status = "IN PROCESS"

        # ==================================================
        # 🔁 LOOP MULTIPLE PHASES
        # ==================================================
        for phase_id in phase_ids:

            phase = PlacementPhase.query.filter_by(
                id=phase_id,
                drive_id=drive.id
            ).first()

            if not phase:
                continue

            existing = StudentPhaseStatus.query.filter_by(
                student_id=student.id,
                drive_id=drive.id,
                phase_id=phase.id
            ).first()

            # ==================================================
            # ❌ REJECTED
            # ==================================================
            if status == "REJECTED":

                overall_status = "REJECTED"

                student.status = "UNPLACED"

            # ==================================================
            # ✅ FINAL PHASE CLEARED
            # ==================================================
            elif (
                status == "CLEARED"
                and final_phase
                and phase.id == final_phase.id
            ):

                overall_status = "PLACED"

                student.status = "PLACED"

            # ==================================================
            # 🔄 IN PROCESS
            # ==================================================
            else:

                overall_status = "IN PROCESS"

                student.status = "PENDING"

            # ==================================================
            # 🔄 UPDATE EXISTING
            # ==================================================
            if existing:

                existing.status = status

                existing.overall_status = (
                    overall_status
                )

                existing.remarks = remarks

                existing.updated_by = claims.get(
                    "email"
                )

                existing.updated_at = (
                    datetime.utcnow()
                )

            # ==================================================
            # ➕ CREATE NEW
            # ==================================================
            else:

                new_status = StudentPhaseStatus(

                    student_id=student.id,

                    drive_id=drive.id,

                    phase_id=phase.id,

                    status=status,

                    overall_status=overall_status,

                    remarks=remarks,

                    updated_by=claims.get(
                        "email"
                    ),

                    created_at=datetime.utcnow(),

                    updated_at=datetime.utcnow()
                )

                db.session.add(new_status)

        # ==================================================
        # 💾 SAVE
        # ==================================================
        student.status_updated_at = (
            datetime.utcnow()
        )

        db.session.commit()

        logger.info(
            f"Updated multiple phase status "
            f"Student={student.id} "
            f"Status={status}"
        )

        return jsonify({

            "success": True,

            "message":
                "Phase statuses updated successfully",

            "student_status": (
                student.status
            ),

            "overall_status": (
                overall_status
            )
        }), 200

    except Exception as e:

        db.session.rollback()

        logger.error(
            f"Update phase error: {str(e)}"
        )

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500