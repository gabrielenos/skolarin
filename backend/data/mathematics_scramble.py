"""
Soal-soal Mathematics Guess The Word (Word Scramble)
50 soal unik yang di-recycle untuk 30 level (10 soal per level)
"""

MATHEMATICS_QUESTIONS = [
    # Soal 1-10 - Operasi Dasar
    {"id": 1, "type": "word_scramble", "sentence": "Dua ditambah dua sama dengan ____.", "scrambledLetters": ["E", "M", "P", "A", "T"], "correctAnswer": "EMPAT", "hint": "Hasil 2+2"},
    {"id": 2, "type": "word_scramble", "sentence": "Lima dikurang tiga sama dengan ____.", "scrambledLetters": ["D", "U", "A"], "correctAnswer": "DUA", "hint": "Hasil 5-3"},
    {"id": 3, "type": "word_scramble", "sentence": "Tiga kali tiga sama dengan ____.", "scrambledLetters": ["S", "E", "M", "B", "I", "L", "A", "N"], "correctAnswer": "SEMBILAN", "hint": "Hasil 3×3"},
    {"id": 4, "type": "word_scramble", "sentence": "Sepuluh dibagi dua sama dengan ____.", "scrambledLetters": ["L", "I", "M", "A"], "correctAnswer": "LIMA", "hint": "Hasil 10÷2"},
    {"id": 5, "type": "word_scramble", "sentence": "Bentuk dengan empat sisi sama panjang adalah ____.", "scrambledLetters": ["P", "E", "R", "S", "E", "G", "I"], "correctAnswer": "PERSEGI", "hint": "Bentuk kotak"},
    {"id": 6, "type": "word_scramble", "sentence": "Sudut yang tepat 90 derajat disebut ____.", "scrambledLetters": ["S", "I", "K", "U"], "correctAnswer": "SIKU", "hint": "Sudut L"},
    {"id": 7, "type": "word_scramble", "sentence": "Jarak dari pusat ke tepi lingkaran disebut ____.", "scrambledLetters": ["J", "A", "R", "I", "J", "A", "R", "I"], "correctAnswer": "JARIJARI", "hint": "Setengah diameter"},
    {"id": 8, "type": "word_scramble", "sentence": "Garis dari titik terendah ke titik tertinggi adalah ____.", "scrambledLetters": ["D", "I", "A", "M", "E", "T", "E", "R"], "correctAnswer": "DIAMETER", "hint": "Garis tengah"},
    {"id": 9, "type": "word_scramble", "sentence": "Bilangan sebelum sepuluh adalah ____.", "scrambledLetters": ["S", "E", "M", "B", "I", "L", "A", "N"], "correctAnswer": "SEMBILAN", "hint": "9"},
    {"id": 10, "type": "word_scramble", "sentence": "Simbol matematika untuk penjumlahan adalah ____.", "scrambledLetters": ["T", "A", "M", "B", "A", "H"], "correctAnswer": "TAMBAH", "hint": "Simbol +"},
    
    # Soal 11-20 - Bentuk Geometri
    {"id": 11, "type": "word_scramble", "sentence": "Bentuk dengan tiga sisi adalah ____.", "scrambledLetters": ["S", "E", "G", "I", "T", "I", "G", "A"], "correctAnswer": "SEGITIGA", "hint": "Bentuk bermuda"},
    {"id": 12, "type": "word_scramble", "sentence": "Bentuk dengan lima sisi adalah ____.", "scrambledLetters": ["L", "I", "M", "A", "S"], "correctAnswer": "LIMAS", "hint": "Piramida"},
    {"id": 13, "type": "word_scramble", "sentence": "Bangun ruang dengan enam sisi persegi adalah ____.", "scrambledLetters": ["K", "U", "B", "U", "S"], "correctAnswer": "KUBUS", "hint": "Dadu"},
    {"id": 14, "type": "word_scramble", "sentence": "Garis terpanjang di segitiga siku-siku adalah ____.", "scrambledLetters": ["M", "I", "R", "I", "N", "G"], "correctAnswer": "MIRING", "hint": "Sisi miring"},
    {"id": 15, "type": "word_scramble", "sentence": "Jarak keliling lingkaran disebut ____.", "scrambledLetters": ["K", "E", "L", "I", "L", "I", "N", "G"], "correctAnswer": "KELILING", "hint": "Luar lingkaran"},
    {"id": 16, "type": "word_scramble", "sentence": "Daerah di dalam lingkaran disebut ____.", "scrambledLetters": ["L", "U", "A", "S"], "correctAnswer": "LUAS", "hint": "Permukaan"},
    {"id": 17, "type": "word_scramble", "sentence": "Bentuk dengan dua sisi sejajar adalah ____.", "scrambledLetters": ["J", "A", "J", "A", "R", "G", "E", "N", "J", "A", "N", "G"], "correctAnswer": "JAJARGENJANG", "hint": "Segi empat miring"},
    {"id": 18, "type": "word_scramble", "sentence": "Bentuk dengan semua sisi sama panjang adalah ____.", "scrambledLetters": ["B", "E", "L", "A", "H", "A", "N", "K", "E", "T", "U", "P", "A", "T"], "correctAnswer": "BELAHANKETUPAT", "hint": "Layang-layang"},
    {"id": 19, "type": "word_scramble", "sentence": "Garis yang membagi sudut menjadi dua sama besar adalah ____.", "scrambledLetters": ["G", "A", "R", "I", "S", "B", "A", "W", "A", "H"], "correctAnswer": "GARISBAWAH", "hint": "Garis bantu"},
    {"id": 20, "type": "word_scramble", "sentence": "Titik sudut di tengah lingkaran adalah ____.", "scrambledLetters": ["P", "U", "S", "A", "T"], "correctAnswer": "PUSAT", "hint": "Titik tengah"},
    
    # Soal 21-30 - Satuan Ukuran
    {"id": 21, "type": "word_scramble", "sentence": "Satuan panjang untuk jarak dekat adalah ____.", "scrambledLetters": ["C", "E", "N", "T", "I", "M", "E", "T", "E", "R"], "correctAnswer": "CENTIMETER", "hint": "cm"},
    {"id": 22, "type": "word_scramble", "sentence": "Seribu meter sama dengan satu ____.", "scrambledLetters": ["K", "I", "L", "O", "M", "E", "T", "E", "R"], "correctAnswer": "KILOMETER", "hint": "km"},
    {"id": 23, "type": "word_scramble", "sentence": "Satuan berat untuk benda ringan adalah ____.", "scrambledLetters": ["G", "R", "A", "M"], "correctAnswer": "GRAM", "hint": "g"},
    {"id": 24, "type": "word_scramble", "sentence": "Seribu gram sama dengan satu ____.", "scrambledLetters": ["K", "I", "L", "O", "G", "R", "A", "M"], "correctAnswer": "KILOGRAM", "hint": "kg"},
    {"id": 25, "type": "word_scramble", "sentence": "Satuan waktu yang lebih pendek dari jam adalah ____.", "scrambledLetters": ["M", "E", "N", "I", "T"], "correctAnswer": "MENIT", "hint": "60 detik"},
    {"id": 26, "type": "word_scramble", "sentence": "Satuan waktu yang lebih pendek dari menit adalah ____.", "scrambledLetters": ["D", "E", "T", "I", "K"], "correctAnswer": "DETIK", "hint": "1/60 menit"},
    {"id": 27, "type": "word_scramble", "sentence": "Satuan cairan untuk air adalah ____.", "scrambledLetters": ["L", "I", "T", "E", "R"], "correctAnswer": "LITER", "hint": "1 liter = 1000 ml"},
    {"id": 28, "type": "word_scramble", "sentence": "Satuan panjang untuk kain adalah ____.", "scrambledLetters": ["M", "E", "T", "E", "R"], "correctAnswer": "METER", "hint": "m"},
    {"id": 29, "type": "word_scramble", "sentence": "Seratus centimeter sama dengan satu ____.", "scrambledLetters": ["M", "E", "T", "E", "R"], "correctAnswer": "METER", "hint": "1 m = 100 cm"},
    {"id": 30, "type": "word_scramble", "sentence": "Satuan berat untuk emas adalah ____.", "scrambledLetters": ["K", "A", "R", "A", "T"], "correctAnswer": "KARAT", "hint": "Untuk perhiasan"},
    
    # Soal 31-40 - Pecahan dan Persen
    {"id": 31, "type": "word_scramble", "sentence": "Bagian dari keseluruhan disebut ____.", "scrambledLetters": ["P", "E", "C", "A", "H", "A", "N"], "correctAnswer": "PECAHAN", "hint": "1/2, 1/4"},
    {"id": 32, "type": "word_scramble", "sentence": "Bagian atas pecahan disebut ____.", "scrambledLetters": ["P", "E", "M", "B", "I", "L", "A", "N", "G"], "correctAnswer": "PEMBILANG", "hint": "Angka di atas"},
    {"id": 33, "type": "word_scramble", "sentence": "Bagian bawah pecahan disebut ____.", "scrambledLetters": ["P", "E", "N", "Y", "E", "B", "U", "T"], "correctAnswer": "PENYEBUT", "hint": "Angka di bawah"},
    {"id": 34, "type": "word_scramble", "sentence": "Setengah dalam bentuk persen adalah ____.", "scrambledLetters": ["L", "I", "M", "A", "P", "U", "L", "U", "H"], "correctAnswer": "LIMAPULUH", "hint": "50%"},
    {"id": 35, "type": "word_scramble", "sentence": "Simbol untuk per seratus adalah ____.", "scrambledLetters": ["P", "E", "R", "S", "E", "N"], "correctAnswer": "PERSEN", "hint": "Simbol %"},
    {"id": 36, "type": "word_scramble", "sentence": "Setiap sepuluh persen sama dengan ____ persepuluh.", "scrambledLetters": ["S", "A", "T", "U"], "correctAnswer": "SATU", "hint": "1/10"},
    {"id": 37, "type": "word_scramble", "sentence": "Tiga perempat dalam persen adalah ____.", "scrambledLetters": ["T", "I", "G", "A", "P", "U", "L", "U", "H"], "correctAnswer": "TIGAPULUH", "hint": "75%"},
    {"id": 38, "type": "word_scramble", "sentence": "Pecahan yang lebih besar dari satu disebut ____.", "scrambledLetters": ["P", "E", "C", "A", "H", "A", "N", "C", "A", "M", "P", "U", "R", "A", "N"], "correctAnswer": "PECAHANCAMPURAN", "hint": "1 1/2"},
    {"id": 39, "type": "word_scramble", "sentence": "Pecahan dengan penyebut sepuluh disebut ____.", "scrambledLetters": ["P", "E", "R", "S", "E", "P", "U", "L", "U", "H"], "correctAnswer": "PERSEPULUH", "hint": "0.1"},
    {"id": 40, "type": "word_scramble", "sentence": "Pecahan dengan penyebut seratus disebut ____.", "scrambledLetters": ["P", "E", "R", "S", "E", "R", "A", "T", "U", "S"], "correctAnswer": "PERSERATUS", "hint": "0.01"},
    
    # Soal 41-50 - Konsep Dasar
    {"id": 41, "type": "word_scramble", "sentence": "Hasil dari penjumlahan disebut ____.", "scrambledLetters": ["J", "U", "M", "L", "A", "H"], "correctAnswer": "JUMLAH", "hint": "Total"},
    {"id": 42, "type": "word_scramble", "sentence": "Hasil dari pengurangan disebut ____.", "scrambledLetters": ["S", "E", "L", "I", "S", "I", "H"], "correctAnswer": "SELISIH", "hint": "Perbedaan"},
    {"id": 43, "type": "word_scramble", "sentence": "Hasil dari perkalian disebut ____.", "scrambledLetters": ["H", "A", "S", "I", "L", "K", "A", "L", "I"], "correctAnswer": "HASILKALI", "hint": "Produk"},
    {"id": 44, "type": "word_scramble", "sentence": "Hasil dari pembagian disebut ____.", "scrambledLetters": ["H", "A", "S", "I", "L", "B", "A", "G", "I"], "correctAnswer": "HASILBAGI", "hint": "Quotient"},
    {"id": 45, "type": "word_scramble", "sentence": "Bilangan yang habis dibagi dua adalah ____.", "scrambledLetters": ["G", "E", "N", "A", "P"], "correctAnswer": "GENAP", "hint": "2, 4, 6"},
    {"id": 46, "type": "word_scramble", "sentence": "Bilangan yang tidak habis dibagi dua adalah ____.", "scrambledLetters": ["G", "A", "N", "J", "I", "L"], "correctAnswer": "GANJIL", "hint": "1, 3, 5"},
    {"id": 47, "type": "word_scramble", "sentence": "Bilangan yang hanya bisa dibagi satu dan dirinya adalah ____.", "scrambledLetters": ["P", "R", "I", "M", "A"], "correctAnswer": "PRIMA", "hint": "2, 3, 5, 7"},
    {"id": 48, "type": "word_scramble", "sentence": "Simbol untuk perbandingan adalah ____.", "scrambledLetters": ["N", "I", "S", "B", "A", "H"], "correctAnswer": "NISBAH", "hint": "Dua titik"},
    {"id": 49, "type": "word_scramble", "sentence": "Urutan bilangan dari kecil ke besar disebut ____.", "scrambledLetters": ["A", "S", "C", "E", "N", "D", "I", "N", "G"], "correctAnswer": "ASCENDING", "hint": "Naik"},
    {"id": 50, "type": "word_scramble", "sentence": "Urutan bilangan dari besar ke kecil disebut ____.", "scrambledLetters": ["D", "E", "S", "C", "E", "N", "D", "I", "N", "G"], "correctAnswer": "DESCENDING", "hint": "Turun"},
]
