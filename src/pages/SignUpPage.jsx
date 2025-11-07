import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { motion } from "framer-motion"; // ADD THIS IMPORT
import { 
  LockIcon, 
  MailIcon, 
  UserIcon, 
  LoaderIcon, 
  SwordIcon,
  UsersIcon,
  ShieldIcon
} from "lucide-react";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signup(formData);
      if (result.success) {
        navigate("/verify-otp", { state: { email: formData.email } });
      }
    } catch (error) {
      // Error is handled in the store
    }
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
                  <div className="animate-float mb-4">
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
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
                    JOIN US
                  </h2>
                  <p className="text-slate-400 text-sm sm:text-base">Create your free account</p>
                </div>

                {/* SIGNUP FORM */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* FULL NAME */}
                  <div>
                    <label className="auth-input-label">Full Name</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="input text-sm sm:text-base"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  {/* EMAIL INPUT */}
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
                      Any email provider accepted
                    </p>
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input text-sm sm:text-base"
                        placeholder="Create a password (min 6 characters)"
                        required
                        minLength="6"
                      />
                    </div>
                  </div>

                  {/* SECURITY INFO */}
                  <div className="bg-slate-800/30 rounded-lg p-4 border border-amber-500/20">
                    <h4 className="text-amber-400 text-sm font-semibold mb-2 flex items-center gap-2">
                      <ShieldIcon className="w-4 h-4" />
                      Your Security Matters:
                    </h4>
                    <ul className="text-slate-400 text-xs space-y-1">
                      <li>• End-to-end encryption</li>
                      <li>• No data sharing with third parties</li>
                      <li>• Your privacy is our priority</li>
                      <li>• Free forever</li>
                    </ul>
                  </div>

                  <div className="bg-amber-500/10 rounded-lg p-1 border border-amber-500/20">
                    <button 
                      className="w-full bg-amber-500 text-white rounded-lg py-3 font-bold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm sm:text-base" 
                      type="submit" 
                      disabled={isSigningUp}
                    >
                      {isSigningUp ? (
                        <>
                          <LoaderIcon className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          CREATING ACCOUNT...
                        </>
                      ) : (
                        "CREATE ACCOUNT"
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center space-y-3">
                  <Link to="/" className="auth-link bg-amber-500/10 text-amber-400 hover:text-amber-300 block text-sm">
                    ← Back to Home
                  </Link>
                  <Link to="/login" className="auth-link bg-slate-800/50 text-slate-400 hover:text-slate-300 block text-sm">
                    Already have an account? Sign in
                  </Link>
                </div>
              </div>
            </div>

            {/* BENEFITS - RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-br from-slate-800/20 to-amber-500/10">
              <div className="text-center max-w-md">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <img
                    src="/guild-members-squad1.png"
                    alt="Join Thug Slayers Community"
                    className="w-full h-48 sm:h-64 object-contain rounded-lg mb-6"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const defaultContent = e.target.parentNode.querySelector('.default-content');
                      if (defaultContent) defaultContent.style.display = 'block';
                    }}
                  />
                  
                  <div className="default-content" style={{display: 'none'}}>
                    <div className="w-32 h-32 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                      <UsersIcon className="w-16 h-16 text-amber-400" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-amber-400 mb-4">
                    Why Join Thug Slayers?
                  </h3>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-amber-400 text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-amber-300 text-sm font-medium">Free Forever</p>
                        <p className="text-slate-400 text-xs">No hidden costs or subscriptions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-amber-400 text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-amber-300 text-sm font-medium">Cross-Platform</p>
                        <p className="text-slate-400 text-xs">Works on all your devices</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-amber-400 text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-amber-300 text-sm font-medium">Group Chats</p>
                        <p className="text-slate-400 text-xs">Chat with friends and family</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-amber-400 text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-amber-300 text-sm font-medium">Secure & Private</p>
                        <p className="text-slate-400 text-xs">Your conversations are protected</p>
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

export default SignUpPage;