from database.db import db

from datetime import datetime


# ==================================================
# 🚀 PLACEMENT DRIVE MODEL
# ==================================================
class PlacementDrive(db.Model):

    __tablename__ = "placement_drives"

    # ==================================================
    # PRIMARY KEY
    # ==================================================
    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # ==================================================
    # BASIC DETAILS
    # ==================================================
    company_name = db.Column(
        db.String(200),
        nullable=False
    )

    drive_name = db.Column(
        db.String(200),
        nullable=False
    )

    # ==================================================
    # COLLEGE RELATION
    # ==================================================
    college_id = db.Column(
        db.Integer,
        nullable=False,
        index=True
    )

    # ==================================================
    # DRIVE STATUS
    # ==================================================
    is_active = db.Column(
        db.Boolean,
        default=True
    )

    # ==================================================
    # TIMESTAMPS
    # ==================================================
    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # ==================================================
    # 🔗 RELATIONSHIP WITH PHASES
    # ==================================================
    phases = db.relationship(
        "PlacementPhase",

        backref="drive",

        cascade="all, delete-orphan",

        lazy=True
    )

    # ==================================================
    # REPRESENTATION
    # ==================================================
    def __repr__(self):

        return (
            f"<PlacementDrive "
            f"{self.company_name}>"
        )


# ==================================================
# 📌 PLACEMENT PHASE MODEL
# ==================================================
class PlacementPhase(db.Model):

    __tablename__ = "placement_phases"

    # ==================================================
    # PRIMARY KEY
    # ==================================================
    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # ==================================================
    # DRIVE RELATION
    # ==================================================
    drive_id = db.Column(
        db.Integer,

        db.ForeignKey(
            "placement_drives.id"
        ),

        nullable=False
    )

    # ==================================================
    # PHASE DETAILS
    # ==================================================
    phase_order = db.Column(
        db.Integer,
        nullable=False
    )

    phase_name = db.Column(
        db.String(200),
        nullable=False
    )

    # ==================================================
    # OPTIONAL DESCRIPTION
    # ==================================================
    description = db.Column(
        db.Text,
        nullable=True
    )

    # ==================================================
    # ACTIVE STATUS
    # ==================================================
    is_active = db.Column(
        db.Boolean,
        default=True
    )

    # ==================================================
    # TIMESTAMPS
    # ==================================================
    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # ==================================================
    # REPRESENTATION
    # ==================================================
    def __repr__(self):

        return (
            f"<PlacementPhase "
            f"{self.phase_name}>"
        )


# ==================================================
# 👨‍🎓 STUDENT PHASE STATUS MODEL
# ==================================================
class StudentPhaseStatus(db.Model):

    __tablename__ = "student_phase_status"

    # ==================================================
    # PRIMARY KEY
    # ==================================================
    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # ==================================================
    # STUDENT RELATION
    # ==================================================
    student_id = db.Column(
        db.Integer,
        nullable=False,
        index=True
    )

    # ==================================================
    # DRIVE RELATION
    # ==================================================
    drive_id = db.Column(
        db.Integer,

        db.ForeignKey(
            "placement_drives.id"
        ),

        nullable=False,

        index=True
    )

    # ==================================================
    # PHASE RELATION
    # ==================================================
    phase_id = db.Column(
        db.Integer,

        db.ForeignKey(
            "placement_phases.id"
        ),

        nullable=False,

        index=True
    )

    # ==================================================
    # STATUS
    # PENDING
    # CLEARED
    # REJECTED
    # ==================================================
    status = db.Column(
        db.String(50),
        default="PENDING",
        index=True
    )

    # ==================================================
    # OVERALL RESULT
    # IN PROCESS
    # PLACED
    # REJECTED
    # ==================================================
    overall_status = db.Column(
        db.String(50),
        default="IN PROCESS",
        index=True
    )

    # ==================================================
    # ADMIN REMARKS
    # ==================================================
    remarks = db.Column(
        db.Text,
        nullable=True
    )

    # ==================================================
    # TRACKING
    # ==================================================
    updated_by = db.Column(
        db.String(120),
        nullable=True
    )

    # ==================================================
    # TIMESTAMPS
    # ==================================================
    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # ==================================================
    # REPRESENTATION
    # ==================================================
    def __repr__(self):

        return (
            f"<StudentPhaseStatus "
            f"Student={self.student_id} "
            f"Status={self.status}>"
        )