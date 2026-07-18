document.addEventListener("DOMContentLoaded", () => {
  // =========================================================
  // BIMO PORTFOLIO — ANIMATION SCRIPT V3
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

  // 1. SPLIT TEXT HERO PER HURUF (mempertahankan <em>)
  function splitTextToChars(selector) {
    document.querySelectorAll(selector).forEach((element) => {
      if (element.dataset.splitted === "true") return;
      const nodes = [...element.childNodes];
      element.textContent = "";
      element.dataset.splitted = "true";
      let index = 0;

      const appendChar = (char, target) => {
        const span = document.createElement("span");
        span.className = "char";
        span.style.setProperty("--char-index", index++);
        span.textContent = char === " " ? "\u00A0" : char;
        target.appendChild(span);
      };

      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          [...node.textContent].forEach((c) => appendChar(c, element));
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === "em") {
          const em = document.createElement("em");
          [...node.textContent].forEach((c) => appendChar(c, em));
          element.appendChild(em);
        } else {
          [...(node.textContent || "")].forEach((c) => appendChar(c, element));
        }
      });
    });
  }
  splitTextToChars(".hero-title .line");

  // 2. FLOATING PARTICLES
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

  // 3. MOBILE NAVIGATION
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

  // 4. HEADER + SCROLL PROGRESS
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

  // 5. SCROLL REVEAL + STAGGER
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

  // 6. ACTIVE NAV LINK
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

  // 7. SMOOTH SCROLL OFFSET
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

  // 8. SLIDER SERTIFIKAT (geser / drag + tombol)
  const certTrack = document.querySelector(".cert-track");
  const certPrev = document.querySelector(".cert-prev");
  const certNext = document.querySelector(".cert-next");

  if (certTrack) {
    const scrollAmount = () => Math.min(certTrack.clientWidth * 0.85, 360);
    certPrev?.addEventListener("click", () => {
      certTrack.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
    });
    certNext?.addEventListener("click", () => {
      certTrack.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    });

    // Drag-to-scroll
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = 0;

    certTrack.addEventListener("pointerdown", (e) => {
      isDown = true;
      moved = 0;
      startX = e.pageX;
      startScroll = certTrack.scrollLeft;
      certTrack.classList.add("dragging");
    });
    certTrack.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      const delta = e.pageX - startX;
      moved = Math.abs(delta);
      certTrack.scrollLeft = startScroll - delta;
    });
    const endDrag = () => {
      if (!isDown) return;
      isDown = false;
      certTrack.classList.remove("dragging");
    };
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    // Cegah klik link tak sengaja setelah drag jauh
    certTrack.addEventListener("click", (e) => {
      if (moved > 8) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // Scroll horizontal dengan roda mouse
    certTrack.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        certTrack.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  }

  // 9. CARD TILT 3D
  const cards = document.querySelectorAll(".feature-card, .project-card, .stat-card");
  cards.forEach((card) => {
    card.addE
