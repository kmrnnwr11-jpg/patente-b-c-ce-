import React, { useState } from 'react';

// App Patente + CQC - Prototipo Completo
export default function PatenteAppCQC() {
  const [screen, setScreen] = useState('license');
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [examMode, setExamMode] = useState('full'); // 'full' o 'extension'

  // Configurazione licenze
  const licenses = [
    { id: 'B', name: 'Patente B', icon: '🚗', color: '#3B82F6', quiz: 7194, exam: '40 dom / 30 min / 4 err', category: 'patente' },
    { id: 'C', name: 'Patente C', icon: '🚛', color: '#F97316', quiz: 3493, exam: '40 dom / 40 min / 4 err', category: 'patente', isNew: true },
    { id: 'CE', name: 'Patente CE', icon: '🚚', color: '#EF4444', quiz: 3493, exam: '40 dom / 40 min / 4 err', category: 'patente', isNew: true },
    { id: 'CQC_M', name: 'CQC Merci', icon: '📦', color: '#8B5CF6', quiz: 3389, exam: '70 dom / 90 min / 7 err', category: 'cqc', isNew: true },
    { id: 'CQC_P', name: 'CQC Persone', icon: '🚌', color: '#06B6D4', quiz: 3200, exam: '70 dom / 90 min / 7 err', category: 'cqc', isNew: true },
  ];

  // Quiz CQC di esempio
  const cqcQuizzes = [
    { id: 1, q: "Il massaggio cardiaco effettuato nel primo soccorso stimola la circolazione sanguigna.", a: true, cap: 6, parte: "comune" },
    { id: 2, q: "L'alcolemia può essere misurata anche tramite l'aria espirata.", a: true, cap: 8, parte: "comune" },
    { id: 3, q: "Nelle discese ripide bisogna impiegare le marce basse per sfruttare l'effetto frenante del motore.", a: true, cap: 2, parte: "comune" },
    { id: 4, q: "Il conducente professionale deve limitare l'assunzione di cibi fritti e ricchi di grassi.", a: true, cap: 8, parte: "comune" },
    { id: 5, q: "Per il trasporto di terra e materiali inerti si utilizzano veicoli mezzo d'opera con cassone ribaltabile.", a: true, cap: 11, parte: "merci" },
    { id: 6, q: "La carta tachigrafica del conducente può essere usata da più conducenti.", a: false, cap: 4, parte: "comune" },
    { id: 7, q: "Il DAU (Documento Amministrativo Unico) non può essere utilizzato per le merci UE.", a: false, cap: 12, parte: "merci" },
    { id: 8, q: "Le società di persone non possono effettuare il trasporto di cose per conto terzi.", a: false, cap: 13, parte: "merci" },
  ];

  const currentLicense = licenses.find(l => l.id === selectedLicense);
  const isCQC = currentLicense?.category === 'cqc';
  const currentQuiz = cqcQuizzes[quizIndex];
  const totalQuiz = cqcQuizzes.length;

  // Navigazione
  const goNext = () => {
    if (quizIndex < totalQuiz - 1) setQuizIndex(quizIndex + 1);
    else setScreen('results');
  };
  const goPrev = () => {
    if (quizIndex > 0) setQuizIndex(quizIndex - 1);
  };

  const handleAnswer = (ans) => {
    setAnswers({ ...answers, [currentQuiz.id]: ans });
  };

  const correctCount = Object.keys(answers).filter(id => {
    const q = cqcQuizzes.find(quiz => quiz.id === parseInt(id));
    return q && answers[id] === q.a;
  }).length;

  // ===== SCREENS =====

  // 1. License Selection
  if (screen === 'license') {
    return (
      <div style={styles.container}>
        <div style={styles.screen}>
          <h1 style={styles.mainTitle}>🎯 Cosa vuoi conseguire?</h1>
          
          <p style={styles.sectionLabel}>─── PATENTI ───</p>
          <div style={styles.licenseGrid}>
            {licenses.filter(l => l.category === 'patente').map(l => (
              <div
                key={l.id}
                style={{
                  ...styles.licenseCard,
                  borderColor: selectedLicense === l.id ? l.color : '#333',
                  background: selectedLicense === l.id ? `${l.color}15` : 'rgba(255,255,255,0.03)',
                }}
                onClick={() => setSelectedLicense(l.id)}
              >
                {l.isNew && <span style={styles.newBadge}>🔥 NEW</span>}
                <span style={styles.licenseIcon}>{l.icon}</span>
                <span style={{...styles.licenseName, color: l.color}}>{l.name}</span>
                <span style={styles.licenseQuiz}>{l.quiz.toLocaleString()} quiz</span>
                <span style={styles.licenseExam}>{l.exam}</span>
              </div>
            ))}
          </div>

          <p style={styles.sectionLabel}>─── CQC PROFESSIONALE ───</p>
          <div style={styles.cqcGrid}>
            {licenses.filter(l => l.category === 'cqc').map(l => (
              <div
                key={l.id}
                style={{
                  ...styles.cqcCard,
                  borderColor: selectedLicense === l.id ? l.color : '#333',
                  background: selectedLicense === l.id ? `${l.color}15` : 'rgba(255,255,255,0.03)',
                }}
                onClick={() => setSelectedLicense(l.id)}
              >
                {l.isNew && <span style={styles.newBadge}>🔥 NEW</span>}
                <span style={styles.cqcIcon}>{l.icon}</span>
                <span style={{...styles.cqcName, color: l.color}}>{l.name}</span>
                <span style={styles.cqcDesc}>
                  {l.id === 'CQC_M' ? 'Autista Camion' : 'Autista Autobus'}
                </span>
                <span style={styles.cqcQuiz}>{l.quiz.toLocaleString()} quiz</span>
                <span style={styles.cqcExam}>{l.exam}</span>
              </div>
            ))}
          </div>

          <button
            style={{
              ...styles.continueBtn,
              background: selectedLicense ? (currentLicense?.color || '#666') : '#444',
              opacity: selectedLicense ? 1 : 0.5,
            }}
            onClick={() => selectedLicense && setScreen('dashboard')}
            disabled={!selectedLicense}
          >
            Continua →
          </button>
        </div>
      </div>
    );
  }

  // 2. Dashboard
  if (screen === 'dashboard') {
    return (
      <div style={styles.container}>
        <div style={styles.screen}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.streak}>🔥 12</div>
            <div>
              <h2 style={styles.greeting}>Ciao! 👋</h2>
              <p style={styles.subtext}>Streak: 12 giorni</p>
            </div>
          </div>

          {/* License Card */}
          <div style={{
            ...styles.dashCard,
            borderLeft: `4px solid ${currentLicense?.color}`,
            background: `linear-gradient(135deg, ${currentLicense?.color}15, ${currentLicense?.color}05)`,
          }}>
            <div style={styles.dashHeader}>
              <span style={styles.dashIcon}>{currentLicense?.icon}</span>
              <span style={{...styles.dashName, color: currentLicense?.color}}>
                {currentLicense?.name}
              </span>
              <button style={styles.changeBtn} onClick={() => setScreen('license')}>
                Cambia
              </button>
            </div>
            
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: '62%', background: currentLicense?.color}} />
            </div>
            <span style={styles.progressText}>Progresso: 62%</span>

            {/* CQC specific: show comune/specifica breakdown */}
            {isCQC && (
              <div style={styles.cqcBreakdown}>
                <div style={styles.breakdownItem}>
                  <span style={styles.breakdownLabel}>📗 Parte Comune</span>
                  <div style={styles.miniProgress}>
                    <div style={{...styles.miniProgressFill, width: '75%'}} />
                  </div>
                  <span style={styles.breakdownPercent}>75%</span>
                </div>
                <div style={styles.breakdownItem}>
                  <span style={styles.breakdownLabel}>
                    {selectedLicense === 'CQC_M' ? '📦 Parte Merci' : '🚌 Parte Persone'}
                  </span>
                  <div style={styles.miniProgress}>
                    <div style={{...styles.miniProgressFill, width: '42%'}} />
                  </div>
                  <span style={styles.breakdownPercent}>42%</span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <h3 style={styles.sectionTitle}>🎮 Inizia</h3>
          <div style={styles.actionGrid}>
            <button style={styles.actionCard} onClick={() => {
              setQuizIndex(0);
              setAnswers({});
              setExamMode('full');
              setScreen('quiz');
            }}>
              <span style={styles.actionIcon}>📝</span>
              <span style={styles.actionLabel}>
                {isCQC ? 'Esame Completo' : 'Simulazione'}
              </span>
              <span style={styles.actionDesc}>
                {isCQC ? '70 dom / 90 min' : '40 dom'}
              </span>
            </button>
            
            {isCQC && (
              <button style={styles.actionCard} onClick={() => {
                setQuizIndex(0);
                setAnswers({});
                setExamMode('extension');
                setScreen('quiz');
              }}>
                <span style={styles.actionIcon}>⚡</span>
                <span style={styles.actionLabel}>Estensione</span>
                <span style={styles.actionDesc}>30 dom / 40 min</span>
              </button>
            )}
            
            <button style={styles.actionCard}>
              <span style={styles.actionIcon}>📚</span>
              <span style={styles.actionLabel}>Quiz Veloce</span>
              <span style={styles.actionDesc}>10 domande</span>
            </button>
          </div>

          {/* Stats */}
          <h3 style={styles.sectionTitle}>📊 Statistiche</h3>
          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <span style={styles.statNum}>1.247</span>
              <span style={styles.statLabel}>Quiz fatti</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNum}>78%</span>
              <span style={styles.statLabel}>Precisione</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNum}>8</span>
              <span style={styles.statLabel}>Esami</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Quiz Screen
  if (screen === 'quiz') {
    const hasAnswered = answers[currentQuiz.id] !== undefined;
    const isCorrect = answers[currentQuiz.id] === currentQuiz.a;
    const progress = ((quizIndex + 1) / totalQuiz) * 100;

    return (
      <div style={styles.container}>
        <div style={styles.screen}>
          {/* Top Bar */}
          <div style={styles.quizTop}>
            <button style={styles.closeBtn} onClick={() => setScreen('dashboard')}>✕</button>
            <span style={styles.quizTitle}>
              {isCQC ? (examMode === 'full' ? 'Esame CQC' : 'Estensione CQC') : 'Quiz'}
            </span>
            <span style={{...styles.quizCounter, color: currentLicense?.color}}>
              {quizIndex + 1}/{totalQuiz}
            </span>
          </div>

          {/* Progress */}
          <div style={styles.quizProgressBar}>
            <div style={{...styles.quizProgressFill, width: `${progress}%`, background: currentLicense?.color}} />
          </div>

          {/* Part indicator for CQC */}
          {isCQC && (
            <div style={{
              ...styles.partBadge,
              background: currentQuiz.parte === 'comune' ? '#22C55E20' : '#8B5CF620',
              borderColor: currentQuiz.parte === 'comune' ? '#22C55E' : '#8B5CF6',
            }}>
              {currentQuiz.parte === 'comune' ? '📗 PARTE COMUNE' : '📦 PARTE MERCI'} | Cap. {currentQuiz.cap}
            </div>
          )}

          {/* Question */}
          <div style={styles.questionCard}>
            <p style={styles.questionNum}>Domanda {quizIndex + 1}</p>
            <p style={styles.questionText}>{currentQuiz.q}</p>
          </div>

          {/* Answers */}
          <div style={styles.answersContainer}>
            <button
              style={{
                ...styles.answerBtn,
                ...(hasAnswered && currentQuiz.a === true ? styles.correctAnswer : {}),
                ...(hasAnswered && answers[currentQuiz.id] === true && !isCorrect ? styles.wrongAnswer : {}),
              }}
              onClick={() => !hasAnswered && handleAnswer(true)}
              disabled={hasAnswered}
            >
              <span style={styles.answerIcon}>✓</span>
              <span>VERO</span>
            </button>

            <button
              style={{
                ...styles.answerBtn,
                ...(hasAnswered && currentQuiz.a === false ? styles.correctAnswer : {}),
                ...(hasAnswered && answers[currentQuiz.id] === false && !isCorrect ? styles.wrongAnswer : {}),
              }}
              onClick={() => !hasAnswered && handleAnswer(false)}
              disabled={hasAnswered}
            >
              <span style={styles.answerIcon}>✗</span>
              <span>FALSO</span>
            </button>
          </div>

          {/* Feedback */}
          {hasAnswered && (
            <div style={{
              ...styles.feedback,
              background: isCorrect ? '#22C55E15' : '#EF444415',
              borderColor: isCorrect ? '#22C55E' : '#EF4444',
            }}>
              <span style={{color: isCorrect ? '#22C55E' : '#EF4444', fontWeight: 700}}>
                {isCorrect ? '✓ Corretto!' : '✗ Sbagliato!'}
              </span>
              <p style={styles.feedbackText}>
                Risposta corretta: <strong>{currentQuiz.a ? 'VERO' : 'FALSO'}</strong>
              </p>
            </div>
          )}

          {/* Navigation Arrows */}
          <div style={styles.navBar}>
            <button
              style={{...styles.navArrow, opacity: quizIndex === 0 ? 0.3 : 1}}
              onClick={goPrev}
              disabled={quizIndex === 0}
            >
              <span style={styles.arrowIcon}>←</span>
              <span>Precedente</span>
            </button>

            <div style={styles.navDots}>
              {[...Array(Math.min(5, totalQuiz))].map((_, i) => {
                const idx = Math.max(0, Math.min(quizIndex - 2, totalQuiz - 5)) + i;
                return (
                  <div
                    key={idx}
                    style={{
                      ...styles.dot,
                      background: idx === quizIndex ? currentLicense?.color :
                                 answers[cqcQuizzes[idx]?.id] !== undefined ? '#22C55E' : '#444',
                    }}
                  />
                );
              })}
            </div>

            <button style={styles.navArrow} onClick={goNext}>
              <span>{quizIndex === totalQuiz - 1 ? 'Fine' : 'Prossima'}</span>
              <span style={styles.arrowIcon}>→</span>
            </button>
          </div>

          {/* Error counter for CQC */}
          {isCQC && (
            <div style={styles.errorCounter}>
              Errori: {Object.keys(answers).filter(id => {
                const q = cqcQuizzes.find(quiz => quiz.id === parseInt(id));
                return q && answers[id] !== q.a;
              }).length} / {examMode === 'full' ? 7 : 3}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. Results
  if (screen === 'results') {
    const errors = totalQuiz - correctCount;
    const maxErrors = isCQC ? (examMode === 'full' ? 7 : 3) : 4;
    const passed = errors <= maxErrors;
    const percentage = Math.round((correctCount / totalQuiz) * 100);

    // Calculate breakdown for CQC
    const comuneCorrect = Object.keys(answers).filter(id => {
      const q = cqcQuizzes.find(quiz => quiz.id === parseInt(id));
      return q && q.parte === 'comune' && answers[id] === q.a;
    }).length;
    const comuneTotal = cqcQuizzes.filter(q => q.parte === 'comune').length;
    
    const specificaCorrect = Object.keys(answers).filter(id => {
      const q = cqcQuizzes.find(quiz => quiz.id === parseInt(id));
      return q && q.parte !== 'comune' && answers[id] === q.a;
    }).length;
    const specificaTotal = cqcQuizzes.filter(q => q.parte !== 'comune').length;

    return (
      <div style={styles.container}>
        <div style={styles.screen}>
          <div style={styles.resultsContainer}>
            <div style={{
              ...styles.resultIcon,
              background: passed ? 'linear-gradient(135deg, #22C55E, #16A34A)' : 'linear-gradient(135deg, #EF4444, #DC2626)',
            }}>
              {passed ? '✓' : '✗'}
            </div>

            <h1 style={styles.resultTitle}>
              {passed ? '🎉 PROMOSSO!' : '📚 Riprova!'}
            </h1>

            <div style={styles.scoreCard}>
              <span style={styles.scoreNum}>{correctCount}/{totalQuiz}</span>
              <span style={styles.scoreLabel}>Risposte corrette</span>
              <span style={styles.errorInfo}>{errors} errori (max {maxErrors})</span>
            </div>

            {/* CQC Breakdown */}
            {isCQC && (
              <div style={styles.breakdownResults}>
                <div style={styles.breakdownResultItem}>
                  <span style={styles.breakdownResultLabel}>📗 Parte Comune</span>
                  <span style={styles.breakdownResultValue}>{comuneCorrect}/{comuneTotal}</span>
                  <div style={styles.miniProgress}>
                    <div style={{...styles.miniProgressFill, width: `${(comuneCorrect/comuneTotal)*100}%`, background: '#22C55E'}} />
                  </div>
                </div>
                <div style={styles.breakdownResultItem}>
                  <span style={styles.breakdownResultLabel}>📦 Parte Merci</span>
                  <span style={styles.breakdownResultValue}>{specificaCorrect}/{specificaTotal}</span>
                  <div style={styles.miniProgress}>
                    <div style={{...styles.miniProgressFill, width: `${(specificaCorrect/specificaTotal)*100}%`, background: '#8B5CF6'}} />
                  </div>
                </div>
              </div>
            )}

            <button style={styles.primaryBtn} onClick={() => {
              setQuizIndex(0);
              setAnswers({});
              setScreen('quiz');
            }}>
              🔄 Riprova Esame
            </button>

            <button style={styles.secondaryBtn} onClick={() => setScreen('dashboard')}>
              🏠 Torna alla Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 100%)',
    padding: '20px',
    fontFamily: "'Inter', -apple-system, sans-serif",
    display: 'flex',
    justifyContent: 'center',
  },
  screen: {
    width: '100%',
    maxWidth: '440px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  mainTitle: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 700,
    textAlign: 'center',
    margin: '10px 0 20px',
  },
  sectionLabel: {
    color: '#666',
    fontSize: '12px',
    textAlign: 'center',
    letterSpacing: '2px',
    margin: '20px 0 10px',
  },
  
  // License Grid
  licenseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
  },
  licenseCard: {
    position: 'relative',
    background: 'rgba(255,255,255,0.03)',
    border: '2px solid #333',
    borderRadius: '16px',
    padding: '16px 10px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  licenseIcon: { fontSize: '32px' },
  licenseName: { fontSize: '14px', fontWeight: 700 },
  licenseQuiz: { fontSize: '11px', color: '#888' },
  licenseExam: { fontSize: '9px', color: '#666' },
  newBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: '#EF4444',
    color: 'white',
    fontSize: '9px',
    padding: '2px 6px',
    borderRadius: '10px',
    fontWeight: 700,
  },

  // CQC Grid
  cqcGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  cqcCard: {
    position: 'relative',
    background: 'rgba(255,255,255,0.03)',
    border: '2px solid #333',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  cqcIcon: { fontSize: '40px' },
  cqcName: { fontSize: '16px', fontWeight: 700 },
  cqcDesc: { fontSize: '12px', color: '#888' },
  cqcQuiz: { fontSize: '12px', color: '#666' },
  cqcExam: { fontSize: '10px', color: '#555' },

  continueBtn: {
    marginTop: '20px',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  // Dashboard
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
    fontSize: '18px',
    fontWeight: 700,
    color: 'white',
  },
  greeting: { color: 'white', fontSize: '22px', fontWeight: 700, margin: 0 },
  subtext: { color: '#888', fontSize: '13px', margin: '4px 0 0' },

  dashCard: {
    borderRadius: '16px',
    padding: '20px',
    background: 'rgba(255,255,255,0.03)',
  },
  dashHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  dashIcon: { fontSize: '28px' },
  dashName: { fontSize: '18px', fontWeight: 700, flex: 1 },
  changeBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#888',
    padding: '6px 14px',
    borderRadius: '16px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  progressBar: {
    height: '8px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s',
  },
  progressText: { color: '#888', fontSize: '13px' },

  cqcBreakdown: {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  breakdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  breakdownLabel: { color: '#AAA', fontSize: '12px', width: '100px' },
  miniProgress: {
    flex: 1,
    height: '6px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    background: '#22C55E',
    borderRadius: '3px',
  },
  breakdownPercent: { color: '#888', fontSize: '12px', width: '40px', textAlign: 'right' },

  sectionTitle: { color: 'white', fontSize: '16px', fontWeight: 600, margin: '20px 0 10px' },

  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  actionCard: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '14px',
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  actionIcon: { fontSize: '28px' },
  actionLabel: { color: 'white', fontSize: '14px', fontWeight: 600 },
  actionDesc: { color: '#666', fontSize: '11px' },

  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
  },
  statBox: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '14px',
    textAlign: 'center',
  },
  statNum: { display: 'block', color: 'white', fontSize: '20px', fontWeight: 700 },
  statLabel: { color: '#666', fontSize: '11px' },

  // Quiz
  quizTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: 'white',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  quizTitle: { color: 'white', fontSize: '15px', fontWeight: 600 },
  quizCounter: { fontSize: '15px', fontWeight: 700 },

  quizProgressBar: {
    height: '5px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '3px',
    overflow: 'hidden',
    margin: '10px 0',
  },
  quizProgressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s',
  },

  partBadge: {
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '11px',
    fontWeight: 600,
    color: '#CCC',
    textAlign: 'center',
  },

  questionCard: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '20px',
    marginTop: '16px',
  },
  questionNum: {
    color: '#F97316',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '10px',
  },
  questionText: {
    color: 'white',
    fontSize: '17px',
    lineHeight: 1.5,
    margin: 0,
  },

  answersContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '20px',
  },
  answerBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '18px',
    background: 'rgba(255,255,255,0.05)',
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  answerIcon: { fontSize: '20px' },
  correctAnswer: {
    background: 'rgba(34, 197, 94, 0.2)',
    borderColor: '#22C55E',
  },
  wrongAnswer: {
    background: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#EF4444',
  },

  feedback: {
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid',
    marginTop: '16px',
  },
  feedbackText: {
    color: '#CCC',
    fontSize: '13px',
    margin: '6px 0 0',
  },

  navBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  navArrow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    color: 'white',
    fontSize: '13px',
    cursor: 'pointer',
  },
  arrowIcon: { color: '#F97316', fontSize: '16px', fontWeight: 700 },
  navDots: { display: 'flex', gap: '5px' },
  dot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    transition: 'all 0.2s',
  },

  errorCounter: {
    textAlign: 'center',
    color: '#888',
    fontSize: '12px',
    marginTop: '12px',
  },

  // Results
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: '30px',
  },
  resultIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    color: 'white',
    marginBottom: '20px',
  },
  resultTitle: {
    color: 'white',
    fontSize: '26px',
    fontWeight: 700,
    margin: '0 0 20px',
  },
  scoreCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '16px',
    padding: '20px 40px',
    marginBottom: '20px',
  },
  scoreNum: { display: 'block', color: 'white', fontSize: '40px', fontWeight: 700 },
  scoreLabel: { color: '#888', fontSize: '13px' },
  errorInfo: { display: 'block', color: '#F97316', fontSize: '14px', marginTop: '8px' },

  breakdownResults: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  breakdownResultItem: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  breakdownResultLabel: { color: '#AAA', fontSize: '13px', width: '100px', textAlign: 'left' },
  breakdownResultValue: { color: 'white', fontSize: '14px', fontWeight: 700, width: '50px' },

  primaryBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: '10px',
  },
  secondaryBtn: {
    width: '100%',
    padding: '16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '15px',
    cursor: 'pointer',
  },
};
