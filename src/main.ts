import './index.css';
import * as THREE from 'three';

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

// --- State ---
let currentTheme: Theme = (localStorage.getItem('theme') as Theme) || 
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

let isMobileMenuOpen = false;

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

// --- 3D Star Animation ---
function initIslamicStar(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Create an 8-pointed star geometry
  const shape = new THREE.Shape();
  const points = 8;
  const innerRadius = 1;
  const outerRadius = 2;

  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i / (points * 2)) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1 });
  const material = new THREE.MeshStandardMaterial({ color: 0xf97316, metalness: 0.7, roughness: 0.2 });
  const star = new THREE.Mesh(geometry, material);
  scene.add(star);

  const light = new THREE.PointLight(0xffffff, 10, 100);
  light.position.set(5, 5, 5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    star.rotation.y += 0.01;
    star.rotation.x += 0.005;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
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

    <section class="py-24 px-6 bg-white/[0.02]">
      <div class="max-w-5xl mx-auto">
        <div class="glass-card p-12 md:p-20 text-center relative overflow-hidden">
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
  about: `
    <div class="pt-32 pb-24 px-6 relative">
      <div class="absolute inset-0 islamic-pattern pointer-events-none opacity-10"></div>
      <div class="max-w-4xl mx-auto relative z-10 fade-in-up">
        <h1 class="text-5xl font-bold mb-8 text-center">About <span class="orange-gradient-text">Beacon of Islam</span></h1>
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
  articles: `
    <div class="pt-32 pb-24 px-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl font-bold mb-12">Islamic Articles</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="glass-card p-8">
            <h3 class="text-2xl font-bold mb-4">The Importance of Salah</h3>
            <p class="text-gray-500 mb-6">Salah is the second pillar of Islam and the most important act of worship...</p>
            <button class="btn-secondary text-sm">Read More</button>
          </div>
          <div class="glass-card p-8">
            <h3 class="text-2xl font-bold mb-4">Understanding Zakat</h3>
            <p class="text-gray-500 mb-6">Zakat is a form of alms-giving treated in Islam as a religious obligation...</p>
            <button class="btn-secondary text-sm">Read More</button>
          </div>
        </div>
      </div>
    </div>
  `,
  media: `
    <div class="pt-32 pb-24 px-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl font-bold mb-12">Media Library</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="glass-card overflow-hidden">
            <img src="https://picsum.photos/seed/vid1/400/225" class="w-full aspect-video object-cover" />
            <div class="p-4">
              <h4 class="font-bold">Prophet Stories</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  contact: `
    <div class="pt-32 pb-24 px-6">
      <div class="max-w-xl mx-auto">
        <h1 class="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        <div class="glass-card p-8">
          <form class="space-y-6">
            <div>
              <label class="block text-sm font-medium mb-2">Name</label>
              <input type="text" class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Email</label>
              <input type="email" class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Message</label>
              <textarea class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 h-32"></textarea>
            </div>
            <button type="submit" class="btn-primary w-full justify-center">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  `,
  dashboard: `
    <div class="pt-32 pb-24 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center gap-6 mb-12">
          <img src="https://picsum.photos/seed/user123/100/100" class="w-20 h-20 rounded-full border-2 border-orange-500" />
          <div>
            <h1 class="text-3xl font-bold">Welcome, Abdul Muiz</h1>
            <p class="text-gray-500">Knowledge Seeker Level 4</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="glass-card p-6">
            <h3 class="font-bold text-gray-500 mb-2 uppercase text-xs tracking-widest">Videos Watched</h3>
            <p class="text-4xl font-bold">24</p>
          </div>
          <div class="glass-card p-6">
            <h3 class="font-bold text-gray-500 mb-2 uppercase text-xs tracking-widest">Articles Read</h3>
            <p class="text-4xl font-bold">12</p>
          </div>
          <div class="glass-card p-6">
            <h3 class="font-bold text-gray-500 mb-2 uppercase text-xs tracking-widest">Learning Time</h3>
            <p class="text-4xl font-bold">18h</p>
          </div>
        </div>
      </div>
    </div>
  `,
  login: `
    <div class="pt-32 pb-24 px-6 flex items-center justify-center min-h-[80vh]">
      <div class="max-w-md w-full glass-card p-8">
        <h1 class="text-3xl font-bold mb-8 text-center">Sign In</h1>
        <form class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input type="email" class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Password</label>
            <input type="password" class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3" />
          </div>
          <button type="submit" class="btn-primary w-full justify-center">Sign In</button>
        </form>
      </div>
    </div>
  `,
  notFound: `
    <div class="pt-32 pb-24 px-6 text-center">
      <h1 class="text-6xl font-bold mb-4">404</h1>
      <p class="text-xl text-gray-500 mb-8">Page not found</p>
      <a href="/" class="nav-link btn-primary inline-flex" data-path="/">Go Home</a>
    </div>
  `
};

function renderRoute(path: string) {
  window.scrollTo(0, 0);
  isMobileMenuOpen = false;
  mobileMenu.classList.add('hidden');

  if (path === '/' || path === '') {
    appContent.innerHTML = templates.home;
    initIslamicStar('star-container');
  } else if (path === '/about') {
    appContent.innerHTML = templates.about;
  } else if (path === '/articles') {
    appContent.innerHTML = templates.articles;
  } else if (path === '/media') {
    appContent.innerHTML = templates.media;
  } else if (path === '/contact') {
    appContent.innerHTML = templates.contact;
  } else if (path === '/dashboard') {
    appContent.innerHTML = templates.dashboard;
  } else if (path === '/login') {
    appContent.innerHTML = templates.login;
  } else {
    appContent.innerHTML = templates.notFound;
  }

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

// --- Initialization ---
function init() {
  // Render Nav Links
  const linksHtml = NAV_LINKS.map(link => `
    <a href="${link.path}" class="nav-link desktop-link text-sm font-medium transition-colors hover:text-orange-500 text-gray-600 dark:text-gray-300" data-path="${link.path}">
      ${link.name}
    </a>
  `).join('');
  desktopLinks.innerHTML = linksHtml;

  const mobileLinksHtml = NAV_LINKS.map(link => `
    <a href="${link.path}" class="nav-link text-lg font-medium text-[#0a0a0a] dark:text-white" data-path="${link.path}">
      ${link.name}
    </a>
  `).join('');
  mobileLinks.innerHTML = mobileLinksHtml;

  const footerLinksHtml = NAV_LINKS.slice(0, 4).map(link => `
    <li><a href="${link.path}" class="nav-link hover:text-orange-500 transition-colors" data-path="${link.path}">${link.name}</a></li>
  `).join('');
  footerLinks.innerHTML = footerLinksHtml;

  // Auth Section
  authSection.innerHTML = `
    <a href="/login" class="nav-link btn-primary py-2 px-6 text-sm" data-path="/login">Sign In</a>
  `;

  // Year
  currentYearSpan.textContent = new Date().getFullYear().toString();

  // Initial Theme
  applyTheme(currentTheme);

  // Initial Route
  renderRoute(window.location.pathname);

  // Handle Clicks
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('.nav-link');
    if (link) {
      e.preventDefault();
      const path = link.getAttribute('href')!;
      window.history.pushState({}, '', path);
      renderRoute(path);
    }
  });

  // Handle Back/Forward
  window.addEventListener('popstate', () => {
    renderRoute(window.location.pathname);
  });
}

init();
