from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

# ✅ DB IMPORT
from database.db import db

# ==================================================
# 🏫 COLLEGE MODEL
# ==================================================
class College(db.Model):
    __tablename__ = "colleges"

    # ================= PRIMARY KEY =================
    id = db.Column(db.Integer, primary_key=True)

    # ================= BASIC INFO =================
    # 🔥 NORMALIZED NAME (FOR BACKEND LOGIC)
    college_name = db.Column(
        db.String(200),
        unique=True,
        nullable=False,
        index=True
    )

    # 🔥 DISPLAY NAME (FOR UI)
    display_name = db.Column(
        db.String(200),
        nullable=True
    )

    # 🔥 ADMIN EMAIL
    admin_email = db.Column(
        db.String(200),
        unique=True,
        nullable=False,
        index=True
    )

    # 🔐 PASSWORD HASH (SECURE)
    password = db.Column(
        db.String(255),
        nullable=False
    )

    # ================= META =================
    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        index=True
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # ==================================================
    # 🔁 RELATIONSHIP WITH STUDENTS
    # ==================================================
    students = db.relationship(
        "Student",
        backref="college",
        lazy="select",  # 🔥 optimized loading
        cascade="all, delete",
        passive_deletes=True
    )

    # ==================================================
    # 🔧 HELPER METHODS
    # ==================================================
    def normalize_college_name(self):
        if self.college_name:
            self.college_name = self.college_name.strip().lower()

    def normalize_email(self):
        if self.admin_email:
            self.admin_email = self.admin_email.strip().lower()

    def prepare_save(self):
        """Call before saving to DB"""
        self.normalize_college_name()
        self.normalize_email()

    # 🔐 PASSWORD METHODS (VERY IMPORTANT)
    def set_password(self, raw_password):
        self.password = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        return check_password_hash(self.password, raw_password)

    # ==================================================
    # 🪝 AUTO HOOKS (ENSURES DATA CLEANING)
    # ==================================================
    @staticmethod
    def before_insert(mapper, connection, target):
        target.prepare_save()

    @staticmethod
    def before_update(mapper, connection, target):
        target.prepare_save()

    # ================= REPRESENT =================
    def __repr__(self):
        return f"<College {self.college_name}>"


# ==================================================
# 🔗 SQLALCHEMY EVENT LISTENERS
# ==================================================
from sqlalchemy import event

event.listen(College, "before_insert", College.before_insert)
event.listen(College, "before_update", College.before_update)