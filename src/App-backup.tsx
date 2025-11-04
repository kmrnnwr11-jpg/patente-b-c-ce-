import { FC, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Navbar } from '@/components/layout/Navbar';
import { LandingPage } from '@/pages/LandingPage';
import { QuizTestPage } from '@/pages/QuizTestPage';
import { DashboardHome } from '@/pages/DashboardHome';
import { TopicsPage } from '@/pages/TopicsPage';
import { TopicQuizPage } from '@/pages/TopicQuizPage';
import { TheoryPage } from '@/pages/TheoryPage';
import { TestPage } from '@/pages/TestPage';
import { TheoryDetailPage } from '@/pages/TheoryDetailPage';
import '@/styles/globals.css';

const AppContent: FC = () => {
  const location = useLocation();
  const { theme, setTheme } = useStore();

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, [setTheme]);

  useEffect(() => {
    // Save theme to localStorage when it changes
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Pages che non devono mostrare la Navbar
  const hideNavbarRoutes = ['/', '/test-quiz', '/quiz/topics', '/topic-quiz', '/theory', '/theory-detail'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<TestPage />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/test-quiz" element={<QuizTestPage />} />
        <Route path="/quiz/topics" element={<TopicsPage />} />
        <Route path="/topic-quiz" element={<TopicQuizPage />} />
        <Route path="/theory" element={<TheoryPage />} />
        <Route path="/theory-detail" element={<TheoryDetailPage />} />
        {/* More routes will be added in future phases */}
      </Routes>
    </>
  );
};

const App: FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

