import { FC, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { OfflineIndicator } from '@/components/ui/OfflineIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Eager load critical pages
import { HomePage } from '@/pages/HomePage';
import { DashboardHome } from '@/pages/DashboardHome';

// Lazy load other pages
const LandingPage = lazy(() => import('@/pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const UserDashboard = lazy(() => import('@/pages/UserDashboard').then(m => ({ default: m.UserDashboard })));
const UserProfile = lazy(() => import('@/pages/UserProfile').then(m => ({ default: m.UserProfile })));
const QuizTestPage = lazy(() => import('@/pages/QuizTestPage').then(m => ({ default: m.QuizTestPage })));
const TopicsPage = lazy(() => import('@/pages/TopicsPage').then(m => ({ default: m.TopicsPage })));
const TopicQuizPage = lazy(() => import('@/pages/TopicQuizPage').then(m => ({ default: m.TopicQuizPage })));
const TheoryPage = lazy(() => import('@/pages/TheoryPage').then(m => ({ default: m.TheoryPage })));
const LessonDetailPage = lazy(() => import('@/pages/teoria/LessonDetailPage').then(m => ({ default: m.LessonDetailPage })));
const SignalsTheoryPage = lazy(() => import('@/pages/SignalsTheoryPage').then(m => ({ default: m.SignalsTheoryPage })));
const BookmarkedQuestionsPage = lazy(() => import('@/pages/BookmarkedQuestionsPage').then(m => ({ default: m.BookmarkedQuestionsPage })));
const SmartReviewPage = lazy(() => import('@/pages/SmartReviewPage').then(m => ({ default: m.SmartReviewPage })));
const AchievementsPage = lazy(() => import('@/pages/AchievementsPage').then(m => ({ default: m.AchievementsPage })));
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage').then(m => ({ default: m.LeaderboardPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const QuestionBrowserPage = lazy(() => import('@/pages/QuestionBrowserPage').then(m => ({ default: m.QuestionBrowserPage })));
const MyProgressPage = lazy(() => import('@/pages/MyProgressPage').then(m => ({ default: m.MyProgressPage })));
const QuizPage20 = lazy(() => import('@/pages/QuizPage20').then(m => ({ default: m.QuizPage20 })));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
      <p className="text-white text-lg">Caricamento...</p>
    </div>
  </div>
);

const App: FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <OfflineIndicator />
          <Suspense fallback={<PageLoader />}>
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/test-quiz" element={<QuizTestPage />} />
            <Route path="/quiz/exam" element={<QuizTestPage />} />
            <Route path="/quiz/topics" element={<TopicsPage />} />
            <Route path="/topic-quiz" element={<TopicQuizPage />} />
            <Route path="/theory" element={<TheoryPage />} />
            <Route path="/theory/lesson/:id" element={<LessonDetailPage />} />
            <Route path="/theory/signals/:chapterId" element={<SignalsTheoryPage />} />
            <Route path="/bookmarks" element={<BookmarkedQuestionsPage />} />
            <Route path="/smart-review" element={<SmartReviewPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/questions" element={<QuestionBrowserPage />} />
            <Route path="/my-progress" element={<MyProgressPage />} />
            <Route path="/quiz/2.0" element={<QuizPage20 />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
