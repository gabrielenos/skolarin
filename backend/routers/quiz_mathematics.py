"""
Router untuk Math Mania Quiz - Multiple Choice (dari quiz3.py)
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List
import random

# Import soal Matematika dari quiz3.py
try:
    from data.quiz3 import MATH_QUESTIONS
except ImportError:
    import sys
    import os
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from quiz3 import MATH_QUESTIONS

router = APIRouter(prefix="/quiz/mathematics", tags=["mathematics"])

# 10 soal per level, 30 level total
QUESTIONS_PER_LEVEL = 10
TOTAL_LEVELS = 30

class Question(BaseModel):
    id: int
    type: str
    question: str
    options: List[str]
    correctAnswer: int

class AnswerRequest(BaseModel):
    question_id: int
    answer: int

class CheckAnswerResponse(BaseModel):
    correct: bool
    correct_answer: int
    message: str

@router.get("/questions")
def get_questions(level: int = Query(1, ge=1, le=TOTAL_LEVELS)):
    """Mengambil 10 soal matematika untuk level tertentu (dari 30 soal yang di-recycle)"""
    total_unique_questions = len(MATH_QUESTIONS)  # 30 soal
    
    # Hitung posisi awal dengan modulo untuk recycle
    start_index = ((level - 1) * QUESTIONS_PER_LEVEL) % total_unique_questions
    
    # Ambil 10 soal dengan wrap-around jika perlu
    level_questions = []
    for i in range(QUESTIONS_PER_LEVEL):
        index = (start_index + i) % total_unique_questions
        q = MATH_QUESTIONS[index]
        # Transform ke format yang frontend expect
        level_questions.append({
            "id": q["id"],
            "type": "multiple_choice",
            "question": q["question"],
            "options": q["options"],
            "correctAnswer": q["correct_answer"]
        })
    
    # Acak soal untuk variasi
    rng = random.Random()
    rng.shuffle(level_questions)
    
    return {
        "level": level,
        "total_questions": len(level_questions),
        "questions": level_questions
    }

@router.post("/check-answer", response_model=CheckAnswerResponse)
def check_answer(request: AnswerRequest):
    """Memeriksa jawaban user"""
    question = next((q for q in MATH_QUESTIONS if q["id"] == request.question_id), None)
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    is_correct = request.answer == question["correct_answer"]
    
    return CheckAnswerResponse(
        correct=is_correct,
        correct_answer=question["correct_answer"],
        message="Benar!" if is_correct else "Salah!"
    )

@router.get("/total-levels")
def get_total_levels():
    """Mengambil total level yang tersedia"""
    return {
        "total_levels": TOTAL_LEVELS,
        "questions_per_level": QUESTIONS_PER_LEVEL,
        "total_questions": len(MATH_QUESTIONS)
    }
