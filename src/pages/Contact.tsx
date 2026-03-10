import { motion } from 'motion/react';
import { Mail, MessageCircle, Youtube, Music2, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="pt-32 pb-24 px-6 relative">
      <div className="absolute inset-0 islamic-pattern pointer-events-none opacity-10" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Get in <span className="orange-gradient-text">Touch</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Have questions or want to collaborate? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass-card p-8 flex items-start gap-6">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-brand-orange shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Email Us</h3>
                <p className="text-gray-400 mb-4">For inquiries and support.</p>
                <a href="mailto:abdulmuizadeyemi15@gmail.com" className="text-brand-orange font-semibold hover:underline">
                  abdulmuizadeyemi15@gmail.com
                </a>
              </div>
            </div>

            <div className="glass-card p-8 flex items-start gap-6">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 shrink-0">
                <MessageCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">WhatsApp</h3>
                <p className="text-gray-400 mb-4">Quick chat and updates.</p>
                <a 
                  href="https://wa.me/2349034089737" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition-colors font-semibold"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-6">Follow Our Socials</h3>
              <div className="flex gap-4">
                <a href="https://youtube.com/@beaconofislam" target="_blank" rel="noopener noreferrer" className="btn-secondary flex-1">
                  <Youtube size={20} /> YouTube
                </a>
                <a href="https://tiktok.com/@islamic_updates2025" target="_blank" rel="noopener noreferrer" className="btn-secondary flex-1">
                  <Music2 size={20} /> TikTok
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 md:p-10"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Subject</label>
                <input type="text" placeholder="How can we help?" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Message</label>
                <textarea rows={5} placeholder="Your message here..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors resize-none"></textarea>
              </div>
              <button className="btn-primary w-full justify-center py-4">
                Send Message <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
