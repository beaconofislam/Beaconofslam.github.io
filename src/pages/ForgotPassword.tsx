import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Handle password reset logic here
    console.log('Password reset requested for:', email);
  };

  return (
    <div className="pt-32 pb-24 px-6 relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 islamic-pattern pointer-events-none opacity-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="glass-card p-8 md:p-10">
          {!submitted ? (
            <>
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-2">Reset <span className="orange-gradient-text">Password</span></h1>
                <p className="text-gray-400">Enter your email to receive reset instructions</p>
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

                <button type="submit" className="btn-primary w-full justify-center py-4">
                  Send Instructions <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center text-brand-orange mx-auto mb-6">
                <Mail size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-4">Check your email</h2>
              <p className="text-gray-400 mb-8">
                We've sent password reset instructions to <span className="text-white font-medium">{email}</span>.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-brand-orange font-semibold hover:underline"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2">
              <ArrowLeft size={16} /> Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
