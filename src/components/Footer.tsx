import { Link } from 'react-router-dom';
import { Youtube, Music2, Mail, MessageCircle, Home, Info, BookOpen, Library, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black/80 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold orange-gradient-text mb-4 block">
              Beacon of Islam
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Spreading the light of Islamic knowledge through modern media, animations, and authentic teachings.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://youtube.com/@beaconofislam" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-orange transition-colors">
                <Youtube size={20} />
              </a>
              <a href="https://tiktok.com/@islamic_updates2025" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-orange transition-colors">
                <Music2 size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-brand-orange transition-colors flex items-center gap-2"><Home size={14}/> Home</Link></li>
              <li><Link to="/about" className="hover:text-brand-orange transition-colors flex items-center gap-2"><Info size={14}/> About</Link></li>
              <li><Link to="/articles" className="hover:text-brand-orange transition-colors flex items-center gap-2"><BookOpen size={14}/> Articles</Link></li>
              <li><Link to="/media" className="hover:text-brand-orange transition-colors flex items-center gap-2"><Library size={14}/> Media Library</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/contact" className="hover:text-brand-orange transition-colors flex items-center gap-2"><Phone size={14}/> Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-orange transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-orange transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-brand-orange" />
                abdulmuizadeyemi15@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle size={14} className="text-brand-orange" />
                09034089737
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Beacon of Islam. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
