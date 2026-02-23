"""
Self Challenge - Mathematics Questions
File terpisah untuk soal Matematika
"""

from typing import List, Dict

# 30 Soal Matematika untuk Self Challenge
MATH_QUESTIONS = [
    {
        "id": 1,
        "question": "Hasil dari 12 + 15 adalah…",
        "options": ["A. 25", "B. 27", "C. 26", "D. 28"],
        "correct_answer": 1
    },
    {
        "id": 2,
        "question": "Hasil dari 45 - 18 adalah…",
        "options": ["A. 27", "B. 28", "C. 26", "D. 29"],
        "correct_answer": 0
    },
    {
        "id": 3,
        "question": "Hasil dari 8 x 7 adalah…",
        "options": ["A. 54", "B. 56", "C. 58", "D. 52"],
        "correct_answer": 1
    },
    {
        "id": 4,
        "question": "Hasil dari 64 ÷ 8 adalah…",
        "options": ["A. 7", "B. 9", "C. 8", "D. 6"],
        "correct_answer": 2
    },
    {
        "id": 5,
        "question": "Nilai dari 5² adalah…",
        "options": ["A. 10", "B. 25", "C. 20", "D. 15"],
        "correct_answer": 1
    },
    {
        "id": 6,
        "question": "Keliling persegi dengan sisi 6 cm adalah…",
        "options": ["A. 24 cm", "B. 36 cm", "C. 12 cm", "D. 18 cm"],
        "correct_answer": 0
    },
    {
        "id": 7,
        "question": "Luas persegi panjang dengan panjang 8 cm dan lebar 5 cm adalah…",
        "options": ["A. 40 cm²", "B. 35 cm²", "C. 45 cm²", "D. 30 cm²"],
        "correct_answer": 0
    },
    {
        "id": 8,
        "question": "Hasil dari 3/4 + 1/4 adalah…",
        "options": ["A. 1", "B. 3/8", "C. 4/8", "D. 2/4"],
        "correct_answer": 0
    },
    {
        "id": 9,
        "question": "Pecahan 1/2 sama dengan…",
        "options": ["A. 2/4", "B. 1/4", "C. 3/4", "D. 4/2"],
        "correct_answer": 0
    },
    {
        "id": 10,
        "question": "Hasil dari 2,5 + 1,3 adalah…",
        "options": ["A. 3,9", "B. 3,8", "C. 3,7", "D. 4,0"],
        "correct_answer": 1
    },
    {
        "id": 11,
        "question": "Rata-rata dari 10, 12, dan 14 adalah…",
        "options": ["A. 11", "B. 12", "C. 13", "D. 10"],
        "correct_answer": 1
    },
    {
        "id": 12,
        "question": "Modus dari data 5, 7, 5, 6, 7, 5, 8 adalah…",
        "options": ["A. 6", "B. 5", "C. 7", "D. 8"],
        "correct_answer": 1
    },
    {
        "id": 13,
        "question": "Median dari data 4, 6, 8, 10, 12 adalah…",
        "options": ["A. 8", "B. 6", "C. 10", "D. 7"],
        "correct_answer": 0
    },
    {
        "id": 14,
        "question": "Jika x + 5 = 12, maka nilai x adalah…",
        "options": ["A. 6", "B. 7", "C. 8", "D. 5"],
        "correct_answer": 1
    },
    {
        "id": 15,
        "question": "Jika 3x = 15, maka nilai x adalah…",
        "options": ["A. 4", "B. 6", "C. 5", "D. 3"],
        "correct_answer": 2
    },
    {
        "id": 16,
        "question": "Faktor persekutuan terbesar (FPB) dari 12 dan 18 adalah…",
        "options": ["A. 6", "B. 3", "C. 9", "D. 12"],
        "correct_answer": 0
    },
    {
        "id": 17,
        "question": "Kelipatan persekutuan terkecil (KPK) dari 4 dan 6 adalah…",
        "options": ["A. 12", "B. 24", "C. 8", "D. 16"],
        "correct_answer": 0
    },
    {
        "id": 18,
        "question": "Hasil dari 2³ adalah…",
        "options": ["A. 6", "B. 8", "C. 9", "D. 4"],
        "correct_answer": 1
    },
    {
        "id": 19,
        "question": "Volume kubus dengan sisi 4 cm adalah…",
        "options": ["A. 64 cm³", "B. 16 cm³", "C. 32 cm³", "D. 48 cm³"],
        "correct_answer": 0
    },
    {
        "id": 20,
        "question": "Jarak yang ditempuh sepeda dengan kecepatan 20 km/jam selama 3 jam adalah…",
        "options": ["A. 60 km", "B. 50 km", "C. 70 km", "D. 40 km"],
        "correct_answer": 0
    },
    {
        "id": 21,
        "question": "Persentase dari 25 dari 100 adalah…",
        "options": ["A. 20%", "B. 30%", "C. 25%", "D. 15%"],
        "correct_answer": 2
    },
    {
        "id": 22,
        "question": "Diskon 20% dari harga Rp 50.000 adalah…",
        "options": ["A. Rp 10.000", "B. Rp 15.000", "C. Rp 20.000", "D. Rp 5.000"],
        "correct_answer": 0
    },
    {
        "id": 23,
        "question": "Skala 1:500 artinya 1 cm di peta mewakili…",
        "options": ["A. 5 meter", "B. 50 meter", "C. 500 meter", "D. 5 km"],
        "correct_answer": 2
    },
    {
        "id": 24,
        "question": "Sudut siku-siku besarnya adalah…",
        "options": ["A. 45°", "B. 90°", "C. 180°", "D. 360°"],
        "correct_answer": 1
    },
    {
        "id": 25,
        "question": "Segitiga sama sisi memiliki sudut sebesar…",
        "options": ["A. 60°", "B. 90°", "C. 45°", "D. 30°"],
        "correct_answer": 0
    },
    {
        "id": 26,
        "question": "Luas segitiga dengan alas 10 cm dan tinggi 6 cm adalah…",
        "options": ["A. 30 cm²", "B. 60 cm²", "C. 16 cm²", "D. 20 cm²"],
        "correct_answer": 0
    },
    {
        "id": 27,
        "question": "Keliling lingkaran dengan diameter 14 cm adalah… (π = 22/7)",
        "options": ["A. 44 cm", "B. 22 cm", "C. 28 cm", "D. 88 cm"],
        "correct_answer": 0
    },
    {
        "id": 28,
        "question": "Bilangan prima antara 10 dan 20 adalah…",
        "options": ["A. 12, 14, 16", "B. 11, 13, 17, 19", "C. 15, 17, 19", "D. 10, 12, 14"],
        "correct_answer": 1
    },
    {
        "id": 29,
        "question": "Hasil dari -5 + 8 adalah…",
        "options": ["A. -3", "B. 3", "C. 13", "D. -13"],
        "correct_answer": 1
    },
    {
        "id": 30,
        "question": "Hasil dari (-3) x (-4) adalah…",
        "options": ["A. -12", "B. 12", "C. 7", "D. -7"],
        "correct_answer": 1
    }
]


def get_math_questions(count: int = 30) -> List[Dict]:
    """Ambil soal Matematika, diacak"""
    import random
    questions = MATH_QUESTIONS.copy()
    random.shuffle(questions)
    return questions[:count]


def check_math_answer(question_id: int, selected_answer: int) -> bool:
    """Cek jawaban Matematika"""
    question = next((q for q in MATH_QUESTIONS if q["id"] == question_id), None)
    if question:
        return selected_answer == question["correct_answer"]
    return False


def get_math_correct_answer(question_id: int) -> int | None:
    """Ambil jawaban benar untuk soal tertentu"""
    question = next((q for q in MATH_QUESTIONS if q["id"] == question_id), None)
    if question:
        return question["correct_answer"]
    return None
