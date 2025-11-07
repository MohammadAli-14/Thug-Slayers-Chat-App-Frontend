import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { motion } from "framer-motion"; // ADD THIS IMPORT
import { 
  MailIcon, 
  LoaderIcon, 
  LockIcon, 
  UsersIcon, 
  TrophyIcon,
  SwordIcon,
  MessageCircleIcon
} from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900 min-h-mobile-screen safe-area">
      <div className="relative w-full max-w-6xl md:h-[800px] h-full">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row h-full">
            {/* FORM COLUMN - LEFT SIDE */}
            <div className="md:w-1/2 p-6 sm:p-8 flex items-center justify-center md:border-r border-amber-500/30">
              <div className="w-full max-w-md">
                {/* GUILD BRANDING */}
                <div className="text-center mb-6 sm:mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="animate-float mb-4"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                      <img 
                        src="/thug-slayers-badge.png" 
                        alt="Thug Slayers Badge"
                        className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <SwordIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white hidden" />
                    </div>
                  </motion.div>
                  
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
                    WELCOME BACK
                  </h2>
                  <p className="text-slate-400 text-sm sm:text-base">Sign in to your account</p>
                  
                  <div className="mt-3 flex justify-center gap-2">
                    <span className="auth-badge bg-amber-500/20 text-amber-300 text-xs">
                      <TrophyIcon className="w-3 h-3 mr-1" />
                      Secure
                    </span>
                    <span className="auth-badge bg-red-500/20 text-red-300 text-xs">
                      <UsersIcon className="w-3 h-3 mr-1" />
                      Private
                    </span>
                  </div>
                </div>

                {/* LOGIN FORM */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="auth-input-label">Email Address</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input text-sm sm:text-base"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    <p className="text-slate-500 text-xs mt-1">
                      Use any email - Gmail, Yahoo, Outlook, etc.
                    </p>
                  </div>

                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input text-sm sm:text-base"
                        placeholder="Enter your password"
                        required
                        minLength="6"
                      />
                    </div>
                    <div className="text-right mt-2">
                      <Link to="/forgot-password" className="text-amber-400 hover:text-amber-300 text-xs sm:text-sm">
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 rounded-lg p-1 border border-amber-500/20">
                    <button 
                      className="w-full bg-amber-500 text-white rounded-lg py-3 font-bold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm sm:text-base" 
                      type="submit" 
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? (
                        <>
                          <LoaderIcon className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          SIGNING IN...
                        </>
                      ) : (
                        "SIGN IN TO CHAT"
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center space-y-3">
                  <Link to="/" className="auth-link bg-amber-500/10 text-amber-400 hover:text-amber-300 block text-sm">
                    ← Back to Home
                  </Link>
                  <Link to="/signup" className="auth-link bg-slate-800/50 text-slate-400 hover:text-slate-300 block text-sm">
                    Don't have an account? Sign up
                  </Link>
                </div>
              </div>
            </div>

            {/* GUILD ILLUSTRATION - RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-br from-slate-800/20 to-amber-500/10">
              <div className="text-center max-w-md">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <img
                    src="/guild-members-squad1.png"
                    alt="Thug Slayers Community"
                    className="w-full h-48 sm:h-64 object-contain rounded-lg mb-6"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      // Show default content if image fails
                      const defaultContent = e.target.parentNode.querySelector('.default-content');
                      if (defaultContent) defaultContent.style.display = 'block';
                    }}
                  />
                  
                  <div className="default-content" style={{display: 'none'}}>
                    <div className="w-32 h-32 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                      <MessageCircleIcon className="w-16 h-16 text-amber-400" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-amber-400 mb-4">
                    Thug Slayers Messenger
                  </h3>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <UsersIcon className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-amber-300 text-sm font-medium">Private Chats</p>
                        <p className="text-slate-400 text-xs">Secure one-on-one conversations</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageCircleIcon className="w-4 h-4 text-red-400" />
                      </div>
                      <div>
                        <p className="text-amber-300 text-sm font-medium">Group Chats</p>
                        <p className="text-slate-400 text-xs">Chat with multiple people</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <LockIcon className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-amber-300 text-sm font-medium">End-to-End Encrypted</p>
                        <p className="text-slate-400 text-xs">Your messages are secure</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default LoginPage;