"""
Router untuk English Guess The Word Quiz
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, Literal
from data.english_guess import ENGLISH_QUESTIONS

router = APIRouter(prefix="/quiz/english", tags=["english_quiz"])

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
    """Mengambil 10 soal untuk level tertentu"""
    # Hitung index start untuk level
    start_index = (level - 1) * QUESTIONS_PER_LEVEL
    end_index = start_index + QUESTIONS_PER_LEVEL
    
    # Ambil soal untuk level ini
    level_questions = ENGLISH_QUESTIONS[start_index:end_index]
    
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
    for q in ENGLISH_QUESTIONS:
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
        "total_questions": len(ENGLISH_QUESTIONS)
    }
