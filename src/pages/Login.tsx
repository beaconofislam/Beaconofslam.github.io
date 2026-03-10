import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';

function TiltCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

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
          transform: "translateZ(60px)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { email, password });
    navigate('/dashboard');
  };

  return (
    <div className="pt-32 pb-24 px-6 relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 islamic-pattern pointer-events-none opacity-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <TiltCard>
          <div className="glass-card p-8 md:p-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-2">Welcome <span className="orange-gradient-text">Back</span></h1>
              <p className="text-gray-400">Sign in to continue to Beacon of Islam</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-400">Password</label>
                  <Link to="/forgot-password" title="Forgot password?" className="text-xs text-brand-orange hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center py-4">
                Sign In <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-brand-black px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="btn-secondary justify-center py-3 text-sm">
                <Chrome size={18} /> Google
              </button>
              <button className="btn-secondary justify-center py-3 text-sm">
                <Github size={18} /> GitHub
              </button>
            </div>

            <p className="mt-10 text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-brand-orange font-semibold hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>
        </TiltCard>
      </motion.div>
    </div>
  );
}
