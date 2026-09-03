document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  initTypingEffect();
  initNav();
  initScrollSpy();
  initRevealAnimations();
  initCertificateImages();
  initProfileImage();
  initContactForm();
  initProfileTilt();
});

function initTypingEffect() {
  const typingText = document.getElementById('typing-text');
  if (!typingText) return;

  const texts = ['Software Engineering Student', 'AI/ML Enthusiast', 'Builder'];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentText = texts[textIndex];

    if (!isDeleting) {
      typingText.textContent = currentText.substring(0, charIndex + 1);
      charIndex += 1;

      if (charIndex === currentText.length) {
        setTimeout(() => {
          isDeleting = true;
        }, 900);
      }
    } else {
      typingText.textContent = currentText.substring(0, charIndex - 1);
      charIndex -= 1;

      if (charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }
    }

    const speed = isDeleting ? 35 : 70;
    setTimeout(typeEffect, speed);
  }

  typeEffect();
}

function initProfileImage() {
  const image = document.getElementById('profilePic');
  if (!image) return;

  const usePlaceholder = () => {
    image.src = 'assets/images/profile-placeholder.svg';
    image.alt = 'Profile photo coming soon';
    image.classList.add('is-placeholder');
  };

  image.addEventListener('error', usePlaceholder, { once: true });
  if (image.complete && image.naturalWidth === 0) usePlaceholder();
}

function initCertificateImages() {
  const placeholder = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">' +
      '<rect width="800" height="600" fill="#1b1f24"/>' +
      '<rect x="70" y="70" width="660" height="460" fill="none" stroke="#8ba89d" stroke-width="3"/>' +
      '<text x="400" y="285" fill="#a9c4b9" font-family="sans-serif" font-size="30" text-anchor="middle">Certificate image coming soon</text>' +
    '</svg>'
  );

  document.querySelectorAll('.cert-img').forEach((image) => {
    image.addEventListener('error', () => {
      image.src = placeholder;
      image.alt = 'Certificate image coming soon';
      const viewLink = image.closest('.cert-card')?.querySelector('a');
      if (viewLink) viewLink.href = placeholder;
    }, { once: true });
  });
}

/* =========================================================
   NAVIGATION: scroll shadow, mobile menu, smooth close
   ========================================================= */
function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('.nav-link, .nav-cta').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.querySelectorAll('.placeholder-link').forEach((link) => {
    link.addEventListener('click', (event) => event.preventDefault());
  });
}

/* =========================================================
   SCROLL SPY: highlight active nav link
   ========================================================= */
function initScrollSpy() {
  const links = document.querySelectorAll('.nav-link');
  const sections = Array.from(links)
    .map((link) => document.getElementById(link.dataset.section))
    .filter(Boolean);

  if (!('IntersectionObserver' in window) || sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle('active', link.dataset.section === entry.target.id);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* =========================================================
   SCROLL REVEAL
   ========================================================= */
function initRevealAnimations() {
  const targets = document.querySelectorAll(
    '.feature-card, .timeline-item, .project-card, .cert-card, .section-head, .about-text, .exploring, .connect-grid'
  );
  targets.forEach((el) => el.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* =========================================================
   CONTACT FORM: client-side validation only
   ========================================================= */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name: { input: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
    message: { input: document.getElementById('message'), error: document.getElementById('messageError') },
  };
  const status = document.getElementById('formStatus');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(field, message) {
    field.input.closest('.form-row').classList.toggle('invalid', Boolean(message));
    field.error.textContent = message || '';
  }

  function validate() {
    let valid = true;

    if (!fields.name.input.value.trim()) {
      setError(fields.name, 'Please enter your name.');
      valid = false;
    } else {
      setError(fields.name, '');
    }

    const emailVal = fields.email.input.value.trim();
    if (!emailVal || !emailPattern.test(emailVal)) {
      setError(fields.email, 'Please enter a valid email address.');
      valid = false;
    } else {
      setError(fields.email, '');
    }

    if (!fields.message.input.value.trim()) {
      setError(fields.message, 'Please enter a message.');
      valid = false;
    } else {
      setError(fields.message, '');
    }

    return valid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '';

    if (!validate()) {
      status.textContent = 'Please fix the highlighted fields.';
      return;
    }

    handleSubmit();
  });

  async function handleSubmit() {
    const emailTo = 'sirazamswe@gmail.com';
    const payload = {
      name: fields.name.input.value.trim(),
      email: fields.email.input.value.trim(),
      message: fields.message.input.value.trim(),
      _subject: `Portfolio contact from ${fields.name.input.value.trim()}`,
      _replyto: fields.email.input.value.trim(),
    };

    status.textContent = 'Sending your message...';

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${emailTo}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      status.textContent = 'Thanks! Your message has been sent to sirazamswe@gmail.com.';
      form.reset();
      Object.keys(fields).forEach((key) => setError(fields[key], ''));
    } catch (error) {
      status.textContent = 'Something went wrong while sending the message. Please email sirazamswe@gmail.com directly.';
    }
  }
}

/* =========================================================
   INTERACTIVE 3D PROFILE TILT
   ========================================================= */
function initProfileTilt() {
  const pic = document.getElementById('profilePic');
  if (!pic || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  pic.addEventListener('mousemove', (e) => {
    const rect = pic.getBoundingClientRect();
    // Calculate mouse position relative to the image center
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angles (max 15 degrees)
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;

    pic.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  // Reset image when mouse leaves
  pic.addEventListener('mouseleave', () => {
    pic.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    pic.style.transition = 'transform 0.5s ease';
    pic.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
  });

  // Remove transition lag while moving
  pic.addEventListener('mouseenter', () => {
    pic.style.transition = 'transform 0.1s ease-out, box-shadow 0.2s ease';
    pic.style.boxShadow = '0 15px 40px rgba(139, 168, 157, 0.3)';
  });
}