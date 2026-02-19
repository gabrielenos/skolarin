"""
Self Challenge - English Questions
File terpisah untuk soal Bahasa Inggris
"""

from typing import List, Dict

# 30 Soal Bahasa Inggris untuk Self Challenge
ENGLISH_QUESTIONS = [
    {
        "id": 1,
        "question": "She ___ to school every day.",
        "options": ["A. go", "B. goes", "C. going", "D. gone"],
        "correct_answer": 1
    },
    {
        "id": 2,
        "question": "They ___ playing football now.",
        "options": ["A. is", "B. am", "C. are", "D. be"],
        "correct_answer": 2
    },
    {
        "id": 3,
        "question": "I ___ a student.",
        "options": ["A. is", "B. are", "C. am", "D. be"],
        "correct_answer": 2
    },
    {
        "id": 4,
        "question": "We ___ dinner last night.",
        "options": ["A. eat", "B. eats", "C. ate", "D. eaten"],
        "correct_answer": 2
    },
    {
        "id": 5,
        "question": "She has ___ her homework.",
        "options": ["A. finish", "B. finished", "C. finishing", "D. finishes"],
        "correct_answer": 1
    },
    {
        "id": 6,
        "question": "The opposite of \"happy\" is…",
        "options": ["A. Glad", "B. Sad", "C. Angry", "D. Excited"],
        "correct_answer": 1
    },
    {
        "id": 7,
        "question": "There ___ a book on the table.",
        "options": ["A. is", "B. are", "C. were", "D. be"],
        "correct_answer": 0
    },
    {
        "id": 8,
        "question": "We ___ watching TV when he arrived.",
        "options": ["A. was", "B. were", "C. are", "D. is"],
        "correct_answer": 1
    },
    {
        "id": 9,
        "question": "He is taller ___ me.",
        "options": ["A. than", "B. from", "C. with", "D. to"],
        "correct_answer": 0
    },
    {
        "id": 10,
        "question": "She can ___ English very well.",
        "options": ["A. speaks", "B. speaking", "C. speak", "D. spoke"],
        "correct_answer": 2
    },
    {
        "id": 11,
        "question": "My father ___ in a bank.",
        "options": ["A. work", "B. works", "C. working", "D. worked"],
        "correct_answer": 1
    },
    {
        "id": 12,
        "question": "I have two ___",
        "options": ["A. child", "B. childs", "C. children", "D. childrens"],
        "correct_answer": 2
    },
    {
        "id": 13,
        "question": "This is ___ apple.",
        "options": ["A. a", "B. an", "C. the", "D. some"],
        "correct_answer": 1
    },
    {
        "id": 14,
        "question": "They ___ to Bali next week.",
        "options": ["A. go", "B. goes", "C. will go", "D. went"],
        "correct_answer": 2
    },
    {
        "id": 15,
        "question": "The cat is ___ the table.",
        "options": ["A. in", "B. on", "C. at", "D. under"],
        "correct_answer": 1
    },
    {
        "id": 16,
        "question": "She ___ coffee every morning.",
        "options": ["A. drink", "B. drinks", "C. drank", "D. drinking"],
        "correct_answer": 1
    },
    {
        "id": 17,
        "question": "We ___ study for the exam tomorrow.",
        "options": ["A. must", "B. musts", "C. musted", "D. musting"],
        "correct_answer": 0
    },
    {
        "id": 18,
        "question": "He ___ to the market yesterday.",
        "options": ["A. go", "B. goes", "C. went", "D. going"],
        "correct_answer": 2
    },
    {
        "id": 19,
        "question": "The movie was very ___",
        "options": ["A. interest", "B. interested", "C. interesting", "D. interests"],
        "correct_answer": 2
    },
    {
        "id": 20,
        "question": "I am afraid ___ dogs.",
        "options": ["A. of", "B. from", "C. with", "D. at"],
        "correct_answer": 0
    },
    {
        "id": 21,
        "question": "She is the ___ student in the class.",
        "options": ["A. smart", "B. smarter", "C. smartest", "D. more smart"],
        "correct_answer": 2
    },
    {
        "id": 22,
        "question": "There are ___ students in the classroom.",
        "options": ["A. much", "B. little", "C. many", "D. fewest"],
        "correct_answer": 2
    },
    {
        "id": 23,
        "question": "He ___ his car every Sunday.",
        "options": ["A. wash", "B. washes", "C. washed", "D. washing"],
        "correct_answer": 1
    },
    {
        "id": 24,
        "question": "I was born ___ 2008.",
        "options": ["A. in", "B. on", "C. at", "D. by"],
        "correct_answer": 0
    },
    {
        "id": 25,
        "question": "She ___ not like spicy food.",
        "options": ["A. do", "B. does", "C. did", "D. doing"],
        "correct_answer": 1
    },
    {
        "id": 26,
        "question": "We have lived here ___ five years.",
        "options": ["A. since", "B. for", "C. from", "D. by"],
        "correct_answer": 1
    },
    {
        "id": 27,
        "question": "If it rains, we ___ stay at home.",
        "options": ["A. will", "B. would", "C. are", "D. were"],
        "correct_answer": 0
    },
    {
        "id": 28,
        "question": "The teacher asked me ___ the door.",
        "options": ["A. open", "B. opened", "C. to open", "D. opening"],
        "correct_answer": 2
    },
    {
        "id": 29,
        "question": "He is good ___ mathematics.",
        "options": ["A. in", "B. on", "C. at", "D. for"],
        "correct_answer": 2
    },
    {
        "id": 30,
        "question": "She ___ reading a book when I called her.",
        "options": ["A. is", "B. was", "C. were", "D. be"],
        "correct_answer": 1
    }
]


def get_english_questions(count: int = 30) -> List[Dict]:
    """Ambil soal Bahasa Inggris, diacak"""
    import random
    questions = ENGLISH_QUESTIONS.copy()
    random.shuffle(questions)
    return questions[:count]


def check_english_answer(question_id: int, selected_answer: int) -> bool:
    """Cek jawaban Bahasa Inggris"""
    question = next((q for q in ENGLISH_QUESTIONS if q["id"] == question_id), None)
    if question:
        return selected_answer == question["correct_answer"]
    return False


def get_english_correct_answer(question_id: int) -> int | None:
    """Ambil jawaban benar untuk soal tertentu"""
    question = next((q for q in ENGLISH_QUESTIONS if q["id"] == question_id), None)
    if question:
        return question["correct_answer"]
    return None
