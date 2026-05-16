from flask import Blueprint, request, jsonify
import resend
import os
import base64

# ==================================================
# 🔥 RESEND API KEY
# ==================================================
resend.api_key = os.getenv("RESEND_API_KEY")

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
        # 📎 ATTACHMENT PREPARATION
        # ==================================================
        attachments = []

        attachment_name = None

        if file:

            try:

                attachment_name = file.filename

                file_data = file.read()

                encoded_file = base64.b64encode(
                    file_data
                ).decode("utf-8")

                attachments.append({

                    "filename": file.filename,

                    "content": encoded_file
                })

                print(
                    "📎 File Prepared Successfully"
                )

            except Exception as attachment_error:

                print(
                    "❌ Attachment Error:",
                    str(attachment_error)
                )

        # ==================================================
        # 🚀 SEND EMAIL USING RESEND
        # ==================================================
        resend.Emails.send({

            "from": "onboarding@resend.dev",

            "to": "j.aditiya01@gmail.com",

            "subject": f"🚀 New Feedback from {name}",

            "html": f"""
                <div style="font-family: Arial; padding: 20px;">

                    <h2>📩 New Feedback Received</h2>

                    <hr>

                    <p>
                        <b>👤 Name:</b> {name}
                    </p>

                    <p>
                        <b>📧 Email:</b> {email}
                    </p>

                    <p>
                        <b>📝 Message:</b>
                    </p>

                    <p>
                        {message}
                    </p>

                    <p>
                        <b>📎 Attachment:</b>
                        {attachment_name if attachment_name else "No File Uploaded"}
                    </p>

                    <hr>

                    <p>
                        PlacementAI System
                    </p>

                </div>
            """,

            "attachments": attachments
        })

        print(
            "✅ Email Sent Successfully Using Resend"
        )

        # ==================================================
        # ✅ SUCCESS RESPONSE
        # ==================================================
        return jsonify({
            "success": True,
            "message": "Feedback sent successfully"
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
# FORCE_RENDER_DEPLOY_2026_ATTACHMENT_FINAL