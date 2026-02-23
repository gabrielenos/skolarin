"""
Soal-soal Indonesia Language Guess The Word (Word Scramble)
50 soal unik yang di-recycle untuk 30 level (10 soal per level)
"""

INDONESIA_QUESTIONS = [
    # Soal 1-10
    {"id": 1, "type": "word_scramble", "sentence": "Ayah pergi ke ____ setiap pagi.", "scrambledLetters": ["K", "A", "N", "T", "O", "R"], "correctAnswer": "KANTOR", "hint": "Tempat bekerja"},
    {"id": 2, "type": "word_scramble", "sentence": "Ibu memasak di ____.", "scrambledLetters": ["D", "A", "P", "U", "R"], "correctAnswer": "DAPUR", "hint": "Tempat membuat makanan"},
    {"id": 3, "type": "word_scramble", "sentence": "Kita tidur di ____.", "scrambledLetters": ["K", "A", "M", "A", "R"], "correctAnswer": "KAMAR", "hint": "Ruangan untuk istirahat"},
    {"id": 4, "type": "word_scramble", "sentence": "Mobil berjalan di ____.", "scrambledLetters": ["J", "A", "L", "A", "N"], "correctAnswer": "JALAN", "hint": "Tempat kendaraan lewat"},
    {"id": 5, "type": "word_scramble", "sentence": "Saya minum ____ setiap hari.", "scrambledLetters": ["A", "I", "R"], "correctAnswer": "AIR", "hint": "Minuman penting bagi tubuh"},
    {"id": 6, "type": "word_scramble", "sentence": "Matahari terbit di ____.", "scrambledLetters": ["P", "A", "G", "I"], "correctAnswer": "PAGI", "hint": "Waktu matahari muncul"},
    {"id": 7, "type": "word_scramble", "sentence": "Kita belajar di ____.", "scrambledLetters": ["S", "E", "K", "O", "L", "A", "H"], "correctAnswer": "SEKOLAH", "hint": "Tempat belajar"},
    {"id": 8, "type": "word_scramble", "sentence": "Dokter bekerja di ____.", "scrambledLetters": ["R", "U", "M", "A", "H", "S", "A", "K", "I", "T"], "correctAnswer": "RUMAHSAKIT", "hint": "Tempat pasien dirawat"},
    {"id": 9, "type": "word_scramble", "sentence": "Kita makan di ____.", "scrambledLetters": ["W", "A", "R", "U", "N", "G"], "correctAnswer": "WARUNG", "hint": "Tempat membeli makanan"},
    {"id": 10, "type": "word_scramble", "sentence": "Anak-anak bermain di ____.", "scrambledLetters": ["T", "A", "M", "A", "N"], "correctAnswer": "TAMAN", "hint": "Tempat rekreasi"},
    
    # Soal 11-20 - Hewan
    {"id": 11, "type": "word_scramble", "sentence": "____ bersuara miauw.", "scrambledLetters": ["K", "U", "C", "I", "N", "G"], "correctAnswer": "KUCING", "hint": "Hewan yang mengeong"},
    {"id": 12, "type": "word_scramble", "sentence": "____ bersuara guk-guk.", "scrambledLetters": ["A", "N", "J", "I", "N", "G"], "correctAnswer": "ANJING", "hint": "Hewan penjaga rumah"},
    {"id": 13, "type": "word_scramble", "sentence": "____ bisa terbang.", "scrambledLetters": ["B", "U", "R", "U", "N", "G"], "correctAnswer": "BURUNG", "hint": "Hewan bersayap"},
    {"id": 14, "type": "word_scramble", "sentence": "____ hidup di air.", "scrambledLetters": ["I", "K", "A", "N"], "correctAnswer": "IKAN", "hint": "Hewan berenang"},
    {"id": 15, "type": "word_scramble", "sentence": "____ bersuara moo.", "scrambledLetters": ["S", "A", "P", "I"], "correctAnswer": "SAPI", "hint": "Hewan berkaki empat"},
    {"id": 16, "type": "word_scramble", "sentence": "____ bersuara mek.", "scrambledLetters": ["K", "A", "M", "B", "I", "N", "G"], "correctAnswer": "KAMBING", "hint": "Hewan bertanduk"},
    {"id": 17, "type": "word_scramble", "sentence": "____ bersuara mbee.", "scrambledLetters": ["D", "O", "M", "B", "A"], "correctAnswer": "DOMBA", "hint": "Hewan berbulu putih"},
    {"id": 18, "type": "word_scramble", "sentence": "____ bersuara kukuruyuk.", "scrambledLetters": ["A", "Y", "A", "M"], "correctAnswer": "AYAM", "hint": "Hewan yang bertelur"},
    {"id": 19, "type": "word_scramble", "sentence": "____ bersuara hihi haha.", "scrambledLetters": ["M", "O", "N", "Y", "E", "T"], "correctAnswer": "MONYET", "hint": "Hewan suka memanjat"},
    {"id": 20, "type": "word_scramble", "sentence": "____ bersuara ngeee.", "scrambledLetters": ["K", "E", "L", "A", "W", "A", "R"], "correctAnswer": "KELAWAR", "hint": "Hewan aktif di malam hari"},
    
    # Soal 21-30 - Warna
    {"id": 21, "type": "word_scramble", "sentence": "Langit berwarna ____.", "scrambledLetters": ["B", "I", "R", "U"], "correctAnswer": "BIRU", "hint": "Warna langit cerah"},
    {"id": 22, "type": "word_scramble", "sentence": "Matahari berwarna ____.", "scrambledLetters": ["K", "U", "N", "I", "N", "G"], "correctAnswer": "KUNING", "hint": "Warna keemasan"},
    {"id": 23, "type": "word_scramble", "sentence": "Rumput berwarna ____.", "scrambledLetters": ["H", "I", "J", "A", "U"], "correctAnswer": "HIJAU", "hint": "Warna daun"},
    {"id": 24, "type": "word_scramble", "sentence": "Api berwarna ____.", "scrambledLetters": ["M", "E", "R", "A", "H"], "correctAnswer": "MERAH", "hint": "Warna darah"},
    {"id": 25, "type": "word_scramble", "sentence": "Awan berwarna ____.", "scrambledLetters": ["P", "U", "T", "I", "H"], "correctAnswer": "PUTIH", "hint": "Warna bersih"},
    {"id": 26, "type": "word_scramble", "sentence": "Malam berwarna ____.", "scrambledLetters": ["H", "I", "T", "A", "M"], "correctAnswer": "HITAM", "hint": "Warna gelap"},
    {"id": 27, "type": "word_scramble", "sentence": "Jeruk berwarna ____.", "scrambledLetters": ["O", "R", "A", "N", "G", "E"], "correctAnswer": "ORANGE", "hint": "Warna jeruk"},
    {"id": 28, "type": "word_scramble", "sentence": "Anggur berwarna ____.", "scrambledLetters": ["U", "N", "G", "U"], "correctAnswer": "UNGU", "hint": "Warna anggur"},
    {"id": 29, "type": "word_scramble", "sentence": "Cokelat berwarna ____.", "scrambledLetters": ["C", "O", "K", "E", "L", "A", "T"], "correctAnswer": "COKELAT", "hint": "Warna cokelat"},
    {"id": 30, "type": "word_scramble", "sentence": "Rambut orang tua berwarna ____.", "scrambledLetters": ["A", "B", "U", "-", "A", "B", "U"], "correctAnswer": "ABU-ABU", "hint": "Warna abu-abu"},
    
    # Soal 31-40 - Keluarga
    {"id": 31, "type": "word_scramble", "sentence": "Ayah dan Ibu adalah ____ saya.", "scrambledLetters": ["O", "R", "A", "N", "G", "T", "U", "A"], "correctAnswer": "ORANGTUA", "hint": "Pemilik rumah"},
    {"id": 32, "type": "word_scramble", "sentence": "Anak laki-laki disebut ____.", "scrambledLetters": ["A", "N", "A", "K", "L", "A", "K", "I"], "correctAnswer": "ANAKLAKI", "hint": "Lawan perempuan"},
    {"id": 33, "type": "word_scramble", "sentence": "Saudara laki-laki dari ayah disebut ____.", "scrambledLetters": ["P", "A", "M", "A", "N"], "correctAnswer": "PAMAN", "hint": "Saudara ayah"},
    {"id": 34, "type": "word_scramble", "sentence": "Saudara perempuan dari ibu disebut ____.", "scrambledLetters": ["T", "A", "N", "T", "E"], "correctAnswer": "TANTE", "hint": "Saudara ibu"},
    {"id": 35, "type": "word_scramble", "sentence": "Ayah dari ayah disebut ____.", "scrambledLetters": ["K", "A", "K", "E", "K"], "correctAnswer": "KAKEK", "hint": "Orang tua ayah"},
    {"id": 36, "type": "word_scramble", "sentence": "Ibu dari ibu disebut ____.", "scrambledLetters": ["N", "E", "N", "E", "K"], "correctAnswer": "NENEK", "hint": "Orang tua ibu"},
    {"id": 37, "type": "word_scramble", "sentence": "Anak dari kakak/adik disebut ____.", "scrambledLetters": ["K", "E", "P", "O", "N", "A", "K", "A", "N"], "correctAnswer": "KEPONAKAN", "hint": "Anak saudara"},
    {"id": 38, "type": "word_scramble", "sentence": "Pasangan menikah disebut ____.", "scrambledLetters": ["S", "U", "A", "M", "I", "I", "S", "T", "R", "I"], "correctAnswer": "SUAMIISTRI", "hint": "Pasangan"},
    {"id": 39, "type": "word_scramble", "sentence": "Anak dari paman disebut ____.", "scrambledLetters": ["S", "A", "U", "D", "A", "R", "A"], "correctAnswer": "SAUDARA", "hint": "Sepupu"},
    {"id": 40, "type": "word_scramble", "sentence": "Anak perempuan disebut ____.", "scrambledLetters": ["A", "N", "A", "K", "P", "E", "R", "E", "M", "P", "U", "A", "N"], "correctAnswer": "ANAKPEREMPUAN", "hint": "Lawan laki-laki"},
    
    # Soal 41-50 - Pekerjaan
    {"id": 41, "type": "word_scramble", "sentence": "Orang yang mengajar adalah ____.", "scrambledLetters": ["G", "U", "R", "U"], "correctAnswer": "GURU", "hint": "Pendidik"},
    {"id": 42, "type": "word_scramble", "sentence": "Orang yang memeriksa sakit adalah ____.", "scrambledLetters": ["D", "O", "K", "T", "E", "R"], "correctAnswer": "DOKTER", "hint": "Tenaga medis"},
    {"id": 43, "type": "word_scramble", "sentence": "Orang yang menangkap penjahat adalah ____.", "scrambledLetters": ["P", "O", "L", "I", "S", "I"], "correctAnswer": "POLISI", "hint": "Penegak hukum"},
    {"id": 44, "type": "word_scramble", "sentence": "Orang yang menanam padi adalah ____.", "scrambledLetters": ["P", "E", "T", "A", "N", "I"], "correctAnswer": "PETANI", "hint": "Pekerja sawah"},
    {"id": 45, "type": "word_scramble", "sentence": "Orang yang mengendarai taksi adalah ____.", "scrambledLetters": ["S", "U", "P", "I", "R"], "correctAnswer": "SUPIR", "hint": "Pengemudi"},
    {"id": 46, "type": "word_scramble", "sentence": "Orang yang memasak di restoran adalah ____.", "scrambledLetters": ["K", "O", "K", "I"], "correctAnswer": "KOKI", "hint": "Juru masak"},
    {"id": 47, "type": "word_scramble", "sentence": "Orang yang menjual barang adalah ____.", "scrambledLetters": ["P", "E", "N", "J", "U", "A", "L"], "correctAnswer": "PENJUAL", "hint": "Pedagang"},
    {"id": 48, "type": "word_scramble", "sentence": "Orang yang membuat roti adalah ____.", "scrambledLetters": ["T", "U", "K", "A", "N", "G", "R", "O", "T", "I"], "correctAnswer": "TUKANGROTI", "hint": "Pembuat roti"},
    {"id": 49, "type": "word_scramble", "sentence": "Orang yang memadamkan api adalah ____.", "scrambledLetters": ["P", "E", "M", "A", "D", "A", "M"], "correctAnswer": "PEMADAM", "hint": "Petugas kebakaran"},
    {"id": 50, "type": "word_scramble", "sentence": "Orang yang membangun rumah adalah ____.", "scrambledLetters": ["T", "U", "K", "A", "N", "G"], "correctAnswer": "TUKANG", "hint": "Pekerja bangunan"},
]

# Total 50 soal unik yang akan di-recycle untuk 30 level
