import { motion } from 'motion/react';
import { BookOpen, ArrowRight, Search } from 'lucide-react';

const articles = [
  { id: 1, title: "5 Ways to Strengthen Your Iman", excerpt: "Practical steps to increase your faith in daily life...", date: "Oct 24, 2025", category: "Reminders" },
  { id: 2, title: "The Importance of Seeking Knowledge", excerpt: "Why education is a cornerstone of the Islamic faith...", date: "Oct 20, 2025", category: "Education" },
  { id: 3, title: "Etiquettes of Masjid", excerpt: "A guide on how to conduct oneself in the house of Allah...", date: "Oct 15, 2025", category: "Sunnah" },
  { id: 4, title: "Understanding the Quran", excerpt: "A beginner's guide to approaching the holy book...", date: "Oct 10, 2025", category: "Quran" },
  { id: 5, title: "The Power of Gratitude", excerpt: "How Shukr can transform your mental well-being...", date: "Oct 05, 2025", category: "Spirituality" },
  { id: 6, title: "History of Islamic Golden Age", excerpt: "Exploring the scientific contributions of early Muslims...", date: "Sep 28, 2025", category: "History" },
];

export default function Articles() {
  return (
    <div className="pt-32 pb-24 px-6 relative">
      <div className="absolute inset-0 islamic-pattern pointer-events-none opacity-10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Islamic <span className="orange-gradient-text">Articles</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Deep dive into Islamic teachings, history, and daily reminders.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-orange transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {["All", "Reminders", "Education", "Sunnah", "Quran", "History"].map((cat) => (
              <button key={cat} className="px-6 py-4 glass-card text-sm font-medium hover:bg-brand-orange hover:text-white transition-all whitespace-nowrap">
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="glass-card p-8 group flex flex-col"
            >
              <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-widest mb-4">
                <BookOpen size={14} /> {article.category}
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-orange transition-colors">{article.title}</h3>
              <p className="text-gray-400 mb-6 line-clamp-3 flex-grow">{article.excerpt}</p>
              <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-auto">
                <span className="text-xs text-gray-500">{article.date}</span>
                <button className="text-white font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Read More <ArrowRight size={14} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
