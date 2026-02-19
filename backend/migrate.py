from sqlalchemy import create_engine, text
from database import DATABASE_URL

def migrate():
    """Tambah kolom coins ke table users"""
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        # Cek apakah kolom coins sudah ada
        result = conn.execute(text("""
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'coins'
        """))
        
        if result.fetchone():
            print("Kolom 'coins' sudah ada di table users")
        else:
            # Tambah kolom coins
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN coins INT NOT NULL DEFAULT 200
            """))
            conn.commit()
            print("Kolom 'coins' berhasil ditambahkan ke table users")
    
    engine.dispose()

if __name__ == "__main__":
    migrate()
