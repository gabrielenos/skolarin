"""
Router untuk Quiz Zone Multiple Choice
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from data.quiz_zone import BAHASA_INDONESIA_MCQ, ENGLISH_MCQ, MATEMATIKA_MCQ

router = APIRouter(prefix="/quiz-zone", tags=["quiz_zone"])

# Category mapping
CATEGORY_MAP = {
    "indonesia": BAHASA_INDONESIA_MCQ,
    "english": ENGLISH_MCQ,
    "matematika": MATEMATIKA_MCQ,
}

class QuestionResponse(BaseModel):
    id: int
    question: str
    options: list[str]

class QuestionsResponse(BaseModel):
    category: str
    level: int
    total_questions: int
    questions: list[QuestionResponse]

class AnswerRequest(BaseModel):
    category: str
    level: int
    question_id: int
    answer_index: int

class CheckAnswerResponse(BaseModel):
    correct: bool
    correct_answer_index: int
    message: str

@router.get("/questions")
def get_questions(
    category: str = Query(..., description="Category: indonesia, english, matematika"),
    level: int = Query(1, ge=1, le=11)
):
    """Mengambil soal multiple choice berdasarkan kategori dan level"""
    category_lower = category.lower()
    
    if category_lower not in CATEGORY_MAP:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid category. Available: {list(CATEGORY_MAP.keys())}"
        )
    
    category_data = CATEGORY_MAP[category_lower]
    level_key = f"level_{level}"
    
    if level_key not in category_data:
        raise HTTPException(
            status_code=404, 
            detail=f"Level {level} not found for category {category}"
        )
    
    questions = category_data[level_key]
    
    # Hide correct_answer for response
    questions_for_response = []
    for q in questions:
        questions_for_response.append({
            "id": q["id"],
            "question": q["question"],
            "options": q["options"]
        })
    
    return {
        "category": category,
        "level": level,
        "total_questions": len(questions_for_response),
        "questions": questions_for_response
    }

@router.post("/check-answer", response_model=CheckAnswerResponse)
def check_answer(request: AnswerRequest):
    """Memeriksa jawaban user"""
    category_lower = request.category.lower()
    
    if category_lower not in CATEGORY_MAP:
        raise HTTPException(status_code=400, detail="Invalid category")
    
    category_data = CATEGORY_MAP[category_lower]
    level_key = f"level_{request.level}"
    
    if level_key not in category_data:
        raise HTTPException(status_code=404, detail="Level not found")
    
    # Find question by ID
    question = None
    for q in category_data[level_key]:
        if q["id"] == request.question_id:
            question = q
            break
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    is_correct = request.answer_index == question["correct_answer"]
    
    return CheckAnswerResponse(
        correct=is_correct,
        correct_answer_index=question["correct_answer"],
        message="Benar!" if is_correct else "Salah!"
    )

@router.get("/categories")
def get_categories():
    """Mengambil daftar kategori dan jumlah level yang tersedia"""
    result = {}
    for cat_name, cat_data in CATEGORY_MAP.items():
        levels = [int(k.split("_")[1]) for k in cat_data.keys() if k.startswith("level_")]
        result[cat_name] = {
            "total_levels": len(levels),
            "levels": sorted(levels)
        }
    return result
