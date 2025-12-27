import React, { useState } from 'react';

// App Patente - Quiz con Navigazione Frecce
export default function PatenteQuizApp() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);

  // Quiz di esempio Patente C
  const quizzes = [
    { id: 1, question: "La carta tachigrafica del conducente ha validità di 5 anni.", answer: true, chapter: "Cronotachigrafo" },
    { id: 2, question: "Il periodo di guida giornaliero può essere al massimo di 9 ore.", answer: true, chapter: "Tempi di guida" },
    { id: 3, question: "È possibile guidare per 10 ore due volte a settimana.", answer: true, chapter: "Tempi di guida" },
    { id: 4, question: "La pausa obbligatoria può essere frazionata in 15+30 minuti.", answer: true, chapter: "Tempi di riposo" },
    { id: 5, question: "Il cronotachigrafo digitale registra la velocità massima raggiunta.", answer: true, chapter: "Cronotachigrafo" },
    { id: 6, question: "La carta conducente può essere usata da più conducenti.", answer: false, chapter: "Cronotachigrafo" },
    { id: 7, question: "Il riposo giornaliero regolare è di almeno 11 ore consecutive.", answer: true, chapter: "Tempi di riposo" },
    { id: 8, question: "Il tachigrafo analogico usa fogli di registrazione giornalieri.", answer: true, chapter: "Cronotachigrafo" },
  ];

  const totalQuiz = quizzes.length;
  const currentQuiz = quizzes[currentQuizIndex];
  const progress = ((currentQuizIndex + 1) / totalQuiz) * 100;

  // Navigazione Quiz
  const goNext = () => {
    if (currentQuizIndex < totalQuiz - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setShowFeedback(false);
    } else {
      setCurrentScreen('results');
    }
  };

  const goPrev = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
      setShowFeedback(false);
    }
  };

  const handleAnswer = (userAnswer) => {
    setAnswers({ ...answers, [currentQuiz.id]: userAnswer });
    setShowFeedback(true);
  };

  const isCorrect = answers[currentQuiz.id] === currentQuiz.answer;
  const hasAnswered = answers[currentQuiz.id] !== undefined;

  // Calcola risultati
  const correctCount = Object.keys(answers).filter(id => {
    const quiz = quizzes.find(q => q.id === parseInt(id));
    return quiz && answers[id] === quiz.answer;
  }).length;

  // Dashboard Screen
  if (currentScreen === 'dashboard') {
    return (
      <div style={styles.container}>
        <div style={styles.screen}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.streak}>🔥 7</div>
            <div>
              <h1 style={styles.greeting}>Ciao! 👋</h1>
              <p style={styles.subtext}>Streak: 7 giorni</p>
            </div>
          </div>

          {/* License Card */}
          <div style={styles.licenseCard}>
            <div style={styles.licenseHeader}>
              <span style={styles.licenseIcon}>🚛</span>
              <span style={styles.licenseName}>PATENTE C</span>
              <button style={styles.changeBtn}>Cambia</button>
            </div>
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: '45%' }} />
              </div>
              <span style={styles.progressText}>45% completato</span>
            </div>
          </div>

          {/* Quick Actions */}
          <h2 style={styles.sectionTitle}>🎮 Inizia Quiz</h2>
          <div style={styles.actionGrid}>
            <button 
              style={styles.actionCard}
              onClick={() => {
                setCurrentQuizIndex(0);
                setAnswers({});
                setShowFeedback(false);
                setCurrentScreen('quiz');
              }}
            >
              <span style={styles.actionIcon}>⚡</span>
              <span style={styles.actionLabel}>Quiz Veloce</span>
              <span style={styles.actionDesc}>{totalQuiz} domande</span>
            </button>
            <button style={styles.actionCard}>
              <span style={styles.actionIcon}>🎯</span>
              <span style={styles.actionLabel}>Esame</span>
              <span style={styles.actionDesc}>40 domande</span>
            </button>
          </div>

          {/* Stats */}
          <h2 style={styles.sectionTitle}>📊 Statistiche</h2>
          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <span style={styles.statNum}>287</span>
              <span style={styles.statLabel}>Quiz fatti</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNum}>78%</span>
              <span style={styles.statLabel}>Precisione</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNum}>12</span>
              <span style={styles.statLabel}>Esami</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (currentScreen === 'results') {
    const percentage = Math.round((correctCount / totalQuiz) * 100);
    const passed = percentage >= 80;
    
    return (
      <div style={styles.container}>
        <div style={styles.screen}>
          <div style={styles.resultsContainer}>
            <div style={{
              ...styles.resultIcon,
              background: passed ? 'linear-gradient(135deg, #22C55E, #16A34A)' : 'linear-gradient(135deg, #EF4444, #DC2626)'
            }}>
              {passed ? '✓' : '✗'}
            </div>
            
            <h1 style={styles.resultTitle}>
              {passed ? '🎉 PROMOSSO!' : '📚 Riprova!'}
            </h1>
            
            <div style={styles.scoreCard}>
              <span style={styles.scoreNum}>{correctCount}/{totalQuiz}</span>
              <span style={styles.scoreLabel}>Risposte corrette</span>
              <div style={styles.stars}>
                {[1,2,3,4,5].map(i => (
                  <span key={i} style={{ opacity: percentage >= i * 20 ? 1 : 0.3 }}>⭐</span>
                ))}
              </div>
            </div>

            <div style={styles.resultStats}>
              <div style={styles.resultStat}>
                <span style={styles.resultStatNum}>{totalQuiz - correctCount}</span>
                <span style={styles.resultStatLabel}>errori</span>
              </div>
              <div style={styles.resultStat}>
                <span style={styles.resultStatNum}>{percentage}%</span>
                <span style={styles.resultStatLabel}>score</span>
              </div>
              <div style={styles.resultStat}>
                <span style={styles.resultStatNum}>+{correctCount * 5}</span>
                <span style={styles.resultStatLabel}>XP</span>
              </div>
            </div>

            <button 
              style={styles.primaryButton}
              onClick={() => {
                setCurrentQuizIndex(0);
                setAnswers({});
                setShowFeedback(false);
              }}
            >
              📋 Rivedi Risposte
            </button>
            
            <button 
              style={styles.secondaryButton}
              onClick={() => setCurrentScreen('dashboard')}
            >
              🏠 Torna alla Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen con Navigazione Frecce
  return (
    <div style={styles.container}>
      <div style={styles.screen}>
        {/* Top Bar */}
        <div style={styles.quizTopBar}>
          <button style={styles.closeBtn} onClick={() => setCurrentScreen('dashboard')}>✕</button>
          <span style={styles.quizTitle}>{currentQuiz.chapter}</span>
          <span style={styles.quizCounter}>{currentQuizIndex + 1}/{totalQuiz}</span>
        </div>

        {/* Progress Bar */}
        <div style={styles.quizProgress}>
          <div style={{ ...styles.quizProgressFill, width: `${progress}%` }} />
        </div>

        {/* Question Card */}
        <div style={styles.questionCard}>
          <div style={styles.questionNumber}>Domanda {currentQuizIndex + 1}</div>
          <p style={styles.questionText}>{currentQuiz.question}</p>
        </div>

        {/* Answer Buttons */}
        <div style={styles.answerSection}>
          <button
            style={{
              ...styles.answerBtn,
              ...(hasAnswered && currentQuiz.answer === true ? styles.correctBtn : {}),
              ...(hasAnswered && answers[currentQuiz.id] === true && !isCorrect ? styles.wrongBtn : {}),
              ...(hasAnswered && answers[currentQuiz.id] !== true ? styles.dimBtn : {}),
            }}
            onClick={() => !hasAnswered && handleAnswer(true)}
            disabled={hasAnswered}
          >
            <span style={styles.answerIcon}>✓</span>
            <span style={styles.answerText}>VERO</span>
          </button>

          <button
            style={{
              ...styles.answerBtn,
              ...(hasAnswered && currentQuiz.answer === false ? styles.correctBtn : {}),
              ...(hasAnswered && answers[currentQuiz.id] === false && !isCorrect ? styles.wrongBtn : {}),
              ...(hasAnswered && answers[currentQuiz.id] !== false ? styles.dimBtn : {}),
            }}
            onClick={() => !hasAnswered && handleAnswer(false)}
            disabled={hasAnswered}
          >
            <span style={styles.answerIcon}>✗</span>
            <span style={styles.answerText}>FALSO</span>
          </button>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div style={{
            ...styles.feedbackCard,
            background: isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderColor: isCorrect ? '#22C55E' : '#EF4444',
          }}>
            <span style={{ ...styles.feedbackIcon, color: isCorrect ? '#22C55E' : '#EF4444' }}>
              {isCorrect ? '✓ Corretto!' : '✗ Sbagliato!'}
            </span>
            <p style={styles.feedbackText}>
              La risposta corretta è: <strong>{currentQuiz.answer ? 'VERO' : 'FALSO'}</strong>
            </p>
          </div>
        )}

        {/* Navigation Arrows - FRECCE */}
        <div style={styles.navigationBar}>
          <button 
            style={{
              ...styles.navArrow,
              opacity: currentQuizIndex === 0 ? 0.3 : 1,
            }}
            onClick={goPrev}
            disabled={currentQuizIndex === 0}
          >
            <span style={styles.arrowIcon}>←</span>
            <span style={styles.arrowText}>Precedente</span>
          </button>

          <div style={styles.navDots}>
            {quizzes.slice(
              Math.max(0, currentQuizIndex - 2),
              Math.min(totalQuiz, currentQuizIndex + 3)
            ).map((_, idx) => {
              const actualIdx = Math.max(0, currentQuizIndex - 2) + idx;
              return (
                <div
                  key={actualIdx}
                  style={{
                    ...styles.navDot,
                    background: actualIdx === currentQuizIndex ? '#F97316' : 
                               answers[quizzes[actualIdx]?.id] !== undefined ? '#22C55E' : '#444',
                  }}
                />
              );
            })}
          </div>

          <button 
            style={styles.navArrow}
            onClick={goNext}
          >
            <span style={styles.arrowText}>
              {currentQuizIndex === totalQuiz - 1 ? 'Fine' : 'Prossima'}
            </span>
            <span style={styles.arrowIcon}>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 100%)',
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  screen: {
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  
  // Header
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '10px 0',
  },
  streak: {
    background: 'linear-gradient(135deg, #F97316, #EA580C)',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
  },
  greeting: {
    color: 'white',
    fontSize: '24px',
    fontWeight: '700',
    margin: 0,
  },
  subtext: {
    color: '#888',
    fontSize: '14px',
    margin: '4px 0 0 0',
  },

  // License Card
  licenseCard: {
    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(249, 115, 22, 0.05))',
    border: '1px solid rgba(249, 115, 22, 0.3)',
    borderRadius: '16px',
    padding: '20px',
  },
  licenseHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  licenseIcon: {
    fontSize: '32px',
  },
  licenseName: {
    color: '#F97316',
    fontSize: '18px',
    fontWeight: '700',
    flex: 1,
  },
  changeBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#888',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  progressBar: {
    height: '8px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #F97316, #FB923C)',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressText: {
    color: '#888',
    fontSize: '13px',
  },

  // Section
  sectionTitle: {
    color: 'white',
    fontSize: '18px',
    fontWeight: '600',
    margin: '10px 0',
  },

  // Action Grid
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  actionCard: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  actionIcon: {
    fontSize: '32px',
  },
  actionLabel: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
  },
  actionDesc: {
    color: '#666',
    fontSize: '13px',
  },

  // Stats
  statsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '12px',
  },
  statBox: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',
  },
  statNum: {
    display: 'block',
    color: 'white',
    fontSize: '24px',
    fontWeight: '700',
  },
  statLabel: {
    color: '#666',
    fontSize: '12px',
  },

  // Quiz Top Bar
  quizTopBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: 'white',
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    fontSize: '18px',
    cursor: 'pointer',
  },
  quizTitle: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
  },
  quizCounter: {
    color: '#F97316',
    fontSize: '16px',
    fontWeight: '700',
  },

  // Quiz Progress
  quizProgress: {
    height: '6px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  quizProgressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #F97316, #FB923C)',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },

  // Question Card
  questionCard: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '24px',
    marginTop: '20px',
  },
  questionNumber: {
    color: '#F97316',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  questionText: {
    color: 'white',
    fontSize: '20px',
    fontWeight: '500',
    lineHeight: '1.5',
    margin: 0,
  },

  // Answer Section
  answerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '24px',
  },
  answerBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '20px',
    background: 'rgba(255,255,255,0.05)',
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  answerIcon: {
    fontSize: '24px',
    color: 'white',
  },
  answerText: {
    color: 'white',
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '2px',
  },
  correctBtn: {
    background: 'rgba(34, 197, 94, 0.2)',
    borderColor: '#22C55E',
  },
  wrongBtn: {
    background: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#EF4444',
  },
  dimBtn: {
    opacity: 0.4,
  },

  // Feedback
  feedbackCard: {
    padding: '16px 20px',
    borderRadius: '12px',
    border: '1px solid',
    marginTop: '16px',
  },
  feedbackIcon: {
    fontSize: '16px',
    fontWeight: '700',
    display: 'block',
    marginBottom: '8px',
  },
  feedbackText: {
    color: '#CCC',
    fontSize: '14px',
    margin: 0,
    lineHeight: '1.5',
  },

  // Navigation Bar - FRECCE
  navigationBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: '24px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  navArrow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 20px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '120px',
    justifyContent: 'center',
  },
  arrowIcon: {
    fontSize: '20px',
    color: '#F97316',
    fontWeight: '700',
  },
  arrowText: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
  },
  navDots: {
    display: 'flex',
    gap: '6px',
  },
  navDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
  },

  // Results
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: '40px',
  },
  resultIcon: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    color: 'white',
    marginBottom: '24px',
  },
  resultTitle: {
    color: 'white',
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 24px 0',
  },
  scoreCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '20px',
    padding: '24px 48px',
    marginBottom: '24px',
  },
  scoreNum: {
    display: 'block',
    color: 'white',
    fontSize: '48px',
    fontWeight: '700',
  },
  scoreLabel: {
    color: '#888',
    fontSize: '14px',
  },
  stars: {
    marginTop: '12px',
    fontSize: '24px',
  },
  resultStats: {
    display: 'flex',
    gap: '24px',
    marginBottom: '32px',
  },
  resultStat: {
    textAlign: 'center',
  },
  resultStatNum: {
    display: 'block',
    color: 'white',
    fontSize: '24px',
    fontWeight: '700',
  },
  resultStatLabel: {
    color: '#666',
    fontSize: '12px',
  },
  primaryButton: {
    width: '100%',
    padding: '18px',
    background: 'linear-gradient(135deg, #F97316, #EA580C)',
    border: 'none',
    borderRadius: '14px',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '12px',
  },
  secondaryButton: {
    width: '100%',
    padding: '18px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '14px',
    color: 'white',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};
