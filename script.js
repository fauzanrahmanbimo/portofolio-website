document.addEventListener("DOMContentLoaded", () => {
  // =============================
  // 1. EFEK TYPING
  // =============================

  const words = [
    "Creative Engineer.",
    "Video Editor Lead.",
    "IoT Developer.",
    "Tech Leader."
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typingTextElement = document.getElementById("typing-text");

  function typeEffect() {
    if (!typingTextElement) return;

    const currentWord = words[wordIndex];

    if (isDeleting) {
      typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typingSpeed = isDeleting ? 55 : 95;

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 450;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // =============================
  // 2. SCROLL REVEAL
  // =============================

  const reveals = document.querySelectorAll(".reveal");

  function revealOnScroll() {
    const windowHeight = window.innerHeight;
    const elementVisible = 110;

    reveals.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;

      if (elementTop < windowHeight - elementVisible) {
        element.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  // =============================
  // 3. HEADER SAAT SCROLL
  // =============================

  const header = document.querySelector("header");

  function handleHeaderScroll() {
    if (!header) return;

    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleHeaderScroll);
  handleHeaderScroll();

  // =============================
  // 4. NAVBAR MOBILE
  // =============================

  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  // =============================
  // 5. NAVBAR ACTIVE SECTION
  // =============================

  const sections = document.querySelectorAll("section[id], footer[id]");

  function setActiveNav() {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");

      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", setActiveNav);
  setActiveNav();

  // =============================
  // 6. EFEK TILT HALUS PADA CARD
  // =============================

  const cards = document.querySelectorAll(".glass-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (window.innerWidth <= 768) return;

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // =============================
  // 7. CURSOR GLOW
  // =============================

  const cursorGlow = document.querySelector(".cursor-glow");

  if (cursorGlow) {
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
  // 8. BACK TO TOP BUTTON
  // =============================

  const backToTopButton = document.querySelector(".back-to-top");

  function handleBackToTopVisibility() {
    if (!backToTopButton) return;

    if (window.scrollY > 550) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  }

  if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  window.addEventListener("scroll", handleBackToTopVisibility);
  handleBackToTopVisibility();

  // =============================
  // 9. EFEK MASUK HERO
  // =============================

  const heroTitle = document.querySelector("#hero h1");
  const heroTags = document.querySelectorAll(".hero-tag-left, .hero-tag-right");
  const heroTyping = document.querySelector(".typing-container");
  const heroButton = document.querySelector("#hero .btn");

  const heroItems = [heroTitle, ...heroTags, heroTyping, heroButton].filter(Boolean);

  heroItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(24px)";

    setTimeout(() => {
      item.style.transition = "opacity 0.75s ease, transform 0.75s ease";
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    }, 160 * index);
  });
});
