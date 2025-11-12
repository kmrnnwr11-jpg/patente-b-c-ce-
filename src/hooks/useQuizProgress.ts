import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, updateDoc, increment, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { QuizQuestion } from '@/types/quiz';

interface QuizAttempt {
  attemptId: string;
  userId: string;
  startedAt: Date;
  completedAt: Date | null;
  questions: {
    questionId: number;
    userAnswer: boolean | null;
    correctAnswer: boolean;
    isCorrect: boolean;
    timeSpent: number;
  }[];
  score: number;
  errors: number;
  timeElapsed: number;
  mode: 'exam' | 'practice' | 'topic';
  passed: boolean;
}

export function useQuizProgress() {
  const { currentUser, userData } = useAuth();
  const [saving, setSaving] = useState(false);

  /**
   * Salva risultato quiz in Firestore
   */
  const saveQuizAttempt = async (
    questions: QuizQuestion[],
    userAnswers: (boolean | null)[],
    timeElapsed: number,
    mode: 'exam' | 'practice' | 'topic' = 'practice'
  ): Promise<void> => {
    if (!currentUser) {
      console.log('User not logged in, skipping Firestore save');
      return;
    }

    setSaving(true);

    try {
      // Calcola statistiche
      let correctCount = 0;
      let errorCount = 0;

      const questionDetails = questions.map((q, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === q.risposta;
        if (isCorrect) correctCount++;
        else errorCount++;

        return {
          questionId: q.id,
          userAnswer,
          correctAnswer: q.risposta,
          isCorrect,
          timeSpent: 0 // TODO: track individual question time
        };
      });

      const passed = mode === 'exam' ? errorCount <= 4 : true;

      // Crea attempt document
      const attemptId = `${currentUser.uid}_${Date.now()}`;
      const attempt: QuizAttempt = {
        attemptId,
        userId: currentUser.uid,
        startedAt: new Date(),
        completedAt: new Date(),
        questions: questionDetails,
        score: correctCount,
        errors: errorCount,
        timeElapsed,
        mode,
        passed
      };

      // Salva in Firestore
      await setDoc(doc(db, 'quiz_attempts', attemptId), {
        ...attempt,
        startedAt: Timestamp.fromDate(attempt.startedAt),
        completedAt: Timestamp.fromDate(attempt.completedAt!)
      });

      // Aggiorna statistiche utente
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        totalQuizzes: increment(1),
        correctAnswers: increment(correctCount),
        totalAnswers: increment(questions.length),
        lastQuizDate: Timestamp.now()
      });

      console.log('Quiz attempt saved successfully:', attemptId);
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
      // Non bloccare l'app se il salvataggio fallisce
    } finally {
      setSaving(false);
    }
  };

  /**
   * Recupera storico quiz utente
   */
  const getQuizHistory = async (): Promise<QuizAttempt[]> => {
    if (!currentUser) return [];

    try {
      // TODO: Implementare query per recuperare tutti i quiz attempts dell'utente
      // Per ora ritorna array vuoto
      return [];
    } catch (error) {
      console.error('Error fetching quiz history:', error);
      return [];
    }
  };

  /**
   * Aggiorna streak (giorni consecutivi)
   */
  const updateStreak = async (): Promise<void> => {
    if (!currentUser || !userData) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) return;

      const data = userDoc.data();
      const lastQuizDate = data.lastQuizDate?.toDate();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!lastQuizDate) {
        // Primo quiz
        await updateDoc(userRef, {
          streak: 1,
          lastQuizDate: Timestamp.now()
        });
      } else {
        const lastDate = new Date(lastQuizDate);
        lastDate.setHours(0, 0, 0, 0);
        
        const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Giorno consecutivo
          await updateDoc(userRef, {
            streak: increment(1),
            lastQuizDate: Timestamp.now()
          });
        } else if (diffDays > 1) {
          // Streak interrotto
          await updateDoc(userRef, {
            streak: 1,
            lastQuizDate: Timestamp.now()
          });
        }
        // Se diffDays === 0, è lo stesso giorno, non aggiornare streak
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  return {
    saveQuizAttempt,
    getQuizHistory,
    updateStreak,
    saving
  };
}

