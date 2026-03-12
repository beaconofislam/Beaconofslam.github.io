import './index.css';
import * as THREE from 'three';
import { auth } from './firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';

// --- Toast Utility ---
type ToastType = 'success' | 'error' | 'info';

function showToast(message: string, type: ToastType = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-enter pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300 ${
    type === 'success' ? 'bg-green-500/90 border-green-400/50 text-white' :
    type === 'error' ? 'bg-red-500/90 border-red-400/50 text-white' :
    'bg-brand-orange/90 border-orange-400/50 text-white'
  }`;

  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  
  toast.innerHTML = `
    <span class="text-xl">${icon}</span>
    <p class="font-medium">${message}</p>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-full');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function getFirebaseErrorMessage(error: any): string {
  const code = error.code;
  switch (code) {
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in window was closed before completion.';
    case 'auth/cancelled-by-user':
      return 'Sign-in was cancelled.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/internal-error':
      return 'An internal error occurred. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
}

// --- Types & Constants ---
type Theme = 'light' | 'dark';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Articles', path: '/articles' },
  { name: 'Media Library', path: '/media' },
  { name: 'Contact', path: '/contact' },
  { name: 'Dashboard', path: '/dashboard' },
];

const ANIMATIONS = [
  { id: 1, title: 'The Story of Prophet Yunus (AS)', category: 'Prophet Stories', image: 'https://picsum.photos/seed/yunus/800/450' },
  { id: 2, title: 'Understanding the Five Pillars', category: 'Educational', image: 'https://picsum.photos/seed/pillars/800/450' },
  { id: 3, title: 'The Beauty of Patience (Sabr)', category: 'Character Building', image: 'https://picsum.photos/seed/sabr/800/450' },
];

const VIDEOS = [
  { id: 1, title: 'Miracles of the Quran', views: '12K views', time: '2 days ago', image: 'https://picsum.photos/seed/quran/400/225' },
  { id: 2, title: 'Life of the Prophet (SAW)', views: '45K views', time: '1 week ago', image: 'https://picsum.photos/seed/seerah/400/225' },
  { id: 3, title: 'The Power of Istighfar', views: '8K views', time: '3 days ago', image: 'https://picsum.photos/seed/dua/400/225' },
  { id: 4, title: 'Signs of the Day of Judgment', views: '102K views', time: '1 month ago', image: 'https://picsum.photos/seed/signs/400/225' },
];

const ARTICLES = [
  { id: 1, title: 'The Importance of Salah', excerpt: 'Salah is the second pillar of Islam and the most important act of worship...', date: 'Oct 12, 2025' },
  { id: 2, title: 'Understanding Zakat', excerpt: 'Zakat is a form of alms-giving treated in Islam as a religious obligation...', date: 'Oct 15, 2025' },
  { id: 3, title: 'The Concept of Halal', excerpt: 'Halal is an Arabic word that translates to "permissible" in English...', date: 'Oct 20, 2025' },
];

// --- State ---
let currentTheme: Theme = (localStorage.getItem('theme') as Theme) || 
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

let isMobileMenuOpen = false;
let currentUser: User | null = null;
let savedVideoIds: string[] = JSON.parse(localStorage.getItem('savedVideos') || '[]');

// --- DOM Elements ---
const appContent = document.getElementById('app-content')!;
const themeToggleBtn = document.getElementById('theme-toggle')!;
const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile')!;
const mobileMenuToggleBtn = document.getElementById('mobile-menu-toggle')!;
const mobileMenu = document.getElementById('mobile-menu')!;
const desktopLinks = document.getElementById('desktop-links')!;
const mobileLinks = document.getElementById('mobile-links')!;
const footerLinks = document.getElementById('footer-links')!;
const authSection = document.getElementById('auth-section')!;
const currentYearSpan = document.getElementById('current-year')!;

// --- Theme Logic ---
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  localStorage.setItem('theme', theme);
  currentTheme = theme;
  updateThemeIcons();
}

function updateThemeIcons() {
  const icon = currentTheme === 'light' ? 
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>` : 
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
  
  themeToggleBtn.innerHTML = icon;
  themeToggleMobileBtn.innerHTML = icon;
}

themeToggleBtn.addEventListener('click', () => applyTheme(currentTheme === 'light' ? 'dark' : 'light'));
themeToggleMobileBtn.addEventListener('click', () => applyTheme(currentTheme === 'light' ? 'dark' : 'light'));

// --- Mobile Menu Logic ---
function toggleMobileMenu() {
  isMobileMenuOpen = !isMobileMenuOpen;
  mobileMenu.classList.toggle('hidden', !isMobileMenuOpen);
  const menuIcon = document.getElementById('menu-icon')!;
  menuIcon.innerHTML = isMobileMenuOpen ? 
    `<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>` : 
    `<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>`;
}

mobileMenuToggleBtn.addEventListener('click', toggleMobileMenu);

// --- 3D Crescent & Star Animation ---
function initIslamicCrescent(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();

  // Crescent Shape
  const crescentShape = new THREE.Shape();
  crescentShape.absarc(0, 0, 2, Math.PI * 0.15, Math.PI * 1.85, false);
  crescentShape.absarc(0.7, 0, 1.7, Math.PI * 1.8, Math.PI * 0.2, true);
  crescentShape.closePath();

  const crescentGeometry = new THREE.ExtrudeGeometry(crescentShape, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1 });
  const material = new THREE.MeshStandardMaterial({ 
    color: 0xf97316, 
    metalness: 0.4, 
    roughness: 0.3,
    emissive: 0xf97316,
    emissiveIntensity: 0.15
  });
  const crescent = new THREE.Mesh(crescentGeometry, material);
  group.add(crescent);

  // Star Shape (5-pointed)
  const starShape = new THREE.Shape();
  const points = 5;
  const innerRadius = 0.3;
  const outerRadius = 0.75;

  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i / (points * 2)) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) starShape.moveTo(x, y);
    else starShape.lineTo(x, y);
  }
  starShape.closePath();

  const starGeometry = new THREE.ExtrudeGeometry(starShape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 });
  const star = new THREE.Mesh(starGeometry, material);
  star.position.set(1.2, 0, 0); // Position star inside the crescent opening
  group.add(star);

  scene.add(group);

  const light = new THREE.PointLight(0xffffff, 10, 100);
  light.position.set(5, 5, 5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.01;
    group.rotation.z += 0.005;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// --- Tilt Effect Logic ---
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e: any) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = (x / rect.width - 0.5) * 20;
      const yPct = (y / rect.height - 0.5) * -20;
      (card as HTMLElement).style.transform = `perspective(1000px) rotateX(${yPct}deg) rotateY(${xPct}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      (card as HTMLElement).style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    });
  });
}

// --- Scroll Reveal Logic ---
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        entry.target.classList.remove('opacity-0');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => {
    observer.observe(el);
  });
}

// --- Routing & Templates ---
const templates = {
  home: `
    <section class="pt-32 pb-24 px-6 relative overflow-hidden">
      <div class="absolute inset-0 islamic-pattern pointer-events-none opacity-10"></div>
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div class="fade-in-up">
          <h1 class="text-5xl md:text-8xl font-bold mb-6 tracking-tight leading-tight text-[#0a0a0a] dark:text-white">
            Beacon of <span class="text-orange-500">Islam</span>
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Spreading the light of Islamic knowledge through immersive 3D experiences, videos, animations and beneficial content.
          </p>
          <div class="flex flex-col sm:flex-row justify-start gap-4">
            <a href="https://youtube.com/@beaconofislam" target="_blank" rel="noopener noreferrer" class="btn-primary">
               Watch on YouTube
            </a>
            <a href="https://tiktok.com/@islamic_updates2025" target="_blank" rel="noopener noreferrer" class="btn-secondary">
               Follow on TikTok
            </a>
          </div>
        </div>
        <div id="star-container" class="h-[400px] scale-in"></div>
      </div>
    </section>

    <!-- Featured Animations -->
    <section class="py-24 px-6 reveal opacity-0">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="text-3xl font-bold mb-2 text-brand-black dark:text-white">Featured Animations</h2>
            <p class="text-gray-600 dark:text-gray-400">Creative storytelling for all ages.</p>
          </div>
          <a href="/media" class="nav-link text-orange-500 flex items-center gap-2 hover:gap-3 transition-all" data-path="/media">
            View All →
          </a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${ANIMATIONS.map(anim => `
            <div class="glass-card overflow-hidden group relative">
              <div class="aspect-video overflow-hidden relative">
                <img src="${anim.image}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <button data-video-id="anim-${anim.id}" class="save-video-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-orange-500 transition-all z-20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bookmark-icon"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                </button>
              </div>
              <div class="p-6">
                <span class="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2 block">${anim.category}</span>
                <h3 class="text-xl font-bold text-brand-black dark:text-white">${anim.title}</h3>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Video Library -->
    <section class="py-24 px-6 bg-black/5 dark:bg-white/[0.02] reveal opacity-0">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4 text-brand-black dark:text-white">Video Library</h2>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Explore our latest uploads directly from YouTube.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${VIDEOS.map(vid => `
            <div class="glass-card overflow-hidden group relative">
              <div class="relative aspect-video">
                <img src="${vid.image}" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white cursor-pointer">▶</div>
                </div>
                <button data-video-id="${vid.id}" class="save-video-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-orange-500 transition-all z-20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bookmark-icon"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                </button>
              </div>
              <div class="p-4">
                <h4 class="font-bold text-brand-black dark:text-white mb-2 line-clamp-1">${vid.title}</h4>
                <div class="flex justify-between text-xs text-gray-500">
                  <span>${vid.views}</span>
                  <span>${vid.time}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Media Library Promo -->
    <section class="py-24 px-6 reveal opacity-0">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 class="text-4xl font-bold mb-6 text-brand-black dark:text-white">Islamic Media Library</h2>
            <p class="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
              A curated collection of educational resources designed to deepen your understanding of Islam. Access high-quality media anytime, anywhere.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="glass-card p-4 flex items-center gap-4">
                <div class="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500">📖</div>
                <span class="font-semibold">Prophet Stories</span>
              </div>
              <div class="glass-card p-4 flex items-center gap-4">
                <div class="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500">🕌</div>
                <span class="font-semibold">Fiqh & Sunnah</span>
              </div>
            </div>
          </div>
          <div class="glass-card aspect-video overflow-hidden">
             <img src="https://picsum.photos/seed/library/800/450" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>

    <!-- Articles Section -->
    <section class="py-24 px-6 bg-black/5 dark:bg-white/[0.01] reveal opacity-0">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
          <h2 class="text-4xl font-bold text-brand-black dark:text-white">Islamic Articles</h2>
          <a href="/articles" class="nav-link btn-secondary" data-path="/articles">Read All Articles</a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${ARTICLES.map(art => `
            <div class="glass-card p-8 hover:border-orange-500/50 transition-colors group cursor-pointer">
              <span class="text-xs font-bold text-gray-500 mb-4 block">${art.date}</span>
              <h3 class="text-2xl font-bold mb-4 text-brand-black dark:text-white group-hover:text-orange-500 transition-colors">${art.title}</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">${art.excerpt}</p>
              <div class="flex items-center gap-2 text-orange-500 font-bold text-sm">
                Read Article →
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="py-24 px-6">
      <div class="max-w-5xl mx-auto">
        <div class="glass-card p-12 md:p-20 text-center relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] -mr-32 -mt-32"></div>
          <div class="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 blur-[80px] -ml-32 -mb-32"></div>
          <h2 class="text-4xl md:text-5xl font-bold mb-6 text-[#0a0a0a] dark:text-white">Join Our Community</h2>
          <p class="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            "Join our mission of spreading beneficial Islamic knowledge. Subscribe to our YouTube channel and follow us on TikTok."
          </p>
          <div class="flex flex-wrap justify-center gap-6">
            <a href="/dashboard" class="nav-link btn-primary px-10" data-path="/dashboard">Go to Dashboard</a>
            <a href="https://youtube.com/@beaconofislam" target="_blank" rel="noopener noreferrer" class="btn-red px-10">
              <span class="bell-bounce">🔔</span> Subscribe on YouTube
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  articles: `
    <div class="pt-32 pb-24 px-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl font-bold mb-12 text-brand-black dark:text-white">Islamic Articles</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${ARTICLES.map(art => `
            <div class="glass-card p-8">
              <h3 class="text-2xl font-bold mb-4 text-brand-black dark:text-white">${art.title}</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">${art.excerpt}</p>
              <button class="btn-secondary text-sm">Read More</button>
            </div>
          `).join('')}
          <div class="glass-card p-8">
            <h3 class="text-2xl font-bold mb-4 text-brand-black dark:text-white">The Power of Dua</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">Dua is the essence of worship. It is a direct link between the Creator and the created...</p>
            <button class="btn-secondary text-sm">Read More</button>
          </div>
        </div>
      </div>
    </div>
  `,
  media: `
    <div class="pt-32 pb-24 px-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl font-bold mb-12 text-brand-black dark:text-white">Media Library</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${VIDEOS.map(vid => `
            <div class="glass-card overflow-hidden relative group">
              <div class="relative aspect-video">
                <img src="${vid.image}" class="w-full h-full object-cover" />
                <button data-video-id="${vid.id}" class="save-video-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-orange-500 transition-all z-20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bookmark-icon"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                </button>
              </div>
              <div class="p-4">
                <h4 class="font-bold text-brand-black dark:text-white">${vid.title}</h4>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `,
  dashboard: `
    <div class="pt-32 pb-24 px-6 relative">
      <div class="absolute inset-0 islamic-pattern pointer-events-none opacity-10"></div>
      <div class="max-w-7xl mx-auto relative z-10">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div class="flex items-center gap-6">
            <div class="relative">
              <div class="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full blur opacity-75 animate-pulse"></div>
              <img id="user-avatar" src="https://picsum.photos/seed/user123/200/200" class="relative w-24 h-24 rounded-full border-2 border-white/10 object-cover" />
              <div class="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-brand-black rounded-full"></div>
            </div>
            <div>
              <h1 id="user-name" class="text-3xl font-bold text-brand-black dark:text-white">Guest User</h1>
              <p id="user-email" class="text-gray-600 dark:text-gray-400">Please sign in to track progress</p>
            </div>
          </div>
          <div class="flex gap-4">
            <button id="edit-profile-btn" class="btn-secondary py-2 px-4 text-sm">Edit Profile</button>
            <button id="logout-btn" class="bg-red-500/10 text-red-500 border border-red-500/20 py-2 px-4 rounded-full text-sm font-semibold hover:bg-red-500 hover:text-white transition-all">Logout</button>
          </div>
        </div>

        <!-- Edit Profile Modal -->
        <div id="edit-profile-modal" class="hidden fixed inset-0 z-[60] flex items-center justify-center px-6">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="modal-overlay"></div>
          <div class="glass-card max-w-md w-full p-8 relative z-10 border-white/20 fade-in-up">
            <h2 class="text-2xl font-bold mb-6 text-brand-black dark:text-white">Edit Profile</h2>
            <form id="edit-profile-form" class="space-y-6">
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Display Name</label>
                <input id="edit-display-name" type="text" class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-4 py-3 text-brand-black dark:text-white focus:border-orange-500 outline-none transition-colors" placeholder="Your Name" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Profile Picture URL</label>
                <input id="edit-photo-url" type="url" class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-4 py-3 text-brand-black dark:text-white focus:border-orange-500 outline-none transition-colors" placeholder="https://example.com/photo.jpg" />
              </div>
              <div class="flex gap-4 pt-4">
                <button type="button" id="close-modal-btn" class="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" class="btn-primary flex-1 justify-center">Save Changes</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div class="tilt-card glass-card p-6">
            <div class="flex justify-between items-start mb-4">
              <div class="p-3 rounded-xl bg-blue-400/10 text-blue-400">📹</div>
              <span class="text-xs font-bold text-blue-400">16%</span>
            </div>
            <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Videos Watched</h3>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-brand-black dark:text-white">24</span>
              <span class="text-gray-500 text-sm">/ 150</span>
            </div>
            <div class="mt-4 w-full h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
              <div class="h-full bg-blue-500 w-[16%]"></div>
            </div>
          </div>
          <div class="tilt-card glass-card p-6">
            <div class="flex justify-between items-start mb-4">
              <div class="p-3 rounded-xl bg-orange-400/10 text-orange-400">📖</div>
              <span class="text-xs font-bold text-orange-400">27%</span>
            </div>
            <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Articles Read</h3>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-brand-black dark:text-white">12</span>
              <span class="text-gray-500 text-sm">/ 45</span>
            </div>
            <div class="mt-4 w-full h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
              <div class="h-full bg-orange-500 w-[27%]"></div>
            </div>
          </div>
          <div class="tilt-card glass-card p-6">
            <div class="flex justify-between items-start mb-4">
              <div class="p-3 rounded-xl bg-green-400/10 text-green-400">🕒</div>
            </div>
            <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Total Learning Time</h3>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-brand-black dark:text-white">18h 45m</span>
            </div>
          </div>
          <div class="tilt-card glass-card p-6">
            <div class="flex justify-between items-start mb-4">
              <div class="p-3 rounded-xl bg-purple-400/10 text-purple-400">🔥</div>
            </div>
            <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Current Streak</h3>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-brand-black dark:text-white">5 Days</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-12">
            <div>
              <h2 class="text-2xl font-bold mb-6 text-brand-black dark:text-white">Saved Videos</h2>
              <div id="saved-videos-container" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="col-span-full py-12 text-center glass-card">
                  <p class="text-gray-500">No saved videos yet. Explore the media library to save some!</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 class="text-2xl font-bold mb-6 text-brand-black dark:text-white">Recent Activity</h2>
              <div class="space-y-4">
              <div class="glass-card p-4 flex items-center gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <div class="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">▶</div>
                <div class="flex-grow">
                  <h4 class="font-semibold text-brand-black dark:text-white">The Story of Prophet Yunus (AS)</h4>
                  <p class="text-xs text-gray-500">2 hours ago • Completed</p>
                </div>
                <span class="text-green-500">✓</span>
              </div>
              <div class="glass-card p-4 flex items-center gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <div class="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">📖</div>
                <div class="flex-grow">
                  <h4 class="font-semibold text-brand-black dark:text-white">5 Ways to Strengthen Your Iman</h4>
                  <p class="text-xs text-gray-500">Yesterday • Completed</p>
                </div>
                <span class="text-green-500">✓</span>
              </div>
            </div>
          </div>
          <div class="space-y-8">
            <div>
              <h2 class="text-2xl font-bold mb-6 text-brand-black dark:text-white">Achievements</h2>
              <div class="glass-card p-6 text-center">
                <div class="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center text-brand-orange mx-auto mb-4 relative">
                  🏆
                  <div class="absolute -top-1 -right-1 w-6 h-6 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-brand-black">LV 4</div>
                </div>
                <h3 class="font-bold text-lg text-brand-black dark:text-white">Knowledge Seeker</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-6">You've completed 5 days in a row!</p>
                <div class="w-full h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                  <div class="h-full bg-brand-orange w-[75%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  about: `
    <div class="pt-32 pb-24 px-6 relative">
      <div class="absolute inset-0 islamic-pattern pointer-events-none opacity-10"></div>
      <div class="max-w-4xl mx-auto relative z-10 fade-in-up">
        <h1 class="text-5xl font-bold mb-8 text-center text-brand-black dark:text-white">About <span class="orange-gradient-text">Beacon of Islam</span></h1>
        <div class="glass-card p-8 md:p-12 mb-12">
          <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            Beacon of Islam is an Islamic educational platform dedicated to spreading authentic knowledge about Islam using modern technology and creative media.
          </p>
          <p class="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
            We provide Islamic animations, educational videos, Islamic articles and beneficial resources for Muslims around the world.
          </p>
          <div class="text-center">
            <a href="https://youtube.com/@beaconofislam" target="_blank" rel="noopener noreferrer" class="btn-red inline-flex">
              <span class="bell-bounce">🔔</span> Subscribe
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  contact: `
    <div class="pt-40 pb-24 px-6 relative overflow-hidden">
      <div class="absolute inset-0 islamic-pattern pointer-events-none opacity-10"></div>
      <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full"></div>

      <div class="max-w-7xl mx-auto relative z-10 fade-in-up">
        <div class="text-center mb-16">
          <h1 class="text-5xl font-bold mb-4 text-brand-black dark:text-white">Get in <span class="orange-gradient-text">Touch</span></h1>
          <p class="text-gray-500 max-w-2xl mx-auto">Have questions or want to contribute? We'd love to hear from you. Our team is here to support your journey.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Contact Info -->
          <div class="space-y-6">
            <div class="glass-card p-8 border-white/10">
              <div class="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-6 text-2xl">✉️</div>
              <h3 class="text-xl font-bold mb-2 text-brand-black dark:text-white">Email Us</h3>
              <p class="text-gray-500 text-sm mb-4">Our friendly team is here to help.</p>
              <a href="mailto:abdulmuizadeyemi15@gmail.com" class="text-orange-500 font-bold hover:underline">abdulmuizadeyemi15@gmail.com</a>
            </div>

            <div class="glass-card p-8 border-white/10">
              <div class="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-6 text-2xl">📱</div>
              <h3 class="text-xl font-bold mb-2 text-brand-black dark:text-white">Social Media</h3>
              <p class="text-gray-500 text-sm mb-6">Follow us for daily Islamic updates and animations.</p>
              <div class="flex gap-4">
                <a href="https://youtube.com/@beaconofislam" target="_blank" class="w-10 h-10 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">YT</a>
                <a href="https://tiktok.com/@islamic_updates2025" target="_blank" class="w-10 h-10 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">TK</a>
              </div>
            </div>

            <div class="glass-card p-8 border-white/10">
              <div class="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-6 text-2xl">💬</div>
              <h3 class="text-xl font-bold mb-2 text-brand-black dark:text-white">WhatsApp</h3>
              <p class="text-gray-500 text-sm mb-4">Chat with us directly for quick support and inquiries.</p>
              <a href="https://wa.me/2349034089737" target="_blank" class="text-green-500 font-bold hover:underline flex items-center gap-2">
                <span>Message us</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="lg:col-span-2">
            <div class="glass-card p-10 border-white/20">
              <form class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                  <label class="block text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                    <input type="text" class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-brand-black dark:text-white focus:border-orange-500 outline-none transition-colors" placeholder="Abdul Muiz" />
                  </div>
                </div>
                
                <div class="space-y-2">
                  <label class="block text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                    <input type="email" class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-brand-black dark:text-white focus:border-orange-500 outline-none transition-colors" placeholder="name@example.com" />
                  </div>
                </div>

                <div class="md:col-span-2 space-y-2">
                  <label class="block text-xs font-bold uppercase tracking-widest text-gray-500">Subject</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📝</span>
                    <input type="text" class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-brand-black dark:text-white focus:border-orange-500 outline-none transition-colors" placeholder="How can we help?" />
                  </div>
                </div>

                <div class="md:col-span-2 space-y-2">
                  <label class="block text-xs font-bold uppercase tracking-widest text-gray-500">Message</label>
                  <textarea class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 text-brand-black dark:text-white focus:border-orange-500 outline-none transition-colors h-40" placeholder="Tell us more about your inquiry..."></textarea>
                </div>

                <div class="md:col-span-2">
                  <button type="submit" class="btn-primary w-full justify-center py-4 text-lg shadow-orange-500/40">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  login: `
    <div class="pt-40 pb-24 px-6 flex items-center justify-center min-h-screen relative overflow-hidden">
      <div class="absolute inset-0 islamic-pattern pointer-events-none opacity-10"></div>
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full"></div>
      
      <div class="max-w-md w-full relative z-10 fade-in-up">
        <div class="glass-card p-10 border-white/20">
          <div class="text-center mb-10">
            <h1 class="text-4xl font-bold mb-3 text-brand-black dark:text-white">Welcome Back</h1>
            <p class="text-gray-500 text-sm">Continue your journey of knowledge</p>
          </div>

          <form id="login-form" class="space-y-6">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Email Address</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                <input id="login-email" type="email" required class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-brand-black dark:text-white focus:border-orange-500 outline-none transition-colors" placeholder="name@example.com" />
              </div>
            </div>
            
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Password</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                <input id="login-password" type="password" required class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl pl-12 pr-12 py-4 text-brand-black dark:text-white focus:border-orange-500 outline-none transition-colors" placeholder="••••••••" />
                <button type="button" id="toggle-login-password" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-icon"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between text-sm">
              <label class="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                <span class="text-gray-500 group-hover:text-brand-black dark:group-hover:text-white transition-colors">Remember me</span>
              </label>
              <a href="/forgot-password" class="nav-link text-orange-500 font-semibold hover:underline" data-path="/forgot-password">Forgot password?</a>
            </div>

            <button type="submit" class="btn-primary w-full justify-center py-4 text-lg shadow-orange-500/40">
              Sign In
            </button>
          </form>

          <div class="relative my-10">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-black/10 dark:border-white/10"></div></div>
            <div class="relative flex justify-center text-xs uppercase"><span class="bg-white dark:bg-[#121212] px-4 text-gray-500 font-bold tracking-widest">Or continue with</span></div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <button id="google-login" class="btn-secondary py-3 flex items-center justify-center gap-2 text-sm">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-4 h-4" /> Google
            </button>
            <button id="facebook-login" class="btn-secondary py-3 flex items-center justify-center gap-2 text-sm">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" class="w-4 h-4" /> Facebook
            </button>
          </div>

          <p class="mt-10 text-center text-sm text-gray-500">
            Don't have an account? 
            <a href="/signup" class="nav-link text-orange-500 font-bold hover:underline" data-path="/signup">Create account</a>
          </p>
        </div>
      </div>
    </div>
  `,
  signup: `
    <div class="pt-40 pb-24 px-6 flex items-center justify-center min-h-screen relative overflow-hidden">
      <div class="absolute inset-0 islamic-pattern pointer-events-none opacity-10"></div>
      <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full"></div>
      
      <div class="max-w-md w-full relative z-10 fade-in-up">
        <div class="glass-card p-10 border-white/20">
          <div class="text-center mb-10">
            <h1 class="text-4xl font-bold mb-3 text-brand-black dark:text-white">Join Us</h1>
            <p class="text-gray-500 text-sm">Start your journey of Islamic knowledge</p>
          </div>

          <form id="signup-form" class="space-y-6">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Full Name</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                <input id="signup-name" type="text" required class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-brand-black dark:text-white focus:border-orange-500 outline-none transition-colors" placeholder="Abdul Muiz" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Email Address</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                <input id="signup-email" type="email" required class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-brand-black dark:text-white focus:border-orange-500 outline-none transition-colors" placeholder="name@example.com" />
              </div>
            </div>
            
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Password</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                <input id="signup-password" type="password" required class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl pl-12 pr-12 py-4 text-brand-black dark:text-white focus:border-orange-500 outline-none transition-colors" placeholder="••••••••" />
                <button type="button" id="toggle-signup-password" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-icon"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            <div class="flex items-start gap-2 text-sm">
              <input type="checkbox" required class="mt-1 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
              <span class="text-gray-500">I agree to the <a href="/terms" class="nav-link text-orange-500 font-bold" data-path="/terms">Terms of Service</a> and <a href="/privacy" class="nav-link text-orange-500 font-bold" data-path="/privacy">Privacy Policy</a></span>
            </div>

            <button type="submit" class="btn-primary w-full justify-center py-4 text-lg shadow-orange-500/40">
              Create Account
            </button>
          </form>

          <div class="relative my-10">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-black/10 dark:border-white/10"></div></div>
            <div class="relative flex justify-center text-xs uppercase"><span class="bg-white dark:bg-[#121212] px-4 text-gray-500 font-bold tracking-widest">Or join with</span></div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <button id="google-signup" class="btn-secondary py-3 flex items-center justify-center gap-2 text-sm">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-4 h-4" /> Google
            </button>
            <button id="facebook-signup" class="btn-secondary py-3 flex items-center justify-center gap-2 text-sm">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" class="w-4 h-4" /> Facebook
            </button>
          </div>

          <p class="mt-10 text-center text-sm text-gray-500">
            Already have an account? 
            <a href="/login" class="nav-link text-orange-500 font-bold hover:underline" data-path="/login">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  `,
  'forgot-password': `
    <div class="pt-40 pb-24 px-6 flex items-center justify-center min-h-screen relative overflow-hidden">
      <div class="absolute inset-0 islamic-pattern pointer-events-none opacity-10"></div>
      <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full"></div>
      
      <div class="max-w-md w-full relative z-10 fade-in-up">
        <div class="glass-card p-10 border-white/20">
          <div class="text-center mb-10">
            <h1 class="text-4xl font-bold mb-3 text-brand-black dark:text-white">Reset Password</h1>
            <p class="text-gray-500 text-sm">Enter your email and we'll send you a link to reset your password.</p>
          </div>

          <form id="forgot-password-form" class="space-y-6">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Email Address</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                <input id="reset-email" type="email" required class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-brand-black dark:text-white focus:border-orange-500 outline-none transition-colors" placeholder="name@example.com" />
              </div>
            </div>

            <button type="submit" class="btn-primary w-full justify-center py-4 text-lg shadow-orange-500/40">
              Send Reset Link
            </button>
          </form>

          <p class="mt-10 text-center text-sm text-gray-500">
            Remember your password? 
            <a href="/login" class="nav-link text-orange-500 font-bold hover:underline" data-path="/login">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  `,
  privacy: `
    <div class="pt-32 pb-24 px-6 relative overflow-hidden">
      <div class="absolute inset-0 islamic-pattern pointer-events-none opacity-10"></div>
      <div class="max-w-4xl mx-auto relative z-10 fade-in-up">
        <h1 class="text-5xl font-bold mb-8 text-center text-brand-black dark:text-white">Privacy <span class="orange-gradient-text">Policy</span></h1>
        
        <div class="glass-card p-8 md:p-12 space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 class="text-2xl font-bold mb-4 text-brand-black dark:text-white">1. Introduction</h2>
            <p>Welcome to Beacon of Islam. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
          </section>

          <section>
            <h2 class="text-2xl font-bold mb-4 text-brand-black dark:text-white">2. Information We Collect</h2>
            <p>We collect personal information that you voluntarily provide to us when registering at the App, expressing an interest in obtaining information about us or our products and services, when participating in activities on the App or otherwise contacting us.</p>
            <ul class="list-disc pl-6 mt-4 space-y-2">
              <li>Name and Contact Data (Email address, etc.)</li>
              <li>Credentials (Passwords and similar security information)</li>
              <li>Social Media Login Data</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold mb-4 text-brand-black dark:text-white">3. How We Use Your Information</h2>
            <p>We use personal information collected via our App for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
            <ul class="list-disc pl-6 mt-4 space-y-2">
              <li>To facilitate account creation and logon process.</li>
              <li>To send you marketing and promotional communications.</li>
              <li>To fulfill and manage your orders.</li>
              <li>To post testimonials with your consent.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold mb-4 text-brand-black dark:text-white">4. Data Security</h2>
            <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.</p>
          </section>

          <section>
            <h2 class="text-2xl font-bold mb-4 text-brand-black dark:text-white">5. Contact Us</h2>
            <p>If you have questions or comments about this policy, you may email us at <strong>abdulmuizadeyemi15@gmail.com</strong>.</p>
          </section>

          <div class="pt-8 border-t border-black/10 dark:border-white/10 text-sm text-gray-500">
            Last updated: March 11, 2026
          </div>
        </div>
      </div>
    </div>
  `,
  terms: `
    <div class="pt-32 pb-24 px-6 relative overflow-hidden">
      <div class="absolute inset-0 islamic-pattern pointer-events-none opacity-10"></div>
      <div class="max-w-4xl mx-auto relative z-10 fade-in-up">
        <h1 class="text-5xl font-bold mb-8 text-center text-brand-black dark:text-white">Terms of <span class="orange-gradient-text">Service</span></h1>
        
        <div class="glass-card p-8 md:p-12 space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 class="text-2xl font-bold mb-4 text-brand-black dark:text-white">1. Agreement to Terms</h2>
            <p>By accessing or using Beacon of Islam, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, then you may not access the service.</p>
          </section>

          <section>
            <h2 class="text-2xl font-bold mb-4 text-brand-black dark:text-white">2. Intellectual Property</h2>
            <p>The service and its original content, features, and functionality are and will remain the exclusive property of Beacon of Islam and its licensors.</p>
          </section>

          <section>
            <h2 class="text-2xl font-bold mb-4 text-brand-black dark:text-white">3. User Conduct</h2>
            <p>You agree not to use the service for any purpose that is illegal or prohibited by these Terms. You are responsible for all your activity in connection with the service.</p>
          </section>

          <div class="pt-8 border-t border-black/10 dark:border-white/10 text-sm text-gray-500">
            Last updated: March 11, 2026
          </div>
        </div>
      </div>
    </div>
  `,
  search: `
    <div class="pt-32 pb-24 px-6 relative overflow-hidden">
      <div class="absolute inset-0 islamic-pattern pointer-events-none opacity-10"></div>
      <div class="max-w-7xl mx-auto relative z-10">
        <div class="mb-12">
          <h1 class="text-4xl font-bold mb-4 text-brand-black dark:text-white">Search Results</h1>
          <p id="search-query-display" class="text-gray-500">Showing results for "<span id="query-text" class="text-orange-500 font-bold"></span>"</p>
        </div>

        <div id="search-results-container" class="space-y-16">
          <!-- Results will be injected here -->
        </div>

        <div id="no-results" class="hidden text-center py-24">
          <div class="text-6xl mb-6">🔍</div>
          <h2 class="text-2xl font-bold mb-2 text-brand-black dark:text-white">No results found</h2>
          <p class="text-gray-500">Try searching for something else, like "Prophet" or "Salah".</p>
        </div>
      </div>
    </div>
  `,
  notFound: `
    <div class="pt-32 pb-24 px-6 text-center">
      <h1 class="text-6xl font-bold mb-4 text-brand-black dark:text-white">404</h1>
      <p class="text-xl text-gray-500 mb-8">Page not found</p>
      <a href="/" class="nav-link btn-primary inline-flex" data-path="/">Go Home</a>
    </div>
  `
};

function renderRoute(path: string) {
  window.scrollTo(0, 0);
  isMobileMenuOpen = false;
  mobileMenu.classList.add('hidden');

  // Add fade-out effect
  appContent.classList.add('opacity-0');
  
  setTimeout(() => {
    if (path === '/' || path === '') {
      appContent.innerHTML = templates.home;
      initIslamicCrescent('star-container');
      initScrollReveal();
      initSaveButtons();
    } else if (path === '/about') {
      appContent.innerHTML = templates.about;
    } else if (path === '/articles') {
      appContent.innerHTML = templates.articles;
    } else if (path === '/media') {
      appContent.innerHTML = templates.media;
      initSaveButtons();
    } else if (path === '/contact') {
      appContent.innerHTML = templates.contact;
    } else if (path === '/dashboard') {
      appContent.innerHTML = templates.dashboard;
      initTiltCards();
      updateDashboardUI();
    } else if (path === '/login') {
      if (currentUser) {
        window.history.pushState({}, '', '/dashboard');
        renderRoute('/dashboard');
        return;
      }
      appContent.innerHTML = templates.login;
      initAuthForms();
    } else if (path === '/signup') {
      if (currentUser) {
        window.history.pushState({}, '', '/dashboard');
        renderRoute('/dashboard');
        return;
      }
      appContent.innerHTML = templates.signup;
      initAuthForms();
    } else if (path === '/forgot-password') {
      appContent.innerHTML = templates['forgot-password'];
      initAuthForms();
    } else if (path === '/privacy') {
      appContent.innerHTML = templates.privacy;
    } else if (path === '/terms') {
      appContent.innerHTML = templates.terms;
    } else if (path.startsWith('/search')) {
      appContent.innerHTML = templates.search;
      handleSearchPage();
    } else {
      appContent.innerHTML = templates.notFound;
    }

    // Remove fade-out effect
    appContent.classList.remove('opacity-0');
    appContent.classList.add('transition-opacity', 'duration-500');
  }, 100);

  updateActiveLinks(path);
}

function updateActiveLinks(path: string) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPath = link.getAttribute('data-path');
    if (linkPath === path) {
      link.classList.add('text-orange-500');
      link.classList.remove('text-gray-600', 'dark:text-gray-300', 'text-white');
    } else {
      link.classList.remove('text-orange-500');
      if (link.classList.contains('desktop-link')) {
        link.classList.add('text-gray-600', 'dark:text-gray-300');
      }
    }
  });
}

function updateDashboardUI() {
  const userName = document.getElementById('user-name');
  const userEmail = document.getElementById('user-email');
  const userAvatar = document.getElementById('user-avatar') as HTMLImageElement;
  const logoutBtn = document.getElementById('logout-btn');
  const editProfileBtn = document.getElementById('edit-profile-btn');
  const editProfileModal = document.getElementById('edit-profile-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalOverlay = document.getElementById('modal-overlay');
  const editProfileForm = document.getElementById('edit-profile-form') as HTMLFormElement;

  if (currentUser) {
    if (userName) userName.textContent = currentUser.displayName || 'User';
    if (userEmail) userEmail.textContent = currentUser.email || '';
    if (userAvatar) {
      userAvatar.src = currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'User')}&background=f97316&color=fff`;
    }
    
    if (logoutBtn && auth) {
      logoutBtn.addEventListener('click', async () => {
        try {
          await signOut(auth);
          showToast('Logged out successfully', 'info');
          window.history.pushState({}, '', '/login');
          renderRoute('/login');
        } catch (error) {
          console.error('Logout error:', error);
        }
      });
    }

    // Modal Logic
    if (editProfileBtn && editProfileModal) {
      editProfileBtn.addEventListener('click', () => {
        editProfileModal.classList.remove('hidden');
        const nameInput = document.getElementById('edit-display-name') as HTMLInputElement;
        const photoInput = document.getElementById('edit-photo-url') as HTMLInputElement;
        if (nameInput) nameInput.value = currentUser?.displayName || '';
        if (photoInput) photoInput.value = currentUser?.photoURL || '';
      });
    }

    const closeModal = () => {
      if (editProfileModal) editProfileModal.classList.add('hidden');
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    if (editProfileForm) {
      editProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!auth || !currentUser) return;

        const newName = (document.getElementById('edit-display-name') as HTMLInputElement).value;
        const newPhoto = (document.getElementById('edit-photo-url') as HTMLInputElement).value;

        try {
          await updateProfile(currentUser, {
            displayName: newName,
            photoURL: newPhoto
          });
          showToast('Profile updated successfully!', 'success');
          closeModal();
          updateDashboardUI(); // Refresh UI
        } catch (error: any) {
          showToast(getFirebaseErrorMessage(error), 'error');
        }
      });
    }

    renderSavedVideos();
  } else {
    // Redirect to login if not authenticated and trying to access dashboard
    if (window.location.pathname === '/dashboard') {
      window.history.pushState({}, '', '/login');
      renderRoute('/login');
    }
  }
}

function renderSavedVideos() {
  const container = document.getElementById('saved-videos-container');
  if (!container) return;

  const savedItems = [
    ...VIDEOS.map(v => ({ ...v, id: v.id.toString(), type: 'video' })),
    ...ANIMATIONS.map(a => ({ ...a, id: `anim-${a.id}`, type: 'animation' }))
  ].filter(item => savedVideoIds.includes(item.id));

  if (savedItems.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center glass-card">
        <p class="text-gray-500">No saved items yet. Explore the library to save some!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = savedItems.map(item => `
    <div class="glass-card overflow-hidden group relative">
      <div class="relative aspect-video">
        <img src="${item.image}" class="w-full h-full object-cover" />
        <button data-video-id="${item.id}" class="save-video-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-orange-500 border border-white/10 flex items-center justify-center text-white transition-all z-20">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bookmark-icon"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
        </button>
      </div>
      <div class="p-4">
        <h4 class="font-bold text-brand-black dark:text-white mb-1 line-clamp-1">${item.title}</h4>
        <p class="text-xs text-gray-500">${item.type === 'video' ? (item as any).views + ' • ' + (item as any).time : (item as any).category}</p>
      </div>
    </div>
  `).join('');

  initSaveButtons();
}

function initSaveButtons() {
  const buttons = document.querySelectorAll('.save-video-btn');
  buttons.forEach(btn => {
    const videoId = btn.getAttribute('data-video-id') || '';
    
    const icon = btn.querySelector('svg');
    if (savedVideoIds.includes(videoId)) {
      btn.classList.add('bg-orange-500');
      btn.classList.remove('bg-black/20');
      if (icon) icon.setAttribute('fill', 'currentColor');
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!currentUser) {
        showToast('Please login to save content', 'info');
        window.history.pushState({}, '', '/login');
        renderRoute('/login');
        return;
      }
      toggleSaveVideo(videoId);
      
      if (savedVideoIds.includes(videoId)) {
        btn.classList.add('bg-orange-500');
        btn.classList.remove('bg-black/20');
        if (icon) icon.setAttribute('fill', 'currentColor');
      } else {
        btn.classList.remove('bg-orange-500');
        btn.classList.add('bg-black/20');
        if (icon) icon.setAttribute('fill', 'none');
      }

      if (window.location.pathname === '/dashboard') {
        renderSavedVideos();
      }
    });
  });
}

function toggleSaveVideo(videoId: string) {
  const index = savedVideoIds.indexOf(videoId);
  if (index === -1) {
    savedVideoIds.push(videoId);
    showToast('Saved to dashboard', 'success');
  } else {
    savedVideoIds.splice(index, 1);
    showToast('Removed from dashboard', 'info');
  }
  localStorage.setItem('savedVideos', JSON.stringify(savedVideoIds));
}

function initAuthForms() {
  const loginForm = document.getElementById('login-form') as HTMLFormElement;
  const signupForm = document.getElementById('signup-form') as HTMLFormElement;
  const forgotPasswordForm = document.getElementById('forgot-password-form') as HTMLFormElement;
  const googleLogin = document.getElementById('google-login');
  const googleSignup = document.getElementById('google-signup');
  const facebookLogin = document.getElementById('facebook-login');
  const facebookSignup = document.getElementById('facebook-signup');

  // Password Toggle Logic
  const setupPasswordToggle = (toggleId: string, inputId: string) => {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (toggle && input) {
      toggle.addEventListener('click', () => {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        toggle.innerHTML = isPassword 
          ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-off-icon"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-icon"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
      });
    }
  };

  setupPasswordToggle('toggle-login-password', 'login-password');
  setupPasswordToggle('toggle-signup-password', 'signup-password');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!auth) {
        showToast('Authentication is not configured. Please set your Firebase API keys in the Settings menu.', 'error');
        return;
      }
      const submitBtn = loginForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Signing In...';

      const email = (document.getElementById('login-email') as HTMLInputElement).value;
      const password = (document.getElementById('login-password') as HTMLInputElement).value;
      try {
        await signInWithEmailAndPassword(auth, email, password);
        showToast('Welcome back!', 'success');
        window.history.pushState({}, '', '/dashboard');
        renderRoute('/dashboard');
      } catch (error: any) {
        showToast(getFirebaseErrorMessage(error), 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!auth) {
        showToast('Authentication is not configured. Please set your Firebase API keys in the Settings menu.', 'error');
        return;
      }
      const submitBtn = signupForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Creating Account...';

      const name = (document.getElementById('signup-name') as HTMLInputElement).value;
      const email = (document.getElementById('signup-email') as HTMLInputElement).value;
      const password = (document.getElementById('signup-password') as HTMLInputElement).value;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        showToast('Account created successfully!', 'success');
        window.history.pushState({}, '', '/dashboard');
        renderRoute('/dashboard');
      } catch (error: any) {
        showToast(getFirebaseErrorMessage(error), 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!auth) {
        showToast('Authentication is not configured. Please set your Firebase API keys in the Settings menu.', 'error');
        return;
      }
      const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Sending...';

      const email = (document.getElementById('reset-email') as HTMLInputElement).value;
      try {
        await sendPasswordResetEmail(auth, email);
        showToast('Password reset email sent! Please check your inbox.', 'success');
        window.history.pushState({}, '', '/login');
        renderRoute('/login');
      } catch (error: any) {
        showToast(getFirebaseErrorMessage(error), 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  const handleGoogleAuth = async () => {
    if (!auth) {
      showToast('Authentication is not configured. Please set your Firebase API keys in the Settings menu.', 'error');
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      showToast('Signed in with Google!', 'success');
      window.history.pushState({}, '', '/dashboard');
      renderRoute('/dashboard');
    } catch (error: any) {
      showToast(getFirebaseErrorMessage(error), 'error');
    }
  };

  if (googleLogin) googleLogin.addEventListener('click', handleGoogleAuth);
  if (googleSignup) googleSignup.addEventListener('click', handleGoogleAuth);

  const handleFacebookAuth = async () => {
    if (!auth) {
      showToast('Authentication is not configured. Please set your Firebase API keys in the Settings menu.', 'error');
      return;
    }
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      showToast('Signed in with Facebook!', 'success');
      window.history.pushState({}, '', '/dashboard');
      renderRoute('/dashboard');
    } catch (error: any) {
      showToast(getFirebaseErrorMessage(error), 'error');
    }
  };

  if (facebookLogin) facebookLogin.addEventListener('click', handleFacebookAuth);
  if (facebookSignup) facebookSignup.addEventListener('click', handleFacebookAuth);
}

function handleSearchPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q') || '';
  const queryText = document.getElementById('query-text');
  const resultsContainer = document.getElementById('search-results-container');
  const noResults = document.getElementById('no-results');

  if (queryText) queryText.textContent = query;
  if (!resultsContainer || !noResults) return;

  resultsContainer.innerHTML = '';
  
  if (!query.trim()) {
    noResults.classList.remove('hidden');
    return;
  }

  const filteredAnimations = ANIMATIONS.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) || 
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredVideos = VIDEOS.filter(v => 
    v.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredArticles = ARTICLES.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) || 
    a.excerpt.toLowerCase().includes(query.toLowerCase())
  );

  let hasResults = false;

  if (filteredAnimations.length > 0) {
    hasResults = true;
    resultsContainer.innerHTML += `
      <div>
        <h2 class="text-2xl font-bold mb-8 flex items-center gap-3 text-brand-black dark:text-white">
          <span class="w-2 h-8 bg-orange-500 rounded-full"></span> Animations
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${filteredAnimations.map(anim => `
            <div class="glass-card overflow-hidden group cursor-pointer">
              <div class="aspect-video overflow-hidden">
                <img src="${anim.image}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div class="p-6">
                <span class="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2 block">${anim.category}</span>
                <h3 class="text-xl font-bold text-brand-black dark:text-white">${anim.title}</h3>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (filteredVideos.length > 0) {
    hasResults = true;
    resultsContainer.innerHTML += `
      <div>
        <h2 class="text-2xl font-bold mb-8 flex items-center gap-3 text-brand-black dark:text-white">
          <span class="w-2 h-8 bg-orange-500 rounded-full"></span> Videos
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${filteredVideos.map(vid => `
            <div class="glass-card overflow-hidden group cursor-pointer">
              <div class="relative aspect-video">
                <img src="${vid.image}" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white">▶</div>
                </div>
              </div>
              <div class="p-4">
                <h4 class="font-bold text-brand-black dark:text-white mb-2 line-clamp-1">${vid.title}</h4>
                <div class="flex justify-between text-xs text-gray-500">
                  <span>${vid.views}</span>
                  <span>${vid.time}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (filteredArticles.length > 0) {
    hasResults = true;
    resultsContainer.innerHTML += `
      <div>
        <h2 class="text-2xl font-bold mb-8 flex items-center gap-3 text-brand-black dark:text-white">
          <span class="w-2 h-8 bg-orange-500 rounded-full"></span> Articles
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${filteredArticles.map(art => `
            <div class="glass-card p-8 hover:border-orange-500/50 transition-colors group cursor-pointer">
              <span class="text-xs font-bold text-gray-500 mb-4 block">${art.date}</span>
              <h3 class="text-2xl font-bold mb-4 text-brand-black dark:text-white group-hover:text-orange-500 transition-colors">${art.title}</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">${art.excerpt}</p>
              <div class="flex items-center gap-2 text-orange-500 font-bold text-sm">
                Read Article →
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (!hasResults) {
    noResults.classList.remove('hidden');
  } else {
    noResults.classList.add('hidden');
  }
}

function initSearch() {
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const searchInputMobile = document.getElementById('search-input-mobile') as HTMLInputElement;

  const handleSearch = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const query = (e.target as HTMLInputElement).value;
      if (query.trim()) {
        window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`);
        renderRoute(`/search?q=${encodeURIComponent(query)}`);
        if (searchInputMobile) searchInputMobile.value = '';
        if (searchInput) searchInput.value = '';
      }
    }
  };

  if (searchInput) searchInput.addEventListener('keydown', handleSearch);
  if (searchInputMobile) searchInputMobile.addEventListener('keydown', handleSearch);
}

// --- Initialization ---
function init() {
  // Listen for auth state changes
  if (auth) {
    onAuthStateChanged(auth, (user) => {
      currentUser = user;
      updateAuthSection();
      renderMobileMenu();
      if (window.location.pathname === '/dashboard') {
        updateDashboardUI();
      }
    });
  } else {
    console.warn('Authentication is disabled because Firebase API keys are missing.');
  }

  const linksHtml = NAV_LINKS.map(link => `
    <a href="${link.path}" class="nav-link desktop-link text-sm font-medium transition-colors hover:text-orange-500 text-gray-600 dark:text-gray-300" data-path="${link.path}">
      ${link.name}
    </a>
  `).join('');
  desktopLinks.innerHTML = linksHtml;

  renderMobileMenu();

  const footerLinksHtml = NAV_LINKS.slice(0, 4).map(link => `
    <li><a href="${link.path}" class="nav-link hover:text-orange-500 transition-colors" data-path="${link.path}">${link.name}</a></li>
  `).join('');
  footerLinks.innerHTML = footerLinksHtml;

  updateAuthSection();

  currentYearSpan.textContent = new Date().getFullYear().toString();
  applyTheme(currentTheme);
  initSearch();
  renderRoute(window.location.pathname);

  // Hide Loading Screen
  setTimeout(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.classList.add('opacity-0', 'pointer-events-none');
      appContent.classList.remove('opacity-0');
      setTimeout(() => loader.remove(), 700);
    }
  }, 1500);

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('.nav-link');
    if (link) {
      const path = link.getAttribute('href');
      if (path && path.startsWith('/')) {
        e.preventDefault();
        window.history.pushState({}, '', path);
        renderRoute(path);
      }
    }
  });

  window.addEventListener('popstate', () => {
    renderRoute(window.location.pathname);
  });
}

function renderMobileMenu() {
  const mobileLinksHtml = NAV_LINKS.map(link => `
    <a href="${link.path}" class="nav-link text-lg font-medium text-[#0a0a0a] dark:text-white" data-path="${link.path}">
      ${link.name}
    </a>
  `).join('');
  
  let mobileAuthHtml = '';
  if (currentUser) {
    mobileAuthHtml = `
      <div class="pt-6 mt-6 border-t border-black/10 dark:border-white/10 flex flex-col gap-4">
        <a href="/dashboard" class="nav-link text-center py-3 text-lg font-bold text-orange-500" data-path="/dashboard">Dashboard</a>
        <button id="mobile-logout-btn" class="text-center py-3 text-lg font-bold text-red-500">Logout</button>
      </div>
    `;
  } else {
    mobileAuthHtml = `
      <div class="pt-6 mt-6 border-t border-black/10 dark:border-white/10 flex flex-col gap-4">
        <a href="/login" class="nav-link text-center py-3 text-lg font-bold text-gray-600 dark:text-gray-300" data-path="/login">Sign In</a>
        <a href="/signup" class="nav-link btn-primary text-center py-4 text-lg" data-path="/signup">Sign Up</a>
      </div>
    `;
  }
  
  mobileLinks.innerHTML = mobileLinksHtml + mobileAuthHtml;

  if (currentUser && auth) {
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    if (mobileLogoutBtn) {
      mobileLogoutBtn.addEventListener('click', async () => {
        try {
          await signOut(auth);
          window.history.pushState({}, '', '/login');
          renderRoute('/login');
        } catch (error) {
          console.error('Logout error:', error);
        }
      });
    }
  }
}

function updateAuthSection() {
  if (currentUser) {
    authSection.innerHTML = `
      <div class="flex items-center gap-4">
        <a href="/dashboard" class="nav-link flex items-center gap-2 group" data-path="/dashboard">
          <img src="${currentUser.photoURL || 'https://picsum.photos/seed/user/100/100'}" class="w-8 h-8 rounded-full border border-white/10" />
          <span class="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-orange-500 transition-colors">${currentUser.displayName || 'Profile'}</span>
        </a>
      </div>
    `;
  } else {
    authSection.innerHTML = `
      <div class="flex items-center gap-3">
        <a href="/login" class="nav-link text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors" data-path="/login">Sign In</a>
        <a href="/signup" class="nav-link btn-primary py-2 px-6 text-sm" data-path="/signup">Sign Up</a>
      </div>
    `;
  }
}

init();
