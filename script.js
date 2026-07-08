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

// /* ==========================================================================
//    CONTACT FORM
//    No backend yet — opens the visitor's email app with the message pre-filled.
//    ========================================================================== */
// const contactForm = document.getElementById('contactForm');
// contactForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const [nameInput, emailInput] = contactForm.querySelectorAll('.form-row input');
//   const subjectInput = contactForm.querySelector('input[placeholder="Subject"]');
//   const messageInput = contactForm.querySelector('textarea');

//   const subject = encodeURIComponent(subjectInput.value || `Portfolio contact from ${nameInput.value}`);
//   const body = encodeURIComponent(`${messageInput.value}\n\n— ${nameInput.value} (${emailInput.value})`);
//   window.location.href = `mailto:princek801301@gmail.com?subject=${subject}&body=${body}`;
// });

/* ==========================================================================
   CONTACT FORM
   Submits to Formspree via fetch so the page never leaves/reloads, and the
   visitor sees an inline success/error message instead of their own email
   app popping up. Actual delivery to your inbox happens on Formspree's end.
   ========================================================================== */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' },
    });

    if (response.ok) {
      formStatus.textContent = "Thanks — your message is on its way. I'll get back to you soon.";
      formStatus.style.color = '#22C55E';
      contactForm.reset();
    } else {
      formStatus.textContent = "Something went wrong — please try emailing me directly instead.";
      formStatus.style.color = '#EF4444';
    }
  } catch (err) {
    formStatus.textContent = "Network error — please try emailing me directly instead.";
    formStatus.style.color = '#EF4444';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message →';
  }
});

/* ==========================================================================
   SCROLLSPY
   Highlights whichever nav link matches the section currently in view,
   instead of leaving "Home" permanently active.
   ========================================================================== */
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav__links a');

const scrollSpy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

sections.forEach(section => scrollSpy.observe(section));
