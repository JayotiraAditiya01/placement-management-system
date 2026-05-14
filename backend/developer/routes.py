from flask import Blueprint, request, jsonify
from flask_mail import Message
from app.extensions import mail   # ✅ FIXED (NO circular import)

# ==================================================
# 🔥 BLUEPRINT
# ==================================================
developer_bp = Blueprint("developer", __name__, url_prefix="/api")

# ==================================================
# 📩 SEND FEEDBACK EMAIL
# ==================================================
@developer_bp.route("/send-feedback", methods=["POST"])
def send_feedback():
    # ✅ CHANGE: Use form + files instead of json
    name = request.form.get("name")
    email = request.form.get("email")
    message = request.form.get("message")
    file = request.files.get("file")  # ✅ NEW

    # ✅ Validation (important)
    if not name or not email or not message:
        return jsonify({
            "success": False,
            "error": "All fields are required"
        }), 400

    try:
        msg = Message(
            subject=f"🚀 New Feedback from {name}",
            recipients=["j.aditiya01@gmail.com"],  # YOUR EMAIL
            body=f"""
==============================
📩 NEW FEEDBACK RECEIVED
==============================

👤 Name: {name}
📧 Email: {email}

📝 Message:
{message}

==============================
PlacementAI System
==============================
            """
        )

        # ==================================================
        # 📎 ATTACH FILE (IF EXISTS)
        # ==================================================
        if file:
            msg.attach(
                filename=file.filename,
                content_type=file.content_type,
                data=file.read()
            )

        mail.send(msg)

        return jsonify({
            "success": True,
            "message": "Feedback sent successfully"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500