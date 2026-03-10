import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'motion/react';
import { Link } from 'react-router-dom';
import { Youtube, Music2, Play, ArrowRight, BookOpen, Video, FileText, Users, Bell } from 'lucide-react';
import IslamicStar3D from '../components/IslamicStar3D';

function TiltCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

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
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

const animations = [
  { id: 1, title: "The Story of Prophet Yunus (AS)", thumbnail: "https://picsum.photos/seed/islam1/800/450", category: "Prophets" },
  { id: 2, title: "Understanding Salah", thumbnail: "https://picsum.photos/seed/islam2/800/450", category: "Education" },
  { id: 3, title: "The Power of Dua", thumbnail: "https://picsum.photos/seed/islam3/800/450", category: "Spirituality" },
];

const videos = [
  { id: 1, title: "Daily Reminders: Patience", thumbnail: "https://picsum.photos/seed/vid1/800/450", duration: "5:20" },
  { id: 2, title: "The Beauty of Ramadan", thumbnail: "https://picsum.photos/seed/vid2/800/450", duration: "12:45" },
  { id: 3, title: "Islamic History Explained", thumbnail: "https://picsum.photos/seed/vid3/800/450", duration: "8:15" },
  { id: 4, title: "Character of the Prophet (PBUH)", thumbnail: "https://picsum.photos/seed/vid4/800/450", duration: "10:30" },
];

const articles = [
  { id: 1, title: "5 Ways to Strengthen Your Iman", excerpt: "Practical steps to increase your faith in daily life...", date: "Oct 24, 2025" },
  { id: 2, title: "The Importance of Seeking Knowledge", excerpt: "Why education is a cornerstone of the Islamic faith...", date: "Oct 20, 2025" },
  { id: 3, title: "Etiquettes of Masjid", excerpt: "A guide on how to conduct oneself in the house of Allah...", date: "Oct 15, 2025" },
];

export default function Home() {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 200]);
  const backgroundRotate = useTransform(scrollY, [0, 1000], [0, 5]);

  return (
    <div className="relative overflow-hidden">
      {/* Background Pattern with 3D Parallax */}
      <motion.div 
        style={{ 
          y: backgroundY,
          rotateX: backgroundRotate,
          transformStyle: "preserve-3d"
        }}
        className="absolute inset-0 islamic-pattern pointer-events-none opacity-5" 
      />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tight leading-tight">
              Beacon of <span className="text-brand-orange">Islam</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              Spreading the light of Islamic knowledge through immersive 3D experiences, videos, animations and beneficial content.
            </p>
            <div className="flex flex-col sm:flex-row justify-start gap-4">
              <a href="https://youtube.com/@beaconofislam" target="_blank" rel="noopener noreferrer" className="btn-primary">
                <Youtube size={20} /> Watch on YouTube
              </a>
              <a href="https://tiktok.com/@islamic_updates2025" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <Music2 size={20} /> Follow on TikTok
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="relative"
          >
            <IslamicStar3D />
          </motion.div>
        </div>
      </section>

      {/* Section 1: Featured Animations */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Animations</h2>
              <p className="text-gray-400">Creative storytelling for all ages.</p>
            </div>
            <button className="text-brand-orange flex items-center gap-2 hover:gap-3 transition-all">
              View All <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {animations.map((item, idx) => (
              <TiltCard key={item.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card group cursor-pointer overflow-hidden h-full"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center shadow-lg">
                        <Play fill="white" size={20} className="ml-1" />
                      </div>
                    </div>
                    <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border border-white/10">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-orange transition-colors">{item.title}</h3>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Space */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="w-full h-32 bg-white/5 border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-gray-500 text-sm italic">
          Space for Google AdSense
        </div>
      </div>

      {/* Section 2: Video Library */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Video Library</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Explore our latest uploads directly from YouTube.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/10">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] font-mono">
                    {video.duration}
                  </div>
                  <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-medium text-gray-200 group-hover:text-brand-orange transition-colors line-clamp-2">{video.title}</h4>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <a href="https://youtube.com/@beaconofislam" target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex">
              Visit Channel <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Section 3: Media Library */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Islamic Media Library</h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                A curated collection of educational resources designed to deepen your understanding of Islam. Access high-quality media anytime, anywhere.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Video, label: "Islamic Movies", desc: "Cinematic stories of faith." },
                  { icon: Users, label: "Lectures", desc: "Wisdom from scholars." },
                  { icon: Play, label: "Educational Videos", desc: "Short, impactful lessons." },
                  { icon: FileText, label: "PDFs & Materials", desc: "Downloadable resources." },
                ].map((item, i) => (
                  <div key={i} className="p-6 glass-card hover:bg-white/10 transition-colors">
                    <item.icon className="text-brand-orange mb-4" size={24} />
                    <h4 className="font-bold mb-1">{item.label}</h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-10 bg-orange-600/10 blur-[100px] rounded-full" />
              <img 
                src="https://picsum.photos/seed/library/800/1000" 
                alt="Library" 
                className="rounded-3xl border border-white/10 shadow-2xl relative z-10"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Islamic Articles */}
      <section className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
            <h2 className="text-4xl font-bold">Islamic Articles</h2>
            <Link to="/articles" className="btn-secondary">Read All Articles</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <motion.article
                key={article.id}
                whileHover={{ y: -5 }}
                className="glass-card p-8 group"
              >
                <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-widest mb-4">
                  <BookOpen size={14} /> Reminders
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-orange transition-colors">{article.title}</h3>
                <p className="text-gray-400 mb-6 line-clamp-3">{article.excerpt}</p>
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <span className="text-xs text-gray-500">{article.date}</span>
                  <button className="text-white font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    Read More <ArrowRight size={14} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Community */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 blur-[80px] -ml-32 -mb-32" />
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Community</h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              "Join our mission of spreading beneficial Islamic knowledge. Subscribe to our YouTube channel and follow us on TikTok."
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/dashboard" className="btn-primary px-10">
                Go to Dashboard
              </Link>
              <a href="https://youtube.com/@beaconofislam" target="_blank" rel="noopener noreferrer" className="btn-red px-10">
                <Bell size={20} className="animate-bounce" /> Subscribe on YouTube
              </a>
              <a href="https://tiktok.com/@islamic_updates2025" target="_blank" rel="noopener noreferrer" className="btn-secondary px-10">
                Follow on TikTok
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
