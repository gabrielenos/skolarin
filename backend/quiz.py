from datetime import datetime, date

from sqlalchemy import DateTime, Integer, String, ForeignKey, Date, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    attempt_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    score: Mapped[int] = mapped_column(Integer, default=0)
    completed: Mapped[bool] = mapped_column(Integer, default=1)  # 1 = true, 0 = false
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    user: Mapped["User"] = relationship("User", back_populates="quiz_attempts")


class CoinHistory(Base):
    __tablename__ = "coin_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    amount: Mapped[int] = mapped_column(Integer, nullable=False)
    type: Mapped[str] = mapped_column(String(10), nullable=False)  # "income" or "expense"
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    user: Mapped["User"] = relationship("User")
