/* ==========================================================================
   THEME TOGGLE
   Reads/writes a single data-theme attribute on <html>. Preference is saved
   to localStorage so it persists across visits; falls back to the user's
   OS-level preference on first visit if nothing is saved yet.
   ========================================================================== */
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
}

// Initial theme: saved preference wins; otherwise default to dark, matching
// the template exactly (no OS-preference auto-switching, so first-time
// visitors always see the same dark look regardless of their system setting).
const savedTheme = localStorage.getItem('portfolio-theme');
applyTheme(savedTheme === 'light' ? 'light' : 'dark');

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  applyTheme(current === 'light' ? 'dark' : 'light');
});

/* ==========================================================================
   MOBILE NAV TOGGLE
   ========================================================================== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ==========================================================================
   CONTACT FORM
   No backend yet — opens the visitor's email app with the message pre-filled.
   ========================================================================== */
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const [nameInput, emailInput] = contactForm.querySelectorAll('.form-row input');
  const subjectInput = contactForm.querySelector('input[placeholder="Subject"]');
  const messageInput = contactForm.querySelector('textarea');

  const subject = encodeURIComponent(subjectInput.value || `Portfolio contact from ${nameInput.value}`);
  const body = encodeURIComponent(`${messageInput.value}\n\n— ${nameInput.value} (${emailInput.value})`);
  window.location.href = `mailto:your.email@example.com?subject=${subject}&body=${body}`;
});