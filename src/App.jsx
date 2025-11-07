import { Route, Routes, Navigate } from "react-router";
import { lazy, Suspense } from 'react';
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./components/LandingPage";
import OTPVerificationPage from "./pages/OTPVerificationPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";


// Lazy load heavy components
const ChatPage = lazy(() => import("./pages/ChatPage"));

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="min-h-dynamic-screen bg-slate-900 relative flex items-center justify-center overflow-hidden">
      {/* DECORATORS - GRID BG & GLOW SHAPES */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-amber-500/20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500/20 blur-[100px]" />
      
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Landing page for unauthenticated users, chat for authenticated */}
          <Route path="/" element={authUser ? <ChatPage /> : <LandingPage />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route 
            path="/verify-otp" 
            element={!authUser ? <OTPVerificationPage /> : <Navigate to="/" />} 
          />
          <Route path="/forgot-password" element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/" />} />
        </Routes>
      </Suspense>
      
      <Toaster />
    </div>
  );
}

export default App;