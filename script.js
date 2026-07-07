document.addEventListener("DOMContentLoaded", () => {
  // =========================================================
  // BIMO PORTFOLIO INTERACTION SCRIPT
  // Animasi dibuat mengikuti feel video referensi:
  // - reveal lembut saat scroll
  // - navbar pill aktif
  // - typing text
  // - parallax ringan
  // - card tilt halus
  // =========================================================

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // =============================
  // 1. TYPING EFFECT
  // =============================
  const typingTarget = document.getElementById("typing-text");
  const words = [
    "Creative Engineer.",
    "IoT Developer.",
    "Video Editor Lead.",
    "Visual Storyteller.",
    "Tech Leader."
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

    let speed = isDeleting ? 42 : 78;

    if (!isDeleting && charIndex === currentWord.length) {
      speed = 1450;
      isDeleting = true;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 420;
    }

    window.setTimeout(typeLoop, prefersReducedMotion ? 0 : speed);
  }

  typeLoop();

  // =============================
  // 2. MOBILE NAVIGATION
  // =============================
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

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  // =============================
  // 3. HEADER SCROLL STATE
  // =============================
  const header = document.querySelector(".site-header");

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 24);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // =============================
  // 4. SCROLL REVEAL
  // =============================
  const revealElements = document.querySelectorAll(".reveal-up, .reveal-scale");

  if (prefersReducedMotion) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -70px 0px"
      }
    );

    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
      revealObserver.observe(element);
    });
  }

  // =============================
  // 5. ACTIVE NAV LINK
  // =============================
  const sections = document.querySelectorAll("section[id], footer[id]");

  function setActiveLink() {
    let currentId = "hero";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 160;
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

  // =============================
  // 6. SMOOTH SCROLL OFFSET FIX
  // =============================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      const offset = targetId === "#hero" ? 0 : 92;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  });

  // =============================
  // 7. CARD TILT EFFECT
  // =============================
  const cards = document.querySelectorAll(".feature-card, .project-card, .stat-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (prefersReducedMotion || window.innerWidth <= 760) return;

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -5;
      const rotateY = ((x / rect.width) - 0.5) * 5;

      card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // =============================
  // 8. CURSOR GLOW
  // =============================
  const cursorGlow = document.querySelector(".cursor-glow");

  if (cursorGlow && !prefersReducedMotion) {
    document.addEventListener("mousemove", (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
      cursorGlow.style.opacity = "1";
    });

    document.addEventListener("mouseleave", () => {
      cursorGlow.style.opacity = "0";
    });
  }

  // =============================
  // 9. HERO PARALLAX
  // =============================
  const orbOne = document.querySelector(".hero-orb-1");
  const orbTwo = document.querySelector(".hero-orb-2");
  const illustration = document.querySelector(".hero-illustration");

  function updateParallax() {
    if (prefersReducedMotion || window.innerWidth <= 760) return;

    const scrollY = window.scrollY;
    if (orbOne) orbOne.style.transform = `translate3d(${scrollY * 0.03}px, ${scrollY * -0.02}px, 0)`;
    if (orbTwo) orbTwo.style.transform = `translate3d(${scrollY * -0.035}px, ${scrollY * 0.018}px, 0)`;
    if (illustration) illustration.style.marginBottom = `${scrollY * -0.04}px`;
  }

  window.addEventListener("scroll", updateParallax, { passive: true });
  updateParallax();

  // =============================
  // 10. BACK TO TOP
  // =============================
  const backToTop = document.querySelector(".back-to-top");

  function updateBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle("show", window.scrollY > 560);
  }

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  }

  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  // =============================
  // 11. IMAGE FALLBACK
  // Jika nama file gambar salah/tidak ditemukan,
  // card tetap terlihat rapi, tidak kosong.
  // =============================
  document.querySelectorAll(".project-media img, .brand-mark img").forEach((image) => {
    image.addEventListener("error", () => {
      const parent = image.parentElement;
      if (!parent) return;
      parent.classList.add("image-missing");
      image.style.display = "none";
    });
  });
});
