import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import các trang
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashBoard from './pages/admin/AdminDashBoard';
import LoanHistoryPage from './pages/LoanHistoryPage';
import BookDetailPage from './pages/BookDetailPage';

// Import các route con của Admin
import ManageLoans from './pages/admin/ManageLoans';
import ManageBooks from './pages/admin/ManageBooks';
import ManageUser from './pages/admin/ManageUsers';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <div style={{ padding: '20px'}}>
        <Routes>
          {/*--- Public Routes ---*/}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/*--- User Routes ---*/}
          <Route element={<ProtectedRoute />} >
            <Route path='/' element={<HomePage />} />
            <Route path="/history" element={<LoanHistoryPage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
          </Route>

          {/*--- Admin Routes ---*/}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminDashBoard />}>
              
              {/* Route con "index" (mặc định) -> /admin */}
              <Route index element={<ManageLoans />} />

              {/* /admin/books */}
              <Route path="books" element={<ManageBooks />} />

              {/* /admin/users */}
              <Route path="users" element={<ManageUser />} />
            </Route>
          </Route>
        </Routes>
      </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
