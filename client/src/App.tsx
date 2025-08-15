import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TextGenerator from './pages/TextGenerator';
import ImageGenerator from './pages/ImageGenerator';
import VoiceGenerator from './pages/VoiceGenerator';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import ToolLayout from './components/ToolLayout';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};

// Component for tools that can be used with or without authentication
const OptionalAuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Homepage - always accessible */}
      <Route path="/" element={<Homepage />} />
      
      {/* Public auth routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      {/* Tools that work with or without authentication */}
      <Route path="/text-generator" element={
        <OptionalAuthRoute>
          <ToolLayout>
            <TextGenerator />
          </ToolLayout>
        </OptionalAuthRoute>
      } />
      <Route path="/image-generator" element={
        <OptionalAuthRoute>
          <ToolLayout>
            <ImageGenerator />
          </ToolLayout>
        </OptionalAuthRoute>
      } />
      <Route path="/voice-generator" element={
        <OptionalAuthRoute>
          <ToolLayout>
            <VoiceGenerator />
          </ToolLayout>
        </OptionalAuthRoute>
      } />
      
      {/* Protected routes that require authentication */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
      </Route>
      
      <Route path="/profile" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Profile />} />
      </Route>
      
      {/* Catch all route - redirect to homepage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
