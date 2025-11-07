import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircleIcon, 
  UsersIcon, 
  TrophyIcon, 
  ShieldIcon,
  SwordIcon,
  CrownIcon,
  PlayIcon,
  StarIcon,
  LockIcon,
  SmartphoneIcon,
  ZapIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon,
  MailIcon,
  HeartIcon,
  SendIcon
} from "lucide-react";

function LandingPage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [totalRatings, setTotalRatings] = useState(30);
  const [averageRating, setAverageRating] = useState(4.8);
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);
  const heroRef = useRef(null);

  const features = [
    {
      icon: <ShieldCheckIcon className="w-10 h-10" />,
      title: "Military-Grade Encryption",
      description: "End-to-end encrypted chats that even we can't read",
      color: "from-emerald-400 to-cyan-500",
      bgColor: "from-emerald-500/10 to-cyan-500/10",
      borderColor: "border-emerald-400/30",
      logo: "🔒"
    },
    {
      icon: <UsersIcon className="w-10 h-10" />,
      title: "Elite Squads",
      description: "Create warrior squads and coordinate with your team",
      color: "from-blue-400 to-indigo-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-400/30",
      logo: "⚔️"
    },
    {
      icon: <ZapIcon className="w-10 h-10" />,
      title: "Lightning Fast",
      description: "Instant message delivery with zero delays",
      color: "from-amber-300 to-orange-400",
      bgColor: "from-amber-500/10 to-orange-500/10",
      borderColor: "border-amber-400/30",
      logo: "⚡"
    },
    {
      icon: <CrownIcon className="w-10 h-10" />,
      title: "Premium Features",
      description: "All features unlocked for every warrior",
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-400/30",
      logo: "👑"
    }
  ];

  const stats = [
    { number: "50+", label: "ACTIVE WARRIORS", icon: <SwordIcon className="w-4 h-4" /> },
    { number: "100%", label: "SECURE", icon: <LockIcon className="w-4 h-4" /> },
    { number: "24/7", label: "OPERATIONAL", icon: <TargetIcon className="w-4 h-4" /> },
    { number: "∞", label: "FREE", icon: <TrophyIcon className="w-4 h-4" /> }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Load rating from localStorage
    const savedRating = localStorage.getItem('thugSlayersRating');
    if (savedRating) {
      setUserRating(parseInt(savedRating));
      setHasRated(true);
    }

    // Simulate logo load
    setTimeout(() => setIsLogoLoaded(true), 1000);

    return () => {
      clearInterval(featureInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleRating = (rating) => {
    if (!hasRated) {
      setUserRating(rating);
      setHasRated(true);
      localStorage.setItem('thugSlayersRating', rating.toString());
      
      // Update average rating (simulated)
      const newTotal = totalRatings + 1;
      const newAverage = ((averageRating * totalRatings) + rating) / newTotal;
      setTotalRatings(newTotal);
      setAverageRating(parseFloat(newAverage.toFixed(1)));
    }
  };

  const handleEmailClick = () => {
    const subject = encodeURIComponent("Thug Slayers - Suggestions & Coordination");
    const body = encodeURIComponent("Hello Mohammed Ali,\n\nI would like to share some suggestions/coordinate regarding Thug Slayers:\n\n");
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=rajaali8383679@gmail.com&su=${subject}&body=${body}`, '_blank');
  };

  // Parallax effect for background elements
  const parallaxStyle = {
    transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
  };

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="w-full min-h-mobile-screen safe-area bg-gradient-to-br from-slate-900 via-slate-800/30 to-slate-900 overflow-auto relative">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dynamic gradient orbs */}
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-amber-500/15 to-orange-500/15 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl"
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 80 - 40, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              delay: Math.random() * 3,
              repeat: Infinity,
            }}
            className="absolute w-1 h-1 bg-amber-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Animated grid */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"
          style={parallaxStyle}
        />
      </div>

      <div className="relative z-10 w-full min-h-full flex flex-col">
        {/* Enhanced Header */}
        <motion.header 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex justify-between items-center p-4 sm:p-6 sticky top-0 bg-slate-900/90 backdrop-blur-xl z-50 border-b border-amber-500/20"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              <div className="absolute inset-0 bg-amber-400 rounded-full blur-md opacity-75"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-amber-300/50 shadow-2xl overflow-hidden">
                {/* Combined Logo Images */}
                <div className="relative w-full h-full">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute inset-0 opacity-40 bg-[url('/guild-members-squad1.png')] bg-cover bg-center"
                  />
                  <motion.div
                    animate={{ scale: [1.1, 1, 1.1] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute inset-0 opacity-60 bg-[url('/thug-slayers-badge.png')] bg-cover bg-center"
                  />
                </div>
              </div>
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-white bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                THUG SLAYERS
              </h1>
              <p className="text-amber-400 text-xs font-mono">SECURE MESSENGER</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full border border-amber-500/40 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <TrophyIcon className="w-4 h-4 text-amber-400" />
            </motion.div>
            <span className="text-amber-300 text-sm font-semibold">Free Forever</span>
          </motion.div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Enhanced Hero Section */}
          <section ref={heroRef} className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-center py-12 sm:py-20">
            {/* Animated Badge with Combined Images */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 1.5
              }}
              className="relative mb-8 sm:mb-12"
            >
              {/* Outer Glow */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity 
                }}
                className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-2xl"
              />
              
              {/* Main Badge Container */}
              <motion.div
                animate={floatingAnimation}
                className="relative w-40 h-40 sm:w-64 sm:h-64 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-amber-300/50 shadow-2xl overflow-hidden"
              >
                {/* Combined Background Images - No Sword Icon */}
                <AnimatePresence>
                  {isLogoLoaded && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.3, scale: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="absolute inset-0"
                        style={{
                          backgroundImage: 'url("/guild-members-squad1.png")',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={{ opacity: 0.7, scale: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="absolute inset-0"
                        style={{
                          backgroundImage: 'url("/thug-slayers-badge.png")',
                          backgroundSize: 'contain',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          margin: '10%'
                        }}
                      />
                    </>
                  )}
                </AnimatePresence>

                {/* Loading placeholder */}
                {!isLogoLoaded && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-amber-200/30 border-t-amber-200 rounded-full"
                  />
                )}
              </motion.div>

              {/* Animated Rings */}
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-8 border-2 border-amber-400/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360, scale: [1.1, 1, 1.1] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-12 border-2 border-orange-400/15 rounded-full"
              />

              {/* Fixed Floating Elements Around Badge */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    rotate: 360,
                    scale: [1, 1.3, 1],
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 6 + i * 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`absolute w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r ${features[i].color} rounded-full flex items-center justify-center border-2 border-white/20 shadow-2xl text-white backdrop-blur-sm z-20`}
                  style={{
                    left: `${50 + 65 * Math.cos((i * Math.PI) / 2 - Math.PI / 4)}%`,
                    top: `${50 + 65 * Math.sin((i * Math.PI) / 2 - Math.PI / 4)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {features[i].icon}
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-8 sm:mb-12"
            >
              <motion.h1
                animate={{ 
                  backgroundPosition: ['0%', '100%', '0%'],
                  textShadow: [
                    '0 0 20px rgba(245, 158, 11, 0.3)',
                    '0 0 40px rgba(245, 158, 11, 0.6)',
                    '0 0 20px rgba(245, 158, 11, 0.3)'
                  ]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-5xl sm:text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300 bg-clip-text text-transparent bg-[length:200%_auto]"
              >
                THUG SLAYERS
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xl sm:text-2xl text-slate-300 mb-3 font-light"
              >
                The Ultimate Secure Messenger
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-amber-400 text-lg sm:text-xl font-semibold flex items-center justify-center gap-2"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <SparklesIcon className="w-5 h-5" />
                </motion.span>
                For Warriors Who Value Privacy
                <motion.span
                  animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <SparklesIcon className="w-5 h-5" />
                </motion.span>
              </motion.p>
            </motion.div>

            {/* Enhanced Animated Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="max-w-2xl w-full mx-auto mb-8 sm:mb-12 min-h-[100px]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 1.05 }}
                  transition={{ duration: 0.7, type: "spring" }}
                  className={`p-6 rounded-2xl backdrop-blur-lg border-2 bg-gradient-to-br ${features[currentFeature].bgColor} ${features[currentFeature].borderColor} shadow-2xl relative overflow-hidden`}
                >
                  {/* Animated background gradient */}
                  <motion.div
                    animate={{ 
                      x: [-100, 100],
                      opacity: [0, 0.1, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent`}
                  />
                  
                  {/* Side Logo/Emoji */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -left-4 -top-4 text-4xl opacity-20"
                  >
                    {features[currentFeature].logo}
                  </motion.div>
                  
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`p-3 rounded-xl bg-gradient-to-br ${features[currentFeature].color} bg-opacity-20 backdrop-blur-sm z-10`}
                    >
                      <div className="text-white">
                        {features[currentFeature].icon}
                      </div>
                    </motion.div>
                    <div className="text-left flex-1 z-10">
                      <h3 className={`font-bold text-lg sm:text-xl mb-2 bg-gradient-to-br ${features[currentFeature].color} bg-clip-text text-transparent`}>
                        {features[currentFeature].title}
                      </h3>
                      <p className="text-slate-300 text-sm sm:text-base">
                        {features[currentFeature].description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
            >
              <Link to="/login" className="flex-1">
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(245, 158, 11, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl text-base sm:text-lg relative overflow-hidden group"
                >
                  {/* Animated background */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity 
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400"
                  />
                  
                  {/* Moving shine effect */}
                  <motion.div
                    animate={{ x: [-100, 100] }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                  
                  <PlayIcon className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">JOIN THE BATTLE</span>
                </motion.button>
              </Link>
              
              <Link to="/signup" className="flex-1">
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: "rgba(251, 191, 36, 0.1)",
                    borderColor: "rgba(251, 191, 36, 0.6)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-slate-800/50 backdrop-blur-sm text-amber-400 py-4 rounded-2xl font-bold border-2 border-amber-500/40 transition-all text-base sm:text-lg relative overflow-hidden group"
                >
                  <span className="relative z-10">CREATE ACCOUNT</span>
                  <motion.div
                    animate={{ x: [-100, 100] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent"
                  />
                </motion.button>
              </Link>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-8 sm:mt-12 w-full max-w-2xl"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2 + index * 0.2 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="text-center p-4 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-amber-500/20 relative overflow-hidden group"
                >
                  {/* Hover glow effect */}
                  <motion.div
                    whileHover={{ opacity: 0.1 }}
                    className="absolute inset-0 bg-amber-400 opacity-0 transition-opacity duration-300"
                  />
                  
                  <div className="flex items-center justify-center gap-2 mb-2 relative z-10">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="text-amber-400"
                    >
                      {stat.icon}
                    </motion.div>
                    <div className="text-2xl sm:text-3xl font-bold text-amber-400">
                      {stat.number}
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider relative z-10">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Enhanced Features Section */}
          <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-slate-800/30 to-slate-900/50">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-12 sm:mb-16"
              >
                <motion.h2
                  whileInView={{ 
                    textShadow: [
                      '0 0 20px rgba(245, 158, 11, 0)',
                      '0 0 40px rgba(245, 158, 11, 0.5)',
                      '0 0 20px rgba(245, 158, 11, 0)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  viewport={{ once: true }}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-400 mb-4"
                >
                  Warrior-Grade Features
                </motion.h2>
                <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto">
                  Built for those who demand the best in security and performance
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.02,
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                    className={`p-6 sm:p-8 rounded-3xl backdrop-blur-lg border-2 bg-gradient-to-br ${feature.bgColor} ${feature.borderColor} shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group`}
                  >
                    {/* Animated background on hover */}
                    <motion.div
                      whileHover={{ opacity: 0.1 }}
                      className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300"
                    />
                    
                    {/* Side Logo/Emoji */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="absolute -right-6 -bottom-6 text-6xl opacity-15"
                    >
                      {feature.logo}
                    </motion.div>

                    <div className="flex items-start gap-4 sm:gap-6 relative z-10">
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${feature.color} bg-opacity-20 backdrop-blur-sm`}
                      >
                        <div className="text-white">
                          {feature.icon}
                        </div>
                      </motion.div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-xl sm:text-2xl mb-3 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`}>
                          {feature.title}
                        </h3>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* Interactive Rating Section */}
          <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-900/50 to-slate-800/30">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                viewport={{ once: true }}
                className="inline-block mb-4"
              >
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                  Community Rating
                </div>
              </motion.div>

              <h2 className="text-3xl sm:text-4xl font-bold text-amber-400 mb-4">
                Join the Elite Ratings
              </h2>
              <p className="text-slate-300 text-lg mb-8">
                Be part of {totalRatings}+ warriors shaping our platform's future
              </p>

              {/* Interactive Star Rating */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-6 bg-slate-800/30 backdrop-blur-lg rounded-3xl p-8 border border-amber-500/20 relative overflow-hidden"
              >
                {/* Background Glow */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.05, 0.1, 0.05]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity 
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 blur-xl"
                />
                
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <div className="text-4xl font-bold text-amber-400">
                    {averageRating}
                  </div>
                  <div className="text-slate-400 text-lg">out of 5</div>
                </div>

                <div className="flex gap-1 sm:gap-2 mb-4 relative z-10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: hasRated ? 1 : 1.3, y: hasRated ? 0 : -5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => !hasRated && setHoverRating(star)}
                      onMouseLeave={() => !hasRated && setHoverRating(0)}
                      className={`p-2 rounded-xl transition-all duration-300 ${
                        !hasRated ? 'cursor-pointer hover:bg-amber-500/20' : 'cursor-default'
                      } ${hasRated && star <= userRating ? 'bg-amber-500/20' : ''}`}
                      disabled={hasRated}
                    >
                      <motion.div
                        whileHover={{ 
                          rotate: star <= (hoverRating || userRating) ? [0, -15, 15, 0] : 0,
                          scale: star <= (hoverRating || userRating) ? 1.2 : 1
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <StarIcon
                          className={`w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300 ${
                            star <= (hoverRating || userRating)
                              ? 'fill-amber-400 text-amber-400 drop-shadow-lg'
                              : star <= averageRating
                              ? 'fill-amber-400/40 text-amber-400/40'
                              : 'text-slate-600 fill-slate-600/20'
                          } ${
                            !hasRated && 'hover:fill-amber-300 hover:text-amber-300'
                          }`}
                        />
                      </motion.div>
                    </motion.button>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={hasRated ? { opacity: 1, scale: 1 } : {}}
                  className="relative z-10"
                >
                  <motion.p
                    animate={hasRated ? { 
                      scale: [1, 1.1, 1],
                      color: ["#fbbf24", "#f59e0b", "#fbbf24"]
                    } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-amber-400 font-semibold text-lg mb-2 flex items-center gap-2"
                  >
                    <motion.span
                      animate={hasRated ? { rotate: [0, 360] } : {}}
                      transition={{ duration: 1 }}
                    >
                      🎉
                    </motion.span>
                    Thank you for your {userRating}-star rating!
                    <motion.span
                      animate={hasRated ? { rotate: [0, -360] } : {}}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                      🎉
                    </motion.span>
                  </motion.p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-slate-400 text-sm relative z-10"
                >
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {totalRatings} warrior ratings
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <TrophyIcon className="w-4 h-4 text-amber-400" />
                      {averageRating} average
                    </span>
                  </div>
                </motion.div>

                {/* Floating particles for rating section */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -40, 0],
                      x: [0, Math.random() * 30 - 15, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 5 + Math.random() * 3,
                      delay: Math.random() * 2,
                      repeat: Infinity,
                    }}
                    className="absolute w-1 h-1 bg-amber-400/60 rounded-full"
                    style={{
                      left: `${15 + i * 20}%`,
                      top: `${10 + i * 15}%`,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </section>

          {/* Enhanced CTA Section */}
          <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
            <div className="absolute inset-0">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center relative z-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                viewport={{ once: true }}
                className="inline-block mb-6"
              >
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                  Join the Elite
                </div>
              </motion.div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-400 mb-6">
                Ready to Command Your Communications?
              </h2>
              <p className="text-slate-300 text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of elite warriors who trust Thug Slayers for mission-critical secure messaging
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 sm:px-12 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-amber-500/30 transition-all text-lg relative overflow-hidden group"
                  >
                    <span className="relative z-10">START YOUR JOURNEY</span>
                    <motion.div
                      animate={{ x: [-100, 100] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  </motion.button>
                </Link>
                
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-slate-800/50 backdrop-blur-sm text-amber-400 px-8 sm:px-12 py-4 rounded-2xl font-bold border-2 border-amber-500/40 hover:border-amber-500/60 hover:bg-amber-500/10 transition-all text-lg"
                  >
                    I'M A VETERAN
                  </motion.button>
                </Link>
              </div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
                className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 mt-8 text-slate-400"
              >
                <div className="flex items-center gap-2">
                  <ShieldIcon className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">100% Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrophyIcon className="w-4 h-4 text-amber-400" />
                  <span className="text-sm">No Hidden Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">Instant Setup</span>
                </div>
              </motion.div>
            </motion.div>
          </section>
        </div>

        {/* Enhanced Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="p-6 sm:p-8 text-center border-t border-amber-500/10 bg-slate-900/90 backdrop-blur-xl"
        >
          <div className="max-w-4xl mx-auto">
            {/* Developer Credit with Enhanced Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8 }}
              className="mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center gap-4 mb-6"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <HeartIcon className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className="text-slate-400 text-lg">Crafted with passion by</span>
                </div>
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                  }}
                  className="relative"
                >
                  <motion.span
                    animate={{
                      textShadow: [
                        "0 0 0px rgba(251, 191, 36, 0)",
                        "0 0 20px rgba(251, 191, 36, 0.5)",
                        "0 0 0px rgba(251, 191, 36, 0)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent cursor-pointer px-6 py-2 rounded-2xl border border-amber-500/30 hover:border-amber-500/60 transition-all"
                  >
                    Mohammed Ali
                  </motion.span>
                </motion.div>
              </motion.div>

              {/* Email Contact Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                className="mb-6"
              >
                <p className="text-slate-400 text-sm mb-4">
                  Contact here for suggestions and coordination
                </p>
                <motion.button
                  onClick={handleEmailClick}
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: "rgba(251, 191, 36, 0.1)",
                    borderColor: "rgba(251, 191, 36, 0.6)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-6 py-4 bg-slate-800/50 backdrop-blur-sm text-amber-400 rounded-2xl font-semibold border-2 border-amber-500/40 transition-all group relative overflow-hidden"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute -left-8 w-16 h-16 bg-amber-400/10 rounded-full"
                  />
                  <SendIcon className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
                  <span className="relative z-10">rajaali8383679@gmail.com</span>
                  <motion.div
                    animate={{ x: [-100, 100] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent"
                  />
                </motion.button>
              </motion.div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.2 }}
              className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed"
            >
              Secure messaging crafted for the Thug Slayers community and warriors worldwide. 
              Your privacy is our battle cry.
            </motion.p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

export default LandingPage;