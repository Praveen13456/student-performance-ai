from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import requests
# --------------------------------
# Create FastAPI application
# --------------------------------

app = FastAPI(
    title="AI Student Performance Prediction API",
    description="API for predicting student academic performance",
    version="1.0"
)


# --------------------------------
# Allow frontend to communicate
# --------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------
# Load trained ML model
# --------------------------------

model = joblib.load("models/student_model.pkl")


# --------------------------------
# Input data structure
# --------------------------------

class StudentData(BaseModel):
    age: int
    study_hours: float
    attendance: float
    previous_score: float
    assignment_score: float
    midterm_score: float
    sleep_hours: float
    extracurricular: int

class ChatRequest(BaseModel):
    question: str
    student: dict
# --------------------------------
# Root endpoint
# --------------------------------

@app.get("/")
def home():
    return {
        "message": "AI Student Performance Prediction API is running!"
    }


# --------------------------------
# Prediction endpoint
# --------------------------------

@app.post("/predict")
def predict(data: StudentData):

    student = pd.DataFrame([{
        "age": data.age,
        "study_hours": data.study_hours,
        "attendance": data.attendance,
        "previous_score": data.previous_score,
        "assignment_score": data.assignment_score,
        "midterm_score": data.midterm_score,
        "sleep_hours": data.sleep_hours,
        "extracurricular": data.extracurricular
    }])

    prediction = model.predict(student)[0]

    # Keep score between 0 and 100
    prediction = max(0, min(100, prediction))

    # Determine grade
    if prediction >= 90:
        grade = "A+"
    elif prediction >= 80:
        grade = "A"
    elif prediction >= 70:
        grade = "B"
    elif prediction >= 60:
        grade = "C"
    elif prediction >= 50:
        grade = "D"
    else:
        grade = "F"

    # Determine performance
    if prediction >= 80:
        performance = "Excellent"
    elif prediction >= 70:
        performance = "Good"
    elif prediction >= 60:
        performance = "Average"
    elif prediction >= 50:
        performance = "Needs Improvement"
    else:
        performance = "At Risk"

    # Determine risk
    if prediction >= 70:
        risk = "Low"
    elif prediction >= 50:
        risk = "Medium"
    else:
        risk = "High"

    return {
        "predicted_score": round(float(prediction), 2),
        "grade": grade,
        "performance": performance,
        "risk": risk
    }
    
@app.post("/chat")
def chat(request: ChatRequest):

    student = request.student
    question = request.question

    prompt = f"""
You are NeuroGrade AI, an academic performance advisor.

You are helping a student understand and improve their academic
performance.

Here is the student's current information:

Age: {student.get("age")}
Study Hours: {student.get("study_hours")} hours/day
Attendance: {student.get("attendance")}%
Previous Score: {student.get("previous_score")}%
Assignment Score: {student.get("assignment_score")}%
Midterm Score: {student.get("midterm_score")}%
Sleep Hours: {student.get("sleep_hours")} hours/day
Extracurricular Activity: {student.get("extracurricular")}

The student asked:

"{question}"

Give a clear, helpful and personalized answer.

Important rules:

1. Base your advice on the student's information when possible.
2. Do not invent student data.
3. If some information is missing, acknowledge that it is missing.
4. Give practical suggestions the student can actually follow.
5. Keep the answer easy to understand.
6. Do not claim that your advice guarantees a particular grade.
7. Do not pretend to be a teacher, doctor, or counselor.
8. Keep the response concise but useful.
"""

    try:

        response = requests.post(
            "http://127.0.0.1:11434/api/chat",

            json={
                "model": "oamazonasgabriel/lfm2.5-230m:bf16-8gbRAM",

                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],

                "stream": False,

                "options": {
                    "temperature": 0.4,
                    "num_ctx": 8192
                }
            },

            timeout=120
        )

        response.raise_for_status()

        data = response.json()

        answer = data["message"]["content"]

        return {
            "answer": answer
        }

    except Exception as e:

        print("Ollama Error:", e)

        return {
            "answer":
                "Sorry, I couldn't connect to the local AI advisor right now. Please make sure Ollama is running."
        }