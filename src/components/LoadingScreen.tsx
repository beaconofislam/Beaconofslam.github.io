import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function LoadingScreen() {
  const [text, setText] = useState('');
  const fullText = "Beacon of Islam";
  
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100); // Adjust speed of typing
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-brand-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Islamic Background Pattern */}
      <div className="absolute inset-0 islamic-pattern opacity-10" />
      
      {/* Flying Bird Animation */}
      <motion.div
        initial={{ x: '-150%', y: '20%', rotate: -10 }}
        animate={{ 
          x: '250%', 
          y: ['20%', '10%', '20%'],
          rotate: [ -10, 0, 10, 0, -10 ]
        }}
        transition={{ 
          duration: 3, 
          ease: "linear",
          repeat: 0
        }}
        className="absolute z-10 text-brand-orange"
      >
        <svg 
          width="80" 
          height="80" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M16 7c-1.5 0-3-1-4.5-1S8.5 7 7 7c-1.5 0-3-1-4.5-1S-0.5 7-2 7" className="animate-pulse" />
          <path d="M20.38 3.46L16 7a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-2.92 2.73L6 12c.67.67 1.5 1 2.5 1h7c1 0 1.83-.33 2.5-1l5.3-5.81a2 2 0 0 0-2.92-2.73z" />
          <path d="M12 13v8" />
          <path d="M8 21h8" />
        </svg>
      </motion.div>

      {/* Typing Text Animation */}
      <div className="relative z-20">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
          {text}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-1 h-10 md:h-14 bg-brand-orange ml-2 align-middle"
          />
        </h1>
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-orange/20 blur-[100px] rounded-full" />
    </motion.div>
  );
}
