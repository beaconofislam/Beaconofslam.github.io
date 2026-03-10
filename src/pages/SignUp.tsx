import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Check } from 'lucide-react';

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

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreed: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreed) {
      alert('Please agree to the terms and privacy policy.');
      return;
    }
    // Handle signup logic here
    console.log('Signup attempt:', formData);
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
              <h1 className="text-3xl font-bold mb-2">Create <span className="orange-gradient-text">Account</span></h1>
              <p className="text-gray-400">Join the Beacon of Islam community</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <div 
                  className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors mt-0.5 ${formData.agreed ? 'bg-brand-orange border-brand-orange' : 'bg-white/5 border-white/20'}`}
                  onClick={() => setFormData({ ...formData, agreed: !formData.agreed })}
                >
                  {formData.agreed && <Check size={14} className="text-white" />}
                </div>
                <label className="text-xs text-gray-400 leading-relaxed cursor-pointer" onClick={() => setFormData({ ...formData, agreed: !formData.agreed })}>
                  I agree to the <Link to="/terms" className="text-brand-orange hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-brand-orange hover:underline">Privacy Policy</Link>.
                </label>
              </div>

              <button type="submit" className="btn-primary w-full justify-center py-4 mt-4">
                Create Account <ArrowRight size={18} />
              </button>
            </form>

            <p className="mt-10 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-orange font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </TiltCard>
      </motion.div>
    </div>
  );
}
