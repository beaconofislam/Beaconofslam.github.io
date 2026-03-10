import { motion } from 'motion/react';
import { Youtube, Music2, CheckCircle2, Bell } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-24 px-6 relative">
      <div className="absolute inset-0 islamic-pattern pointer-events-none opacity-10" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-8 text-center">About <span className="orange-gradient-text">Beacon of Islam</span></h1>
          
          <div className="glass-card p-8 md:p-12 mb-12">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Beacon of Islam is an Islamic educational platform dedicated to spreading authentic knowledge about Islam using modern technology and creative media.
            </p>
            
            <p className="text-lg text-gray-400 leading-relaxed mb-8">
              We provide Islamic animations, educational videos, Islamic articles and beneficial resources for Muslims around the world. Our goal is to make learning about Islam simple, engaging and accessible for everyone, from children to adults.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                "Authentic Islamic Knowledge",
                "High-Quality Animations",
                "Engaging Educational Content",
                "Accessible Learning Materials",
                "Modern Media Approach",
                "Global Muslim Community"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="text-brand-orange" size={20} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <p className="text-lg text-gray-400 italic border-l-4 border-brand-orange pl-6 py-2 mb-12">
              "Our goal is to make learning about Islam simple, engaging and accessible."
            </p>

            <div className="text-center">
              <p className="text-white font-semibold mb-6">
                Subscribe to our channel and follow our social media pages to continue learning and growing in Islam.
              </p>
              <div className="flex justify-center gap-4">
                <a href="https://youtube.com/@beaconofislam" target="_blank" rel="noopener noreferrer" className="btn-red">
                  <Bell size={20} className="animate-bounce" /> Subscribe
                </a>
                <a href="https://tiktok.com/@islamic_updates2025" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <Music2 size={20} /> TikTok
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
