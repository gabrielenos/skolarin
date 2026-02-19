import os
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# MariaDB Configuration (compatible dengan MySQL driver)
# Format: mysql+pymysql://username:password@host:port/database
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:123@localhost:3306/skolarin"
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass
