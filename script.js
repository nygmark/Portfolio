// scripts.js
// Replace the EmailJS placeholders (USER ID, SERVICE ID, TEMPLATE ID) with your credentials.
// EmailJS setup: https://www.emailjs.com/

document.addEventListener('DOMContentLoaded', () => {
  const PREF_KEY = 'prefers-dark';

  // Theme toggle
  const toggle = document.getElementById('themeToggle');
  function setTheme(isDark) {
    if (isDark) {
      document.body.classList.add('dark');
      toggle.setAttribute('aria-pressed', 'true');
      toggle.textContent = 'Light Mode';
      localStorage.setItem(PREF_KEY, '1');
    } else {
      document.body.classList.remove('dark');
      toggle.setAttribute('aria-pressed', 'false');
      toggle.textContent = 'Dark Mode';
      localStorage.setItem(PREF_KEY, '0');
    }
  }
  const saved = localStorage.getItem(PREF_KEY);
  setTheme(saved === '1');

  toggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark');
    setTheme(isDark);
  });

  // Modal logic
  const openHire = document.getElementById('openHire');
  const hireModal = document.getElementById('hireModal');
  const closeHire = document.getElementById('closeHire');

  function openModal() {
    hireModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const first = hireModal.querySelector('input,textarea,button');
    if (first) first.focus();
  }
  function closeModal() {
    hireModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    openHire.focus();
  }
  openHire.addEventListener('click', openModal);
  closeHire.addEventListener('click', closeModal);
  hireModal.addEventListener('click', (e) => { if (e.target === hireModal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && hireModal.getAttribute('aria-hidden') === 'false') closeModal(); });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold: 0.2});
    revealEls.forEach(el => revealObs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // Typewriter headline (cycles through roles)
  (function typewriter(){
    const el = document.querySelector('.headline');
    if (!el) return;
    const words = ['Frontend Developer', 'UI-focused', 'Open to work', 'I love my girlfriend'];
    let wi = 0, si = 0, isDeleting = false;
    function tick(){
      const full = words[wi];
      si = isDeleting ? si - 1 : si + 1;
      el.textContent = full.slice(0, si);
      let delay = isDeleting ? 60 : 120;
      if (!isDeleting && si === full.length) { isDeleting = true; delay = 900; }
      if (isDeleting && si === 0) { isDeleting = false; wi = (wi + 1) % words.length; delay = 300; }
      if (!prefersReduced) setTimeout(tick, delay);
    }
    tick();
  })();

  // Animate skill bars when skills section is visible
  // Skill bars: read data-width from the span or parent .bar and react to attribute changes
const skillSpans = document.querySelectorAll('.bar span');
const skillsSection = document.querySelector('.skills-section');

if (skillSpans.length) {
  // helper: compute & apply width for a single span
  function applyWidthToSpan(s) {
    // Prefer span's data-width, fallback to parent .bar's data-width
    let w = s.getAttribute('data-width') || s.dataset.width;
    if (!w) {
      const parent = s.closest('.bar');
      w = parent ? (parent.getAttribute('data-width') || parent.dataset.width) : null;
    }
    if (!w) w = '70%'; // default
    // accept "85" or "85%" formats
    if (!/%$/.test(w)) w = w + '%';
    s.style.width = w;
  }
  
  // animate all skill spans
  function animateSkills() {
    skillSpans.forEach(applyWidthToSpan);
  }
  
  // Observe attribute changes so editing data-width in DevTools updates live
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'attributes' && m.attributeName === 'data-width') {
        const target = m.target;
        if (target.tagName && target.tagName.toLowerCase() === 'span') {
          applyWidthToSpan(target);
        } else {
          // if parent .bar changed, update child span(s)
          target.querySelectorAll && target.querySelectorAll('span').forEach(s => applyWidthToSpan(s));
        }
      }
    }
  });
  
  skillSpans.forEach(s => {
    // observe changes on the span itself and its .bar parent
    mo.observe(s, { attributes: true });
    const parent = s.closest('.bar');
    if (parent) mo.observe(parent, { attributes: true });
  });
  
  // trigger animation when skills section enters viewport (or immediately)
  if (!prefersReduced && 'IntersectionObserver' in window && skillsSection) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateSkills();
          o.disconnect();
        }
      });
    }, { threshold: 0.3 });
    obs.observe(skillsSection);
  } else {
    animateSkills();
  }
}

  // Project card keyboard focus: show overlay on focus
  document.querySelectorAll('.post').forEach(p => {
    p.addEventListener('focus', () => p.classList.add('focused'));
    p.addEventListener('blur', () => p.classList.remove('focused'));
  });

  // Lazy loaded images are already via loading="lazy" in HTML

  // Initialize EmailJS (replace with your EmailJS Public Key)
  try {
    emailjs.init('EMAILJS_USER_ID'); // <-- REPLACE
  } catch (err) {
    console.warn('EmailJS init failed or emailjs not loaded. Replace EMAILJS_USER_ID and ensure the EmailJS script is included.', err);
  }

  // Contact form handling
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formStatus.textContent = 'Sending…';
      formStatus.style.color = '';

      const formData = new FormData(contactForm);
      const templateParams = {
        from_name: formData.get('from_name') || '',
        reply_to: formData.get('reply_to') || '',
        message: formData.get('message') || ''
      };

      // Replace SERVICE_ID and TEMPLATE_ID
      const SERVICE_ID = 'EMAILJS_SERVICE_ID'; // <-- REPLACE
      const TEMPLATE_ID = 'EMAILJS_TEMPLATE_ID'; // <-- REPLACE

      if (!window.emailjs || SERVICE_ID === 'EMAILJS_SERVICE_ID' || TEMPLATE_ID === 'EMAILJS_TEMPLATE_ID') {
        formStatus.textContent = 'Form is not configured. Replace EmailJS placeholders in scripts.js or use the mailto link.';
        formStatus.style.color = '#cc0000';
        return;
      }

      emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
        .then(() => {
          formStatus.textContent = 'Message sent! I will reply within 48 hours.';
          formStatus.style.color = '#0a8a00';
          contactForm.reset();
          setTimeout(() => { hireModal.setAttribute('aria-hidden','true'); }, 900);
        }, (err) => {
          console.error('EmailJS error:', err);
          formStatus.innerHTML = 'Send failed. You can also <a href="mailto:markjamesnanquil64@gmail.com">open an email</a>.';
          formStatus.style.color = '#cc0000';
        });
    });
  }

  // Accessibility: trap focus in modal when open (lightweight)
  document.addEventListener('focusin', (e) => {
    if (hireModal.getAttribute('aria-hidden') === 'false') {
      if (!hireModal.contains(e.target)) {
        e.preventDefault();
        hireModal.querySelector('input,textarea,button')?.focus();
      }
    }
  });

});