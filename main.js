/* ============================================
   THYNK EASY — main.js
   Handles:
     1. Dynamic copyright year
     2. Sticky header shadow on scroll
     3. Scroll-triggered fade-in animations
     4. Contact form submission + feedback
     5. Active nav highlight on scroll
============================================ */


/* ======= 1. DYNAMIC COPYRIGHT YEAR ======= */
(function setCopyrightYear() {
  const copy = document.querySelector('.footer-copy');
  if (!copy) return;
  copy.textContent = copy.textContent.replace('2026', new Date().getFullYear());
})();


/* ======= 2. STICKY HEADER SHADOW ======= */
(function stickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 4px 20px rgba(44, 62, 53, 0.18)';
    } else {
      header.style.boxShadow = '0 2px 8px rgba(44, 62, 53, 0.08)';
    }
  }, { passive: true });
})();


/* ======= 3. SCROLL-TRIGGERED FADE-IN ======= */
(function scrollAnimations() {
  const targets = document.querySelectorAll(
    '.feature, .step, .pricing-card, .section-title, .section-body'
  );

  if (!targets.length) return;

  // Set initial hidden state
  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  // Stagger cards in the same section
  const groups = [
    document.querySelectorAll('.feature'),
    document.querySelectorAll('.step')
  ];

  groups.forEach(group => {
    group.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  targets.forEach(el => observer.observe(el));
})();


/* ======= 4. CONTACT FORM SUBMISSION ======= */
(function handleForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalText = submitBtn.textContent;

    // Loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    try {
      const data = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        showFormMessage(form, 'success', "Message sent! We'll be in touch within one business day.");
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      showFormMessage(form, 'error', 'Something went wrong. Please try emailing us directly at dstonetm@gmail.com');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  });

  function showFormMessage(form, type, message) {
    // Remove any existing message
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.className = 'form-message';
    msg.textContent = message;

    msg.style.cssText = `
      padding: 14px 18px;
      border-radius: 6px;
      font-family: 'Inter', sans-serif;
      font-size: 0.92rem;
      line-height: 1.5;
      margin-top: 4px;
      background-color: ${type === 'success' ? 'rgba(212, 165, 116, 0.15)' : 'rgba(181, 113, 90, 0.15)'};
      border: 1px solid ${type === 'success' ? 'rgba(212, 165, 116, 0.4)' : 'rgba(181, 113, 90, 0.4)'};
      color: ${type === 'success' ? '#D4A574' : '#B5715A'};
      animation: fadeUp 0.4s ease both;
    `;

    form.appendChild(msg);

    // Auto-remove success message after 8 seconds
    if (type === 'success') {
      setTimeout(() => {
        msg.style.transition = 'opacity 0.4s ease';
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 400);
      }, 8000);
    }
  }
})();


/* ======= 5. ACTIVE NAV HIGHLIGHT ON SCROLL ======= */
(function activeNav() {
  const sections = document.querySelectorAll('section[id]');
  const navCta = document.querySelector('.nav-cta');
  if (!sections.length || !navCta) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.id === 'contact') {
        navCta.style.backgroundColor = '#B5715A';
        navCta.style.color = '#FBF8F4';
      } else if (!document.querySelector('#contact').getBoundingClientRect().top <= 0) {
        navCta.style.backgroundColor = '';
        navCta.style.color = '';
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(section => observer.observe(section));
})();
