import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { PreferencesProvider } from '@/context/PreferencesContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import SkillsPage from '@/pages/SkillsPage';
import MatchesPage from '@/pages/MatchesPage';
import ExchangesPage from '@/pages/ExchangesPage';
import WalletPage from '@/pages/WalletPage';
import NotificationsPage from '@/pages/NotificationsPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';

function Shell() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/exchanges" element={<ExchangesPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PreferencesProvider>
          <Shell />
        </PreferencesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
