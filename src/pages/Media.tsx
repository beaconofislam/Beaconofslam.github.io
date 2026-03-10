import { motion } from 'motion/react';
import { Video, Users, Play, FileText, Download, Search } from 'lucide-react';

const mediaItems = [
  { id: 1, title: "The Message (Islamic Movie)", type: "Movie", icon: Video, thumbnail: "https://picsum.photos/seed/m1/800/450" },
  { id: 2, title: "The Life of Prophet Muhammad", type: "Lecture", icon: Users, thumbnail: "https://picsum.photos/seed/m2/800/450" },
  { id: 3, title: "Guide to Hajj & Umrah", type: "PDF", icon: FileText, thumbnail: "https://picsum.photos/seed/m3/800/450" },
  { id: 4, title: "Islamic Ethics in Business", type: "Video", icon: Play, thumbnail: "https://picsum.photos/seed/m4/800/450" },
  { id: 5, title: "Omar Series: Episode 1", type: "Movie", icon: Video, thumbnail: "https://picsum.photos/seed/m5/800/450" },
  { id: 6, title: "40 Hadith of Imam Nawawi", type: "PDF", icon: FileText, thumbnail: "https://picsum.photos/seed/m6/800/450" },
];

export default function Media() {
  return (
    <div className="pt-32 pb-24 px-6 relative">
      <div className="absolute inset-0 islamic-pattern pointer-events-none opacity-10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Media <span className="orange-gradient-text">Library</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Access a wealth of Islamic movies, lectures, and educational materials.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Search media..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-orange transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {["All", "Movies", "Lectures", "Videos", "PDFs"].map((cat) => (
              <button key={cat} className="px-6 py-4 glass-card text-sm font-medium hover:bg-brand-orange hover:text-white transition-all whitespace-nowrap">
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mediaItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card group overflow-hidden"
            >
              <div className="relative aspect-video overflow-hidden">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center shadow-lg">
                    {item.type === 'PDF' ? <Download size={20} /> : <Play fill="white" size={20} className="ml-1" />}
                  </div>
                </div>
                <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border border-white/10 flex items-center gap-2">
                  <item.icon size={12} /> {item.type}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-orange transition-colors">{item.title}</h3>
                <p className="text-sm text-gray-500">Educational Resource</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
