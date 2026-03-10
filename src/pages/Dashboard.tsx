import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { 
  Video, 
  BookOpen, 
  Clock, 
  Award, 
  Settings, 
  LogOut, 
  Play, 
  ChevronRight,
  TrendingUp,
  Calendar
} from 'lucide-react';

function TiltCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <div
        style={{
          transform: "translateZ(50px)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

// Mock user data
const userData = {
  name: "Abdul Muiz",
  email: "abdulmuizadeyemi15@gmail.com",
  profilePic: "https://picsum.photos/seed/user123/200/200",
  joinedDate: "October 2025",
  stats: {
    videosWatched: 24,
    totalVideos: 150,
    articlesRead: 12,
    totalArticles: 45,
    timeSpent: "18h 45m",
    streak: 5
  },
  recentActivity: [
    { id: 1, type: 'video', title: 'The Story of Prophet Yunus (AS)', date: '2 hours ago', progress: 100 },
    { id: 2, type: 'article', title: '5 Ways to Strengthen Your Iman', date: 'Yesterday', progress: 100 },
    { id: 3, type: 'video', title: 'Understanding Salah', date: '2 days ago', progress: 45 },
    { id: 4, type: 'video', title: 'The Power of Dua', date: '3 days ago', progress: 100 },
  ]
};

export default function Dashboard() {
  const [timeOnSite, setTimeOnSite] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Simulate tracking time on site for the current session
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnSite(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + 'h ' : ''}${mins}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 px-6 relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 islamic-pattern pointer-events-none opacity-10" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin" />
          <p className="text-gray-400 text-sm font-medium animate-pulse">Loading your progress...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 relative min-h-screen">
      <div className="absolute inset-0 islamic-pattern pointer-events-none opacity-10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header / Profile Summary */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full blur opacity-75 animate-pulse"></div>
              <img 
                src={userData.profilePic} 
                alt={userData.name} 
                className="relative w-24 h-24 rounded-full border-2 border-white/10 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-brand-black rounded-full"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{userData.name}</h1>
              <p className="text-gray-400 flex items-center gap-2">
                <Calendar size={14} /> Member since {userData.joinedDate}
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4"
          >
            <button className="btn-secondary py-2 px-4 text-sm flex items-center gap-2">
              <Settings size={16} /> Edit Profile
            </button>
            <button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-2 px-4 rounded-full text-sm font-semibold transition-all flex items-center gap-2">
              <LogOut size={16} /> Logout
            </button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Videos Watched', value: userData.stats.videosWatched, total: userData.stats.totalVideos, icon: Video, color: 'text-blue-400', bg: 'bg-blue-400/10', barColor: 'bg-blue-500' },
            { label: 'Articles Read', value: userData.stats.articlesRead, total: userData.stats.totalArticles, icon: BookOpen, color: 'text-orange-400', bg: 'bg-orange-400/10', barColor: 'bg-orange-500' },
            { label: 'Total Learning Time', value: userData.stats.timeSpent, icon: Clock, color: 'text-green-400', bg: 'bg-green-400/10' },
            { label: 'Current Session', value: formatTime(timeOnSite), icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          ].map((stat, i) => (
            <TiltCard key={i}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  {stat.total && (
                    <span className={`text-xs font-bold ${stat.color}`}>
                      {Math.round((stat.value as number / stat.total) * 100)}%
                    </span>
                  )}
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.label}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  {stat.total && <span className="text-gray-600 text-sm">/ {stat.total}</span>}
                </div>
                {stat.total && (
                  <div className="mt-4 w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stat.barColor} transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.5)]`} 
                      style={{ width: `${(stat.value as number / stat.total) * 100}%` }}
                    />
                  </div>
                )}
              </motion.div>
            </TiltCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Recent Activity</h2>
              <button className="text-brand-orange text-sm font-semibold hover:underline">View History</button>
            </div>
            <div className="space-y-4">
              {userData.recentActivity.map((activity, idx) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  className="glass-card p-4 hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${activity.type === 'video' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                      {activity.type === 'video' ? <Play size={20} fill="currentColor" /> : <BookOpen size={20} />}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold group-hover:text-brand-orange transition-colors">{activity.title}</h4>
                        <span className="text-xs text-gray-500">{activity.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-grow h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${activity.progress === 100 ? 'bg-green-500' : 'bg-brand-orange'}`}
                            style={{ width: `${activity.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 w-8">{activity.progress}%</span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Achievements / Sidebar */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Achievements</h2>
              <div className="glass-card p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center text-brand-orange mb-4 relative">
                    <Award size={40} />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-brand-black">
                      LV 4
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1">Knowledge Seeker</h3>
                  <p className="text-gray-400 text-sm mb-6">You've completed 5 days in a row!</p>
                  
                  <div className="w-full space-y-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Next Level: Scholar</span>
                      <span className="text-brand-orange">750 / 1000 XP</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-orange w-[75%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <TrendingUp size={18} className="text-brand-orange" /> Daily Goal
              </h3>
              <p className="text-sm text-gray-400 mb-4">Watch 2 more videos today to reach your goal.</p>
              <button className="btn-primary w-full py-2 text-sm">
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
