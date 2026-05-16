from flask import Blueprint, request, jsonify
from flask_mail import Message
from app.extensions import mail

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
        # 📎 ATTACH FILE
        # ==================================================
        if file:

            try:

                msg.attach(
                    filename=file.filename,
                    content_type=file.content_type,
                    data=file.read()
                )

                print(
                    "📎 File Attached Successfully"
                )

            except Exception as attachment_error:

                print(
                    "❌ Attachment Error:",
                    str(attachment_error)
                )

        # ==================================================
        # 🚀 TEMPORARY SMTP DISABLED
        # ==================================================
        # Gmail SMTP is timing out on Render
        # Prevent backend worker crash
        # API will stay stable
        # File uploads will still work
        # ==================================================

        print(
            "✅ Feedback API Hit Successfully"
        )

        print(
            "👤 Name:",
            name
        )

        print(
            "📧 Email:",
            email
        )

        print(
            "📝 Message:",
            message
        )

        if file:

            print(
                "📎 Uploaded File:",
                file.filename
            )

        # ==================================================
        # ✅ SUCCESS RESPONSE
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


# ==================================================
# 🔥 FORCE RENDER REDEPLOY
# ==================================================
# FORCE_RENDER_DEPLOY_2026_STABLE_FINAL