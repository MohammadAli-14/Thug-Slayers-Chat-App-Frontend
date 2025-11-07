import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { motion } from "framer-motion";
import { 
  LoaderIcon, 
  ShieldIcon, 
  RotateCcwIcon,
  SwordIcon,
  MailIcon
} from "lucide-react";

function OTPVerificationPage() {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const { verifyOTP, resendOTP, isVerifyingOTP, isResendingOTP } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  // Get email from navigation state or redirect back
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== "") && index === 4) {
      handleVerifyOTP(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpValue = otp.join("")) => {
    if (otpValue.length !== 5) {
      alert("Please enter the complete 5-digit code");
      return;
    }

    try {
      await verifyOTP({ email, otp: otpValue });
      // Navigation happens automatically after successful verification
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP({ email });
      setTimer(300); // Reset timer to 5 minutes
      setOtp(["", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      // Error is handled in the store
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800/30 to-slate-900 min-h-mobile-screen safe-area">
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
                    VERIFY YOUR EMAIL
                  </h2>
                  <p className="text-slate-400 text-sm sm:text-base">Enter the 5-digit code sent to</p>
                  <p className="text-amber-400 font-medium mt-1 text-sm sm:text-base">{email}</p>
                </div>

                {/* OTP INPUTS */}
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="auth-input-label">Verification Code</label>
                    <div className="flex justify-between gap-3">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-12 h-12 sm:w-16 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-slate-800/50 border border-amber-500/30 rounded-lg text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>
                  </div>

                  {/* TIMER AND RESEND */}
                  <div className="text-center space-y-4">
                    <div className="text-slate-400 text-sm">
                      {timer > 0 ? (
                        <p>Code expires in <span className="text-amber-400 font-mono">{formatTime(timer)}</span></p>
                      ) : (
                        <p className="text-amber-400">Code has expired</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isResendingOTP || timer > 0}
                      className="auth-link inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-amber-400 hover:text-amber-300 bg-amber-500/10"
                    >
                      <RotateCcwIcon className="w-4 h-4" />
                      {isResendingOTP ? "Sending..." : "Resend Code"}
                    </button>
                  </div>

                  {/* VERIFY BUTTON */}
                  <div className="bg-amber-500/10 rounded-lg p-1 border border-amber-500/20">
                    <button
                      onClick={() => handleVerifyOTP()}
                      disabled={isVerifyingOTP || otp.join("").length !== 5}
                      className="w-full bg-amber-500 text-white rounded-lg py-3 font-bold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      {isVerifyingOTP ? (
                        <>
                          <LoaderIcon className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          VERIFYING...
                        </>
                      ) : (
                        <>
                          <ShieldIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                          VERIFY ACCOUNT
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* BACK TO SIGNUP */}
                <div className="mt-6 text-center">
                  <button
                    onClick={() => navigate("/signup")}
                    className="auth-link bg-amber-500/10 text-amber-400 hover:text-amber-300 text-sm"
                  >
                    ← Wrong email? Go back
                  </button>
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
                    alt="Thug Slayers Verification"
                    className="w-full h-48 sm:h-64 object-contain rounded-lg mb-6"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const defaultContent = e.target.parentNode.querySelector('.default-content');
                      if (defaultContent) defaultContent.style.display = 'block';
                    }}
                  />
                  
                  <div className="default-content" style={{display: 'none'}}>
                    <div className="w-32 h-32 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                      <ShieldIcon className="w-16 h-16 text-amber-400" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-amber-400 mb-4">
                    Secure Verification
                  </h3>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-amber-400 text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-amber-300 text-sm font-medium">Military-Grade Security</p>
                        <p className="text-slate-400 text-xs">Your account is protected with elite security measures</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-amber-400 text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-amber-300 text-sm font-medium">Instant Access</p>
                        <p className="text-slate-400 text-xs">Get verified and join the community instantly</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-amber-400 text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-amber-300 text-sm font-medium">Private & Secure</p>
                        <p className="text-slate-400 text-xs">We never share your data with third parties</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-amber-400 text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-amber-300 text-sm font-medium">Free Forever</p>
                        <p className="text-slate-400 text-xs">No hidden costs or subscriptions</p>
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

export default OTPVerificationPage;