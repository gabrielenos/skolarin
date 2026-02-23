"""
Router untuk Mathematics Guess The Word Quiz (Word Scramble)
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, Literal
from data.mathematics_scramble import MATHEMATICS_QUESTIONS

router = APIRouter(prefix="/quiz/mathematics", tags=["mathematics"])

# 10 soal per level, 30 level total
QUESTIONS_PER_LEVEL = 10
TOTAL_LEVELS = 30

class Question(BaseModel):
    id: int
    type: str
    sentence: str
    scrambledLetters: list[str]
    hint: str

class AnswerRequest(BaseModel):
    question_id: int
    answer: str

class CheckAnswerResponse(BaseModel):
    correct: bool
    correct_answer: str
    message: str

@router.get("/questions")
def get_questions(level: int = Query(1, ge=1, le=TOTAL_LEVELS)):
    """Mengambil 10 soal untuk level tertentu (dari 50 soal yang di-recycle)"""
    total_unique_questions = len(MATHEMATICS_QUESTIONS)  # 50 soal
    
    # Hitung posisi awal dengan modulo untuk recycle
    start_index = ((level - 1) * QUESTIONS_PER_LEVEL) % total_unique_questions
    
    # Ambil 10 soal dengan wrap-around jika perlu
    level_questions = []
    for i in range(QUESTIONS_PER_LEVEL):
        index = (start_index + i) % total_unique_questions
        level_questions.append(MATHEMATICS_QUESTIONS[index])
    
    # Return soal dengan correctAnswer di-hidden untuk frontend
    questions_for_response = []
    for q in level_questions:
        question_copy = {
            "id": q["id"],
            "type": q["type"],
            "sentence": q["sentence"],
            "scrambledLetters": q["scrambledLetters"],
            "hint": q["hint"]
        }
        questions_for_response.append(question_copy)
    
    return {
        "level": level,
        "total_questions": len(questions_for_response),
        "questions": questions_for_response
    }

@router.post("/check-answer", response_model=CheckAnswerResponse)
def check_answer(request: AnswerRequest):
    """Memeriksa jawaban user"""
    # Cari soal berdasarkan ID
    question = None
    for q in MATHEMATICS_QUESTIONS:
        if q["id"] == request.question_id:
            question = q
            break
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    is_correct = request.answer.upper() == question["correctAnswer"].upper()
    
    return CheckAnswerResponse(
        correct=is_correct,
        correct_answer=question["correctAnswer"],
        message="Benar!" if is_correct else "Salah!"
    )

@router.get("/total-levels")
def get_total_levels():
    """Mengambil total level yang tersedia"""
    return {
        "total_levels": TOTAL_LEVELS,
        "questions_per_level": QUESTIONS_PER_LEVEL,
        "total_questions": len(MATHEMATICS_QUESTIONS)
    }
