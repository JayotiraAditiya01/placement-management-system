from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import event
from database.db import db

# ==================================================
# 🎓 STUDENT MODEL (PRODUCTION + SCALING READY)
# ==================================================
class Student(db.Model):
    __tablename__ = "students"

    # ================= PRIMARY KEY =================
    id = db.Column(db.Integer, primary_key=True)

    # ================= BASIC =================
    name = db.Column(db.String(120), nullable=True)

    # 🔥 EMAIL (UNIQUE + INDEXED)
    email = db.Column(
        db.String(120),
        nullable=False,
        unique=True,
        index=True
    )

    # 🔐 PASSWORD (HASHED)
    password = db.Column(db.String(255), nullable=False)

    # ================= ACADEMIC =================
    branch = db.Column(db.String(50), index=True)
    section = db.Column(db.String(10), index=True)
    classRollNo = db.Column(db.String(50), index=True)
    universityRollNo = db.Column(db.String(50), index=True)
    cgpa = db.Column(db.Float, index=True)

    # ================= CONTACT =================
    phone = db.Column(db.String(20))
    city = db.Column(db.String(100), index=True)

    # ================= PROFILE =================
    skills = db.Column(db.Text)
    languages = db.Column(db.Text)
    bio = db.Column(db.Text)

    # ================= LINKS =================
    resume = db.Column(db.String(300))
    linkedin = db.Column(db.String(300))

    # ================= STATUS =================
    status = db.Column(
        db.String(20),
        default="PENDING",
        index=True
    )
    status_updated_at = db.Column(db.DateTime, nullable=True)

    # ================= TIMESTAMPS =================
    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        index=True
    )
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        index=True
    )

    # ==================================================
    # 🏫 COLLEGE RELATION
    # ==================================================
    college_id = db.Column(
        db.Integer,
        db.ForeignKey("colleges.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # ==================================================
    # 🔥 COMPOSITE INDEXES (HIGH PERFORMANCE)
    # ==================================================
    __table_args__ = (
        db.Index('idx_college_status', 'college_id', 'status'),
        db.Index('idx_college_branch', 'college_id', 'branch'),
        db.Index('idx_college_cgpa', 'college_id', 'cgpa'),
    )

    # ==================================================
    # 🔧 HELPER METHODS
    # ==================================================
    def normalize_email(self):
        if self.email:
            self.email = self.email.strip().lower()

    # 🔐 PASSWORD METHODS
    def set_password(self, raw_password):
        self.password = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        return check_password_hash(self.password, raw_password)

    def update_profile(self, data: dict):
        """Safe update helper"""
        for key, value in data.items():
            if hasattr(self, key):
                setattr(self, key, value)

        self.updated_at = datetime.utcnow()

    # ==================================================
    # 🪝 AUTO HOOKS
    # ==================================================
    @staticmethod
    def before_insert(mapper, connection, target):
        target.normalize_email()

    @staticmethod
    def before_update(mapper, connection, target):
        target.normalize_email()

    @staticmethod
    def track_status_change(mapper, connection, target):
        if target.status:
            target.status_updated_at = datetime.utcnow()

    # ================= REPRESENT =================
    def __repr__(self):
        return f"<Student {self.email}>"


# ==================================================
# 🔗 SQLALCHEMY EVENTS
# ==================================================
event.listen(Student, "before_insert", Student.before_insert)
event.listen(Student, "before_update", Student.before_update)
event.listen(Student, "before_update", Student.track_status_change)