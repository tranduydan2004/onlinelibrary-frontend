import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import các trang
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import LoanHistoryPage from './pages/LoanHistoryPage';
import BookDetailPage from './pages/BookDetailPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import GenrePage from './pages/GenrePage';
import BooksByGenrePage from './pages/BooksByGenrePage';

// Import các route con của Admin
import ManageLoans from './pages/admin/ManageLoans';
import ManageBooks from './pages/admin/ManageBooks';
import ManageUser from './pages/admin/ManageUsers';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Header />
          <main className="app-main">
            <Routes>
              
              {/* Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="/book/:id" element={<BookDetailPage />} />
              <Route path="/genres" element={<GenrePage />} />
              <Route path="/genres/books" element={<BooksByGenrePage />} />

              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* User */}
              <Route element={<ProtectedRoute />}>
                <Route path="/history" element={<LoanHistoryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Admin */}
              <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/loans" element={<ManageLoans />} />
                <Route path="/admin/books" element={<ManageBooks />} />
                <Route path="/admin/users" element={<ManageUser />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
