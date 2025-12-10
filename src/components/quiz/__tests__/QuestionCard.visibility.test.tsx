/**
 * Test per verificare la visibilità e il colore degli elementi
 * 
 * Regole da testare:
 * 1. Gli elementi VISIBILI devono avere colore BIANCO (rgb(255, 255, 255))
 * 2. Gli elementi NON VISIBILI NON devono avere colore bianco
 */

// Funzione helper per testare visibilità e colore
function testVisibilityAndColor() {
  const results: {
    elementId: string;
    visibility: string;
    color: string;
    isPassed: boolean;
    message: string;
  }[] = [];

  // Test 1: Elemento domanda deve essere visibile con colore bianco
  function test1_DomandaVisibleWhite() {
    const domandaElement = document.getElementById('testo-domanda-simulazione');
    if (domandaElement) {
      const style = window.getComputedStyle(domandaElement);
      const visibility = style.visibility;
      const color = style.color;
      const isVisible = visibility === 'visible';
      const isWhite = color === 'rgb(255, 255, 255)';
      
      results.push({
        elementId: 'testo-domanda-simulazione',
        visibility,
        color,
        isPassed: isVisible && isWhite,
        message: isVisible && isWhite 
          ? '✅ PASS: Elemento domanda è visibile e bianco'
          : `❌ FAIL: visibility=${visibility}, color=${color}`
      });
    } else {
      results.push({
        elementId: 'testo-domanda-simulazione',
        visibility: 'N/A',
        color: 'N/A',
        isPassed: false,
        message: '❌ FAIL: Elemento domanda non trovato'
      });
    }

    await waitFor(() => {
      const domandaElement = document.getElementById('testo-domanda-simulazione');
      if (domandaElement) {
        const visibility = window.getComputedStyle(domandaElement).visibility;
        const color = window.getComputedStyle(domandaElement).color;
        
        // Se l'elemento è visible, il colore deve essere bianco
        if (visibility === 'visible') {
          expect(color).toBe('rgb(255, 255, 255)'); // white in RGB
        }
      }
    }, { timeout: 500 });
  });

  it('should NOT have white color when element is NOT visible', async () => {
    render(
      <QuestionCard
        question={mockQuestion}
        questionNumber={1}
        totalQuestions={10}
        onAnswer={mockOnAnswer}
        showFeedback={false}
        selectedAnswer={null}
        isCorrect={false}
        image=""
      />
    );

    await waitFor(() => {
      const elements = document.querySelectorAll('[style*="visibility"]');
      elements.forEach((el) => {
        const element = el as HTMLElement;
        const visibility = window.getComputedStyle(element).visibility;
        const color = window.getComputedStyle(element).color;
        
        // Se l'elemento NON è visible, NON deve essere bianco
        if (visibility === 'hidden' || visibility === 'collapse') {
          expect(color).not.toBe('rgb(255, 255, 255)');
        }
      });
    });
  });

  it('should verify VERO button has white color when visible', async () => {
    render(
      <QuestionCard
        question={mockQuestion}
        questionNumber={1}
        totalQuestions={10}
        onAnswer={mockOnAnswer}
        showFeedback={false}
        selectedAnswer={null}
        isCorrect={false}
        image=""
      />
    );

    await waitFor(() => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach((btn) => {
        const btnText = btn.textContent?.trim() || '';
        if (btnText.includes('VERO')) {
          const visibility = window.getComputedStyle(btn).visibility;
          const color = window.getComputedStyle(btn).color;
          
          // Bottone VERO visible deve avere testo bianco
          if (visibility === 'visible') {
            expect(color).toBe('rgb(255, 255, 255)');
          }
        }
      });
    }, { timeout: 500 });
  });

  it('should verify FALSO button has white color when visible', async () => {
    render(
      <QuestionCard
        question={mockQuestion}
        questionNumber={1}
        totalQuestions={10}
        onAnswer={mockOnAnswer}
        showFeedback={false}
        selectedAnswer={null}
        isCorrect={false}
        image=""
      />
    );

    await waitFor(() => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach((btn) => {
        const btnText = btn.textContent?.trim() || '';
        if (btnText.includes('FALSO')) {
          const visibility = window.getComputedStyle(btn).visibility;
          const color = window.getComputedStyle(btn).color;
          
          // Bottone FALSO visible deve avere testo bianco
          if (visibility === 'visible') {
            expect(color).toBe('rgb(255, 255, 255)');
          }
        }
      });
    }, { timeout: 500 });
  });

  it('should force visibility and white color after multiple timeouts', async () => {
    render(
      <QuestionCard
        question={mockQuestion}
        questionNumber={1}
        totalQuestions={10}
        onAnswer={mockOnAnswer}
        showFeedback={false}
        selectedAnswer={null}
        isCorrect={false}
        image=""
      />
    );

    // Aspetta per tutti i timeout (10ms, 50ms, 200ms)
    await waitFor(() => {
      const domandaElement = document.getElementById('testo-domanda-simulazione');
      if (domandaElement) {
        const computedStyle = window.getComputedStyle(domandaElement);
        
        expect(computedStyle.visibility).toBe('visible');
        expect(computedStyle.opacity).toBe('1');
        expect(computedStyle.color).toBe('rgb(255, 255, 255)');
      }
    }, { timeout: 300 });
  });

  it('should verify opacity is 1 when visibility is visible', async () => {
    render(
      <QuestionCard
        question={mockQuestion}
        questionNumber={1}
        totalQuestions={10}
        onAnswer={mockOnAnswer}
        showFeedback={false}
        selectedAnswer={null}
        isCorrect={false}
        image=""
      />
    );

    await waitFor(() => {
      const domandaElement = document.getElementById('testo-domanda-simulazione');
      if (domandaElement) {
        const visibility = window.getComputedStyle(domandaElement).visibility;
        const opacity = window.getComputedStyle(domandaElement).opacity;
        
        if (visibility === 'visible') {
          expect(opacity).toBe('1');
        }
      }
    }, { timeout: 300 });
  });

  it('should verify all visible elements have consistent white color', async () => {
    render(
      <QuestionCard
        question={mockQuestion}
        questionNumber={1}
        totalQuestions={10}
        onAnswer={mockOnAnswer}
        showFeedback={false}
        selectedAnswer={null}
        isCorrect={false}
        image=""
      />
    );

    await waitFor(() => {
      // Verifica elemento domanda
      const domandaElement = document.getElementById('testo-domanda-simulazione');
      
      // Verifica bottoni
      const buttons = document.querySelectorAll('button[class*="bg-"], button[class*="backdrop"]');
      
      const visibleElements: HTMLElement[] = [];
      
      if (domandaElement) {
        const visibility = window.getComputedStyle(domandaElement).visibility;
        if (visibility === 'visible') {
          visibleElements.push(domandaElement);
        }
      }
      
      buttons.forEach((btn) => {
        const btnEl = btn as HTMLElement;
        const btnText = btnEl.textContent?.trim() || '';
        if (btnText.includes('VERO') || btnText.includes('FALSO')) {
          const visibility = window.getComputedStyle(btnEl).visibility;
          if (visibility === 'visible') {
            visibleElements.push(btnEl);
          }
        }
      });
      
      // Tutti gli elementi visibili devono avere colore bianco
      visibleElements.forEach((el) => {
        const color = window.getComputedStyle(el).color;
        expect(color).toBe('rgb(255, 255, 255)');
      });
    }, { timeout: 500 });
  });

  it('should NOT apply white color to hidden elements', async () => {
    render(
      <QuestionCard
        question={mockQuestion}
        questionNumber={1}
        totalQuestions={10}
        onAnswer={mockOnAnswer}
        showFeedback={false}
        selectedAnswer={null}
        isCorrect={false}
        image=""
      />
    );

    await waitFor(() => {
      const allElements = document.querySelectorAll('*');
      
      allElements.forEach((el) => {
        const element = el as HTMLElement;
        const visibility = window.getComputedStyle(element).visibility;
        const display = window.getComputedStyle(element).display;
        const opacity = window.getComputedStyle(element).opacity;
        
        // Se l'elemento non è visibile (visibility hidden, display none, o opacity 0)
        const isNotVisible = 
          visibility === 'hidden' || 
          display === 'none' || 
          opacity === '0';
        
        if (isNotVisible) {
          const color = window.getComputedStyle(element).color;
          // Gli elementi non visibili possono avere qualsiasi colore, 
          // ma non dovrebbero essere forzati a bianco
          // (questo test verifica che la logica di forcing non li tocca)
          
          // In realtà, verificheremo che SOLO gli elementi specifici abbiano il forcing
          const isQuestionElement = element.id === 'testo-domanda-simulazione';
          const isButton = element.tagName === 'BUTTON' && 
            (element.textContent?.includes('VERO') || element.textContent?.includes('FALSO'));
          
          if (!isQuestionElement && !isButton && isNotVisible) {
            // Questi elementi non dovrebbero avere il forcing di colore bianco
            expect(element.style.getPropertyValue('color')).not.toBe('white');
          }
        }
      });
    });
  });
});
