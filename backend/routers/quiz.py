from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import SessionLocal
from models import User
from quiz import QuizAttempt
from routers.auth import get_current_user

# Import soal Bahasa Inggris dan Matematika dari file terpisah
try:
    from .quiz2 import get_english_questions, check_english_answer, get_english_correct_answer, ENGLISH_QUESTIONS
    from .quiz3 import get_math_questions, check_math_answer, get_math_correct_answer, MATH_QUESTIONS
except ImportError:
    # Fallback kalau import relative gagal
    import sys
    import os
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from quiz2 import get_english_questions, check_english_answer, get_english_correct_answer, ENGLISH_QUESTIONS
    from quiz3 import get_math_questions, check_math_answer, get_math_correct_answer, MATH_QUESTIONS

router = APIRouter(prefix="/quiz", tags=["quiz"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Pool soal Daily Quiz
DAILY_QUESTIONS = [
    {
        "id": 1,
        "question": "Hasil dari 25 × 4 − 30 adalah…",
        "options": [
            "A. 60",
            "B. 70",
            "C. 80",
            "D. 90"
        ],
        "correct_answer": 1  # B. 70 (25×4=100, 100-30=70)
    },
    {
        "id": 2,
        "question": "Kalimat yang menggunakan tanda baca yang benar adalah…",
        "options": [
            "A. Saya membeli buku, pensil dan penghapus.",
            "B. Saya membeli buku pensil, dan penghapus.",
            "C. Saya membeli buku, pensil, dan penghapus.",
            "D. Saya membeli, buku pensil dan penghapus."
        ],
        "correct_answer": 2  # C. Oxford comma
    },
    {
        "id": 3,
        "question": "Organ yang berfungsi untuk memompa darah ke seluruh tubuh adalah…",
        "options": [
            "A. Paru-paru",
            "B. Jantung",
            "C. Hati",
            "D. Ginjal"
        ],
        "correct_answer": 1  # B. Jantung
    },
    {
        "id": 4,
        "question": "Ibu kota negara Indonesia adalah…",
        "options": [
            "A. Bandung",
            "B. Surabaya",
            "C. Medan",
            "D. Jakarta"
        ],
        "correct_answer": 3  # D. Jakarta
    },
    {
        "id": 5,
        "question": "Sila pertama dalam Pancasila adalah…",
        "options": [
            "A. Kemanusiaan yang adil dan beradab",
            "B. Persatuan Indonesia",
            "C. Ketuhanan Yang Maha Esa",
            "D. Keadilan sosial bagi seluruh rakyat Indonesia"
        ],
        "correct_answer": 2  # C. Ketuhanan Yang Maha Esa
    }
]


class QuizStatusResponse(BaseModel):
    can_play: bool
    already_played_today: bool
    message: str


class SubmitAnswerRequest(BaseModel):
    question_id: int
    selected_answer: int


class SubmitAnswerResponse(BaseModel):
    correct: bool
    correct_answer: int
    reward_coins: int


@router.get("/daily/status", response_model=QuizStatusResponse)
def get_daily_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cek apakah user sudah main daily quiz hari ini"""
    today = date.today()
    
    # Cek sudah ada attempt hari ini (mulai atau selesai) = sudah kehitung main
    attempt = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id,
        QuizAttempt.attempt_date == today
    ).first()
    
    if attempt:
        # Sudah mulai (completed=0) atau sudah selesai (completed=1) = sudah dimainkan
        return QuizStatusResponse(
            can_play=False,
            already_played_today=True,
            message="Kamu sudah memainkan kuis hari ini. Kembali besok!"
        )
    
    return QuizStatusResponse(
        can_play=True,
        already_played_today=False,
        message="Kuis hari ini siap!"
    )


@router.get("/daily/question")
def get_daily_question(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Ambil soal daily quiz - otomatis catat attempt saat mulai"""
    today = date.today()
    
    # Cek sudah main hari ini (completed=1)
    existing = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id,
        QuizAttempt.attempt_date == today,
        QuizAttempt.completed == 1
    ).first()
    
    if existing:
        raise HTTPException(status_code=403, detail="Kamu sudah menyelesaikan kuis hari ini")
    
    # Cek sudah mulai tapi belum selesai
    attempt = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id,
        QuizAttempt.attempt_date == today,
        QuizAttempt.completed == 0
    ).first()
    
    if not attempt:
        # Belum mulai, catat attempt baru (completed=0)
        attempt = QuizAttempt(
            user_id=current_user.id,
            attempt_date=today,
            score=0,
            completed=0
        )
        db.add(attempt)
        db.commit()
    
    # Acak soal berdasarkan tanggal hari ini
    # Seed dari tanggal supaya semua user dapat soal sama pada hari yang sama
    import random
    today_seed = today.year * 10000 + today.month * 100 + today.day
    rng = random.Random(today_seed)
    question = rng.choice(DAILY_QUESTIONS)
    
    return {
        "id": question["id"],
        "question": question["question"],
        "options": question["options"]
    }


@router.post("/daily/submit", response_model=SubmitAnswerResponse)
def submit_answer(
    payload: SubmitAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit jawaban daily quiz"""
    today = date.today()
    
    # Cari attempt yang sedang berjalan (completed=0) - sudah dibuat saat fetch question
    attempt = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id,
        QuizAttempt.attempt_date == today,
        QuizAttempt.completed == 0
    ).first()
    
    if not attempt:
        raise HTTPException(status_code=403, detail="Kamu sudah memainkan atau menyelesaikan kuis hari ini")
    
    # Cari soal
    question = next((q for q in DAILY_QUESTIONS if q["id"] == payload.question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail="Soal tidak ditemukan")
    
    # Cek jawaban
    is_correct = payload.selected_answer == question["correct_answer"]
    reward = 50 if is_correct else 0
    
    # Update attempt jadi selesai
    attempt.score = 1 if is_correct else 0
    attempt.completed = 1
    
    # Tambah koin kalo benar
    if is_correct and reward > 0:
        current_user.coins += reward
    
    db.commit()
    
    return SubmitAnswerResponse(
        correct=is_correct,
        correct_answer=question["correct_answer"],
        reward_coins=reward
    )


# ============== SELF CHALLENGE ==============

# Soal Bahasa Indonesia untuk Self Challenge (30 soal)
BAHASA_INDONESIA_QUESTIONS = [
    {
        "id": 1,
        "question": "Penulisan kata yang benar adalah…",
        "options": ["A. Aktifitas", "B. Aktivitas", "C. Aktifitas", "D. Aktifitaz"],
        "correct_answer": 1
    },
    {
        "id": 2,
        "question": "Kalimat efektif adalah…",
        "options": ["A. Para siswa-siswa sedang belajar.", "B. Siswa-siswa sedang belajar semua.", "C. Para siswa sedang belajar.", "D. Semua para siswa sedang belajar."],
        "correct_answer": 2
    },
    {
        "id": 3,
        "question": "Ide pokok biasanya terdapat pada…",
        "options": ["A. Kalimat penjelas", "B. Kalimat utama", "C. Kalimat tanya", "D. Kalimat seru"],
        "correct_answer": 1
    },
    {
        "id": 4,
        "question": "Antonim dari kata 'besar' adalah…",
        "options": ["A. Tinggi", "B. Luas", "C. Kecil", "D. Panjang"],
        "correct_answer": 2
    },
    {
        "id": 5,
        "question": "Sinonim dari kata 'rajin' adalah…",
        "options": ["A. Malas", "B. Tekun", "C. Lambat", "D. Diam"],
        "correct_answer": 1
    },
    {
        "id": 6,
        "question": "Teks yang berisi langkah-langkah melakukan sesuatu disebut teks…",
        "options": ["A. Narasi", "B. Deskripsi", "C. Prosedur", "D. Eksposisi"],
        "correct_answer": 2
    },
    {
        "id": 7,
        "question": "Penggunaan tanda koma yang benar adalah…",
        "options": ["A. Ibu membeli apel, jeruk dan mangga.", "B. Ibu membeli apel jeruk, dan mangga.", "C. Ibu membeli apel, jeruk, dan mangga.", "D. Ibu, membeli apel jeruk dan mangga."],
        "correct_answer": 2
    },
    {
        "id": 8,
        "question": "Majas yang membandingkan dua hal secara langsung disebut…",
        "options": ["A. Hiperbola", "B. Metafora", "C. Personifikasi", "D. Litotes"],
        "correct_answer": 1
    },
    {
        "id": 9,
        "question": "Kalimat berikut yang termasuk kalimat tanya adalah…",
        "options": ["A. Tolong ambilkan buku itu!", "B. Buku itu sangat menarik.", "C. Di mana kamu tinggal?", "D. Wah, indah sekali!"],
        "correct_answer": 2
    },
    {
        "id": 10,
        "question": "Teks yang menceritakan suatu peristiwa disebut teks…",
        "options": ["A. Narasi", "B. Argumentasi", "C. Eksposisi", "D. Prosedur"],
        "correct_answer": 0
    },
    {
        "id": 11,
        "question": "Penulisan huruf kapital yang benar adalah…",
        "options": ["A. presiden jokowi", "B. Presiden Jokowi", "C. Presiden jokowi", "D. presiden Jokowi"],
        "correct_answer": 1
    },
    {
        "id": 12,
        "question": "Kata baku dari 'resiko' adalah…",
        "options": ["A. Resiko", "B. Risiko", "C. Resikku", "D. Risyko"],
        "correct_answer": 1
    },
    {
        "id": 13,
        "question": "Kalimat yang menggunakan kata depan yang benar adalah…",
        "options": ["A. Di rumah itu sangat besar.", "B. Saya pergi kerumah teman.", "C. Saya pergi ke rumah teman.", "D. Saya pergi ker umah teman."],
        "correct_answer": 2
    },
    {
        "id": 14,
        "question": "Paragraf yang gagasan utamanya berada di akhir disebut paragraf…",
        "options": ["A. Deduktif", "B. Induktif", "C. Campuran", "D. Naratif"],
        "correct_answer": 1
    },
    {
        "id": 15,
        "question": "Makna kata dalam kamus disebut makna…",
        "options": ["A. Konotatif", "B. Denotatif", "C. Kiasan", "D. Majas"],
        "correct_answer": 1
    },
    {
        "id": 16,
        "question": "Teks yang berisi pendapat disertai alasan disebut teks…",
        "options": ["A. Deskripsi", "B. Argumentasi", "C. Prosedur", "D. Narasi"],
        "correct_answer": 1
    },
    {
        "id": 17,
        "question": "Kalimat perintah ditandai dengan…",
        "options": ["A. Tanda titik", "B. Tanda tanya", "C. Tanda seru", "D. Tanda koma"],
        "correct_answer": 2
    },
    {
        "id": 18,
        "question": "Majas yang melebih-lebihkan disebut…",
        "options": ["A. Metafora", "B. Hiperbola", "C. Personifikasi", "D. Ironi"],
        "correct_answer": 1
    },
    {
        "id": 19,
        "question": "Kata serapan biasanya berasal dari bahasa…",
        "options": ["A. Daerah", "B. Asing", "C. Gaul", "D. Isyarat"],
        "correct_answer": 1
    },
    {
        "id": 20,
        "question": "Teks yang menggambarkan suatu objek secara rinci disebut…",
        "options": ["A. Deskripsi", "B. Narasi", "C. Argumentasi", "D. Eksposisi"],
        "correct_answer": 0
    },
    {
        "id": 21,
        "question": "Kalimat yang mengandung opini adalah…",
        "options": ["A. Matahari terbit dari timur.", "B. Air mendidih pada suhu 100°C.", "C. Film itu sangat membosankan.", "D. Indonesia memiliki banyak pulau."],
        "correct_answer": 2
    },
    {
        "id": 22,
        "question": "Penulisan tanggal yang benar adalah…",
        "options": ["A. 17 agustus 1945", "B. 17 Agustus 1945", "C. 17 AGUSTUS 1945", "D. 17-Agustus-1945"],
        "correct_answer": 1
    },
    {
        "id": 23,
        "question": "Kata 'mereka' termasuk kata ganti orang…",
        "options": ["A. Pertama", "B. Kedua", "C. Ketiga", "D. Tunggal"],
        "correct_answer": 2
    },
    {
        "id": 24,
        "question": "Struktur teks prosedur yang benar adalah…",
        "options": ["A. Judul – Tujuan – Langkah-langkah", "B. Judul – Konflik – Resolusi", "C. Orientasi – Komplikasi – Resolusi", "D. Tesis – Argumentasi – Penegasan"],
        "correct_answer": 0
    },
    {
        "id": 25,
        "question": "Kalimat berikut yang termasuk fakta adalah…",
        "options": ["A. Cuaca hari ini sangat menyenangkan.", "B. Gunung itu sangat indah.", "C. Indonesia merdeka tahun 1945.", "D. Film itu paling bagus."],
        "correct_answer": 2
    },
    {
        "id": 26,
        "question": "Kata 'cepat' dalam kalimat 'Ia berlari cepat' berfungsi sebagai…",
        "options": ["A. Subjek", "B. Predikat", "C. Keterangan", "D. Objek"],
        "correct_answer": 2
    },
    {
        "id": 27,
        "question": "Penulisan yang benar adalah…",
        "options": ["A. Antar kota", "B. Antar-kota", "C. Antarkota", "D. Antar Kota"],
        "correct_answer": 2
    },
    {
        "id": 28,
        "question": "Teks eksposisi bertujuan untuk…",
        "options": ["A. Menghibur pembaca", "B. Memberikan informasi", "C. Menceritakan kisah", "D. Memberi langkah-langkah"],
        "correct_answer": 1
    },
    {
        "id": 29,
        "question": "Kalimat majemuk adalah…",
        "options": ["A. Saya makan.", "B. Ibu memasak di dapur.", "C. Saya belajar dan adik menonton TV.", "D. Buku itu tebal."],
        "correct_answer": 2
    },
    {
        "id": 30,
        "question": "Majas personifikasi adalah…",
        "options": ["A. Angin berbisik di malam hari.", "B. Tubuhnya setinggi tiang listrik.", "C. Ia adalah bintang kelas.", "D. Rumah itu kecil sekali."],
        "correct_answer": 0
    }
]


class SelfChallengeRequest(BaseModel):
    category: str
    subcategory: str
    question_count: int
    duration_minutes: int


class SelfChallengeResponse(BaseModel):
    questions: list
    duration_minutes: int


@router.post("/self-challenge/start", response_model=SelfChallengeResponse)
def start_self_challenge(
    payload: SelfChallengeRequest,
    current_user: User = Depends(get_current_user)
):
    """Mulai self challenge berdasarkan kategori dan subkategori"""
    
    # Pilih soal berdasarkan subkategori
    if payload.subcategory == "Bahasa Indonesia":
        questions = BAHASA_INDONESIA_QUESTIONS[:payload.question_count]
    elif payload.subcategory == "English":
        questions = get_english_questions(payload.question_count)
    elif payload.subcategory == "Matematika":
        questions = get_math_questions(payload.question_count)
    else:
        # Default ke Bahasa Indonesia kalau subkategori lain belum ada soal
        questions = BAHASA_INDONESIA_QUESTIONS[:payload.question_count]
    
    # Acak soal
    import random
    rng = random.Random()
    shuffled = questions.copy()
    rng.shuffle(shuffled)
    
    # Return soal tanpa jawaban benar
    return {
        "questions": [
            {"id": q["id"], "question": q["question"], "options": q["options"]}
            for q in shuffled
        ],
        "duration_minutes": payload.duration_minutes
    }


class SelfChallengeSubmitRequest(BaseModel):
    answers: dict  # {question_id: selected_answer}
    subcategory: str = "Bahasa Indonesia"  # Untuk tahu pool soal mana yang dipakai


class SelfChallengeSubmitResponse(BaseModel):
    score: int
    total: int
    correct_answers: dict
    reward_coins: int


@router.post("/self-challenge/submit", response_model=SelfChallengeSubmitResponse)
def submit_self_challenge(
    payload: SelfChallengeSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit jawaban self challenge"""

    correct_count = 0
    total = len(payload.answers)
    correct_answers = {}

    # Pilih pool soal berdasarkan subkategori
    if payload.subcategory == "English":
        question_pool = ENGLISH_QUESTIONS
    elif payload.subcategory == "Matematika":
        question_pool = MATH_QUESTIONS
    else:
        question_pool = BAHASA_INDONESIA_QUESTIONS

    # Cek jawaban dari pool yang sesuai
    for question_id, selected in payload.answers.items():
        question = next((q for q in question_pool if q["id"] == int(question_id)), None)
        if question and selected == question["correct_answer"]:
            correct_count += 1
        if question:
            correct_answers[question_id] = question["correct_answer"]

    # Reward: 10 koin per jawaban benar
    reward = correct_count * 10
    if reward > 0:
        current_user.coins += reward
        db.commit()

    return SelfChallengeSubmitResponse(
        score=correct_count,
        total=total,
        correct_answers=correct_answers,
        reward_coins=reward
    )
