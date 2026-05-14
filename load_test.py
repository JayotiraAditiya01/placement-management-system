import requests
import threading

URL = "http://127.0.0.1:5000/api/students?page=1&limit=20"

HEADERS = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc3NDcyNjQ2OCwianRpIjoiM2FiZWY5OTEtOTgwZi00Y2MzLWFlYzMtNmI0OGQyMWRkYTNkIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImRhdmlldEBvcmciLCJuYmYiOjE3NzQ3MjY0NjgsImNzcmYiOiJkOGM0ZTIyMi01ZjUyLTRkNWYtYmUzZC1jYjQyZjhmMjU0NTAiLCJleHAiOjE3NzQ3NDQ0NjgsInJvbGUiOiJBRE1JTiIsImNvbGxlZ2UiOiJkYXZpZXQifQ.fu2DBbBXWvYb4yE2tO0D-33DvJZo4z2Uf836mCpAkzg"
}

def hit_api():
    try:
        res = requests.get(URL, headers=HEADERS)
        print(f"Status: {res.status_code}, Time: {res.elapsed.total_seconds()}s")
    except Exception as e:
        print("Error:", e)

threads = []

# 🔥 Simulate 500 users
for i in range(500):
    t = threading.Thread(target=hit_api)
    threads.append(t)
    t.start()

for t in threads:
    t.join()