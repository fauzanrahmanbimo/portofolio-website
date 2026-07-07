document.addEventListener("DOMContentLoaded", () => {
  // =========================================================
  // BIMO PORTFOLIO — ULTRA ANIMATION SCRIPT V2
  // Banyak animasi, tanpa library tambahan.
  // =========================================================

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  // 0. PRELOADER
  const preloader = document.querySelector(".preloader");
  window.addEventListener("load", () => {
    if (!preloader) return;
    setTimeout(() => {
      preloader.classList.add("is-hidden");
      setTimeout(() => preloader.remove(), 900);
    }, prefersReducedMotion ? 0 : 650);
  });

  // 1. SPLIT TEXT HERO PER HURUF
  function splitTextToChars(selector) {
    document.querySelectorAll(selector).forEach((element) => {
      if (element.dataset.splitted === "true") return;
      const text = element.textContent;
      element.textContent = "";
      element.dataset.splitted = "true";
      [...text].forEach((char, index) => {
        const span = document.createElement("span");
        span.className = "char";
        span.style.setProperty("--char-index", index);
        span.textContent = char === " " ? "\u00A0" : char;
        element.appendChild(span);
      });
    });
  }
  splitTextToChars(".hero-title .line");

  // 2. SPLIT SECTION HEADING PER HURUF, termasuk <em>
  function splitHeadingChars() {
    document.querySelectorAll(".section-heading h2").forEach((heading) => {
      if (heading.dataset.splitted === "true") return;
      const nodes = [...heading.childNodes];
      heading.textContent = "";
      heading.dataset.splitted = "true";
      let charCounter = 0;

      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          [...node.textContent].forEach((char) => {
            const span = document.createElement("span");
            span.className = "char";
            span.style.setProperty("--char-index", charCounter++);
            span.textContent = char === " " ? "\u00A0" : char;
            heading.appendChild(span);
          });
        }

        if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === "em") {
          const em = document.createElement("em");
          [...node.textContent].forEach((char) => {
            const span = document.createElement("span");
            span.className = "char";
            span.style.setProperty("--char-index", charCounter++);
            span.textContent = char === " " ? "\u00A0" : char;
            em.appendChild(span);
          });
          heading.appendChild(em);
        }
      });
    });
  }
  splitHeadingChars();

  // 3. TYPING EFFECT
  const typingTarget = document.getElementById("typing-text");
  const words = [
    "Creative Engineer.",
    "IoT Developer.",
    "Video Editor Lead.",
    "Visual Storyteller.",
    "Tech Leader.",
    "AI Enthusiast.",
    "Multimedia Creator."
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    if (!typingTarget) return;
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typingTarget.textContent = currentWord.slice(0, charIndex - 1);
      charIndex--;
    } else {
      typingTarget.textContent = currentWord.slice(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 34 : 64;
    if (!isDeleting && charIndex === currentWord.length) {
      speed = 1250;
      isDeleting = true;
    }
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 330;
    }
    setTimeout(typeLoop, prefersReducedMotion ? 0 : speed);
  }
  typeLoop();

  // 4. FLOATING PARTICLES
  const particleContainer = document.querySelector(".floating-particles");
  if (particleContainer && !prefersReducedMotion && window.innerWidth > 760) {
    for (let i = 0; i < 36; i++) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.setProperty("--size", `${Math.random() * 9 + 4}px`);
      particle.style.setProperty("--left", `${Math.random() * 100}%`);
      particle.style.setProperty("--duration", `${Math.random() * 12 + 12}s`);
      particle.style.setProperty("--delay", `${Math.random() * -18}s`);
      particle.style.setProperty("--drift", `${(Math.random() - 0.5) * 180}px`);
      particle.style.setProperty("--opacity", `${Math.random() * 0.45 + 0.18}`);
      particleContainer.appendChild(particle);
    }
  }

  // 5. MOBILE NAVIGATION
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");

  function closeMenu() {
    if (!menuToggle || !navMenu) return;
    menuToggle.classList.remove("active");
    navMenu.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");
      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("no-scroll", isOpen);
    });
    navLinks.forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  // 6. HEADER + SCROLL PROGRESS
  const header = document.querySelector(".site-header");
  const progressBar = document.querySelector(".scroll-progress span");
  function updateScrollUI() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (header) header.classList.toggle("scrolled", scrollTop > 24);
    if (progressBar) progressBar.style.width = `${progress}%`;
  }
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  // 7. SCROLL REVEAL + STAGGER
  const revealElements = document.querySelectorAll(".reveal-up, .reveal-scale, .section-heading");
  if (prefersReducedMotion) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -68px 0px" });

    revealElements.forEach((el, index) => {
      el.style.transitionDelay = `${Math.min(index % 5, 4) * 45}ms`;
      observer.observe(el);
    });
  }

  // 8. ACTIVE NAV LINK
  const sections = document.querySelectorAll("section[id], footer[id]");
  function setActiveLink() {
    let currentId = "hero";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 170;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
        currentId = section.getAttribute("id") || currentId;
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
  }
  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  // 9. SMOOTH SCROLL OFFSET
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      const offset = targetId === "#hero" ? 0 : 96;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });

  // 10. CARD TILT 3D
  const cards = document.querySelectorAll(".feature-card, .project-card, .stat-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (prefersReducedMotion || isTouchDevice || window.innerWidth <= 760) return;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -6;
      const rotateY = ((x / rect.width) - 0.5) * 6;
      card.style.transform = `translateY(-12px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // 11. MAGNETIC BUTTON + LINK
  const magneticItems = document.querySelectorAll(".btn, .text-link, .nav-menu a");
  magneticItems.forEach((item) => {
    item.addEventListener("mousemove", (event) => {
      if (prefersReducedMotion || isTouchDevice || window.innerWidth <= 760) return;
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.16}px, ${y * 0.22}px)`;
    });
    item.addEventListener("mouseleave", () => {
      item.style.transform = "";
    });
  });

  // 12. RIPPLE CLICK BUTTON
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // 13. CUSTOM CURSOR
  const cursorGlow = document.querySelector(".cursor-glow");
  const cursorDot = document.querySelector(".cursor-dot");
  if (!prefersReducedMotion && !isTouchDevice) {
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
    document.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
        cursorDot.style.opacity = "1";
      }
      if (cursorGlow) cursorGlow.style.opacity = "1";
    });
    function animateCursorGlow() {
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      if (cursorGlow) {
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
      }
      requestAnimationFrame(animateCursorGlow);
    }
    animateCursorGlow();
    document.addEventListener("mouseleave", () => {
      if (cursorDot) cursorDot.style.opacity = "0";
      if (cursorGlow) cursorGlow.style.opacity = "0";
    });
    document.querySelectorAll("a, button, .project-card, .feature-card").forEach((el) => {
      el.addEventListener("mouseenter", () => cursorDot?.classList.add("is-hovering"));
      el.addEventListener("mouseleave", () => cursorDot?.classList.remove("is-hovering"));
    });
  }

  // 14. HERO PARALLAX MULTI-LAYER
  const orbOne = document.querySelector(".hero-orb-1");
  const orbTwo = document.querySelector(".hero-orb-2");
  const illustration = document.querySelector(".hero-illustration");
  const heroTitle = document.querySelector(".hero-title");
  const miniCards = document.querySelectorAll(".mini-card");
  function updateParallax() {
    if (prefersReducedMotion || window.innerWidth <= 760) return;
    const limited = Math.min(window.scrollY, window.innerHeight);
    if (orbOne) orbOne.style.translate = `${limited * 0.035}px ${limited * -0.02}px`;
    if (orbTwo) orbTwo.style.translate = `${limited * -0.045}px ${limited * 0.018}px`;
    if (illustration) illustration.style.marginBottom = `${limited * -0.05}px`;
    if (heroTitle) heroTitle.style.transform = `translateY(${limited * -0.035}px)`;
    miniCards.forEach((card, index) => {
      const dir = index % 2 === 0 ? 1 : -1;
      card.style.marginTop = `${limited * 0.025 * dir}px`;
      card.style.marginLeft = `${limited * 0.018 * -dir}px`;
    });
  }
  window.addEventListener("scroll", updateParallax, { passive: true });
  updateParallax();

  // 15. BACK TO TOP
  const backToTop = document.querySelector(".back-to-top");
  function updateBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle("show", window.scrollY > 560);
  }
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  // 16. IMAGE FALLBACK
  document.querySelectorAll(".project-media img, .brand-mark img").forEach((image) => {
    image.addEventListener("error", () => {
      const parent = image.parentElement;
      if (!parent) return;
      parent.classList.add("image-missing");
      image.style.display = "none";
    });
  });
});
