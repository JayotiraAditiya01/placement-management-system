import logging

logger = logging.getLogger(__name__)


# ==================================================
# 🔥 MAIN RECOMMENDER FUNCTION
# ==================================================
def recommend_actions(student):
    """
    Generate personalized recommendations for student
    """

    try:
        recommendations = []
        priority = []

        # ================= CGPA =================
        if not student.cgpa or student.cgpa < 7:
            recommendations.append("Improve CGPA above 7 for better placement chances")
            priority.append("HIGH")

        # ================= SKILLS =================
        skills_list = parse_skills(student.skills)

        if len(skills_list) < 3:
            recommendations.append("Add more technical skills (Python, SQL, Web Dev, etc.)")
            priority.append("HIGH")

        elif len(skills_list) < 5:
            recommendations.append("Expand your skillset with advanced technologies")
            priority.append("MEDIUM")

        # ================= PROJECTS =================
        if len(skills_list) < 4:
            recommendations.append("Work on at least 2-3 real-world projects")
            priority.append("HIGH")

        # ================= RESUME =================
        if not student.resume:
            recommendations.append("Upload a professional resume (very important)")
            priority.append("HIGH")

        # ================= LINKEDIN =================
        if not student.linkedin:
            recommendations.append("Create or update your LinkedIn profile")
            priority.append("MEDIUM")

        # ================= COMMUNICATION =================
        if not student.languages or "english" not in student.languages.lower():
            recommendations.append("Improve English communication skills")
            priority.append("MEDIUM")

        # ================= PROFILE COMPLETENESS =================
        completeness_score = calculate_profile_completeness(student)

        if completeness_score < 0.5:
            recommendations.append("Complete your profile (bio, skills, links, etc.)")
            priority.append("HIGH")

        # ================= FINAL STRUCTURE =================
        structured_recommendations = format_recommendations(recommendations, priority)

        return {
            "total_recommendations": len(structured_recommendations),
            "recommendations": structured_recommendations,
            "profile_score": round(completeness_score * 100, 2)
        }

    except Exception as e:
        logger.error(f"Recommendation error: {str(e)}")

        return {
            "total_recommendations": 0,
            "recommendations": [],
            "profile_score": 0
        }


# ==================================================
# 🔧 HELPERS
# ==================================================

def parse_skills(skills):
    if not skills:
        return []
    return [s.strip().lower() for s in skills.split(",") if s.strip()]


def calculate_profile_completeness(student):
    fields = [
        student.name,
        student.email,
        student.branch,
        student.cgpa,
        student.skills,
        student.resume,
        student.linkedin,
        student.phone,
        student.city
    ]

    filled = sum(1 for field in fields if field)
    return filled / len(fields)


def format_recommendations(recommendations, priority_list):
    formatted = []

    for i in range(len(recommendations)):
        formatted.append({
            "message": recommendations[i],
            "priority": priority_list[i]
        })

    return formatted