import logging

logger = logging.getLogger(__name__)


# ==================================================
# 🎯 WEIGHT CONFIG (CAN BE TUNED LATER)
# ==================================================
WEIGHTS = {
    "cgpa": 0.35,
    "skills": 0.20,
    "projects": 0.15,
    "resume": 0.10,
    "linkedin": 0.05,
    "communication": 0.05,
    "consistency": 0.10
}


# ==================================================
# 🔥 MAIN PREDICTION FUNCTION
# ==================================================
def predict_placement(student):
    """
    Predict placement probability based on student profile
    """

    try:
        score = 0
        breakdown = {}

        # ================= CGPA =================
        cgpa_score = calculate_cgpa_score(student.cgpa)
        score += cgpa_score * WEIGHTS["cgpa"]
        breakdown["cgpa"] = cgpa_score

        # ================= SKILLS =================
        skills_score = calculate_skills_score(student.skills)
        score += skills_score * WEIGHTS["skills"]
        breakdown["skills"] = skills_score

        # ================= PROJECTS =================
        project_score = calculate_project_score(student.skills)
        score += project_score * WEIGHTS["projects"]
        breakdown["projects"] = project_score

        # ================= RESUME =================
        resume_score = 1 if student.resume else 0
        score += resume_score * WEIGHTS["resume"]
        breakdown["resume"] = resume_score

        # ================= LINKEDIN =================
        linkedin_score = 1 if student.linkedin else 0
        score += linkedin_score * WEIGHTS["linkedin"]
        breakdown["linkedin"] = linkedin_score

        # ================= COMMUNICATION =================
        comm_score = calculate_communication_score(student.languages)
        score += comm_score * WEIGHTS["communication"]
        breakdown["communication"] = comm_score

        # ================= CONSISTENCY =================
        consistency_score = calculate_consistency(student)
        score += consistency_score * WEIGHTS["consistency"]
        breakdown["consistency"] = consistency_score

        # ================= FINAL =================
        probability = round(score * 100, 2)

        return {
            "placement_probability": probability,
            "confidence_level": get_confidence_level(probability),
            "breakdown": breakdown
        }

    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")

        return {
            "placement_probability": 0,
            "confidence_level": "LOW",
            "breakdown": {}
        }


# ==================================================
# 🔧 SCORING FUNCTIONS
# ==================================================

def calculate_cgpa_score(cgpa):
    if not cgpa:
        return 0

    if cgpa >= 9:
        return 1
    elif cgpa >= 8:
        return 0.85
    elif cgpa >= 7:
        return 0.7
    elif cgpa >= 6:
        return 0.5
    else:
        return 0.3


def calculate_skills_score(skills):
    if not skills:
        return 0

    skill_list = [s.strip().lower() for s in skills.split(",")]

    high_value_skills = [
        "python", "java", "react", "machine learning",
        "data science", "sql", "flask", "django"
    ]

    score = 0
    for skill in skill_list:
        if skill in high_value_skills:
            score += 1

    return min(score / 5, 1)  # cap at 1


def calculate_project_score(skills):
    if not skills:
        return 0

    # simple heuristic
    if len(skills.split(",")) >= 5:
        return 1
    elif len(skills.split(",")) >= 3:
        return 0.7
    else:
        return 0.4


def calculate_communication_score(languages):
    if not languages:
        return 0

    langs = [l.strip().lower() for l in languages.split(",")]

    if "english" in langs:
        return 1
    elif len(langs) >= 2:
        return 0.7
    else:
        return 0.4


def calculate_consistency(student):
    if not student.created_at or not student.updated_at:
        return 0.5

    delta = (student.updated_at - student.created_at).days

    if delta <= 7:
        return 1
    elif delta <= 30:
        return 0.7
    else:
        return 0.4


# ==================================================
# 🔥 CONFIDENCE LEVEL
# ==================================================

def get_confidence_level(probability):
    if probability >= 75:
        return "HIGH"
    elif probability >= 50:
        return "MEDIUM"
    else:
        return "LOW"