from flask import Blueprint, request, jsonify
from flask_mail import Message
from app.extensions import mail   # ✅ FIXED (NO circular import)

# ==================================================
# 🔥 BLUEPRINT
# ==================================================
developer_bp = Blueprint(
    "developer",
    __name__,
    url_prefix="/api"
)

# ==================================================
# 📩 SEND FEEDBACK EMAIL
# ==================================================
@developer_bp.route(
    "/send-feedback",
    methods=["POST"]
)
def send_feedback():

    # ==================================================
    # 📥 GET FORM DATA
    # ==================================================
    name = request.form.get("name")

    email = request.form.get("email")

    message = request.form.get("message")

    file = request.files.get("file")

    # ==================================================
    # ✅ VALIDATION
    # ==================================================
    if not name or not email or not message:

        return jsonify({
            "success": False,
            "error": "All fields are required"
        }), 400

    try:

        # ==================================================
        # 📧 CREATE EMAIL MESSAGE
        # ==================================================
        msg = Message(
            subject=f"🚀 New Feedback from {name}",

            recipients=[
                "j.aditiya01@gmail.com"
            ],

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

        # ==================================================
        # 🚀 SEND EMAIL SAFELY
        # ==================================================
        try:

            mail.send(msg)

            print(
                "✅ Email Sent Successfully"
            )

        except Exception as mail_error:

            print(
                "❌ Mail Error:",
                str(mail_error)
            )

            # ==================================================
            # ⚠ IMPORTANT
            # DO NOT CRASH BACKEND
            # ==================================================
            pass

        # ==================================================
        # ✅ ALWAYS RETURN SUCCESS
        # ==================================================
        return jsonify({
            "success": True,
            "message": "Feedback submitted successfully"
        }), 200

    except Exception as e:

        print(
            "❌ Feedback Route Error:",
            str(e)
        )

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500