from datetime import datetime
import pytz
from database.db import db

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

class Announcement(db.Model):
    __tablename__ = "announcements"

    # ==================================================
    # 🔑 PRIMARY KEY
    # ==================================================
    id = db.Column(db.Integer, primary_key=True)

    # ==================================================
    # 📝 CONTENT
    # ==================================================
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)

    # ==================================================
    # ⏱ TIMESTAMP (🔥 FINAL FIX - STORE UTC)
    # ==================================================
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,  # ✅ STORE UTC
        index=True
    )

    # ==================================================
    # 🏫 MULTI-COLLEGE SUPPORT
    # ==================================================
    college_id = db.Column(
        db.Integer,
        db.ForeignKey("colleges.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # ==================================================
    # 🔧 CONSTRUCTOR (🔥 SAFE UTC)
    # ==================================================
    def __init__(self, title, message, college_id, created_at=None):
        self.title = title
        self.message = message
        self.college_id = college_id

        # ✅ ALWAYS STORE UTC
        self.created_at = created_at if created_at else datetime.utcnow()

    # ==================================================
    # 📦 SERIALIZER (🔥 CONVERT TO IST ONLY HERE)
    # ==================================================
    def to_dict(self):
        ist_time = convert_utc_to_ist(self.created_at)

        return {
            "id": self.id,
            "title": self.title,
            "message": self.message,
            "created_at": (
                ist_time.isoformat() if ist_time else None
            ),
            "college_id": self.college_id
        }

    # ==================================================
    # 🧾 DEBUG REPRESENTATION (UNCHANGED)
    # ==================================================
    def __repr__(self):
        return f"<Announcement id={self.id} title='{self.title}'>"