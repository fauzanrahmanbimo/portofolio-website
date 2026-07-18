/* =========================================================
   Bimo Rahman Fauzan — Portfolio interactions
   Semua kode dibungkus DOMContentLoaded agar aman dijalankan.
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- 0. PRELOADER ---------- */
  var preloader = document.getElementById("preloader");
  function hidePreloader() {
    if (preloader) preloader.classList.add("is-hidden");
  }
  window.addEventListener("load", hidePreloader);
  // Safety timeout: jangan pernah biarkan halaman ketutup preloader.
  setTimeout(hidePreloader, 3500);

  /* ---------- 1. SPLIT TEXT (pertahankan <em>) ---------- */
  function splitTextToChars(el) {
    var nodes = Array.prototype.slice.call(el.childNodes);
    el.innerHTML = "";
    var chars = [];
    nodes.forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split("").forEach(function (ch) {
          var span = document.createElement("span");
          span.className = "char";
          span.textContent = ch === " " ? "\u00A0" : ch;
          el.appendChild(span);
          chars.push(span);
        });
      } else if (node.nodeType === 1) {
        var wrap = document.createElement(node.tagName.toLowerCase());
        (node.textContent || "").split("").forEach(function (ch) {
          var span = document.createElement("span");
          span.className = "char";
          span.textContent = ch === " " ? "\u00A0" : ch;
          wrap.appendChild(span);
          chars.push(span);
        });
        el.appendChild(wrap);
      }
    });
    return chars;
  }

  var splitTargets = document.querySelectorAll("[data-split]");
  splitTargets.forEach(function (el) {
    if (reduceMotion) return;
    var chars = splitTextToChars(el);
    chars.forEach(function (c, i) {
      setTimeout(function () {
        c.classList.add("is-in");
      }, 350 + i * 22);
    });
  });

  /* ---------- 2. PARTICLES ---------- */
  var particles = document.getElementById("particles");
  if (particles && !reduceMotion) {
    var count = window.innerWidth < 760 ? 14 : 26;
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      p.className = "particle";
      var size = Math.random() * 6 + 3;
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.left = Math.random() * 100 + "%";
      p.style.bottom = "-10px";
      p.style.animationDuration = Math.random() * 12 + 10 + "s";
      p.style.animationDelay = Math.random() * 8 + "s";
      p.style.opacity = Math.random() * 0.5 + 0.2;
      particles.appendChild(p);
    }
  }

  /* ---------- 3. MOBILE NAV ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    });
    mainNav.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 4. HEADER + SCROLL PROGRESS ---------- */
  var header = document.getElementById("siteHeader");
  var progress = document.getElementById("scrollProgress");
  var backToTop = document.getElementById("backToTop");
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle("is-scrolled", y > 30);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    if (backToTop) backToTop.classList.toggle("is-visible", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 5. REVEAL ON SCROLL ---------- */
  var revealEls = document.querySelectorAll(".reveal-up, .reveal-scale");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    // Fallback: tampilkan semua.
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- 6. ACTIVE NAV LINK ---------- */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-link");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              link.classList.toggle(
                "is-active",
                link.getAttribute("href") === "#" + id
              );
            });
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach(function (s) {
      spy.observe(s);
    });
  }

  /* ---------- 7. SMOOTH SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var href = a.getAttribute("href");
      if (!href || href === "#") return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var offset = 74;
      var top =
        target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  /* ---------- 8. CERT SLIDER ---------- */
  var track = document.getElementById("certTrack");
  var prevBtn = document.getElementById("certPrev");
  var nextBtn = document.getElementById("certNext");
  if (track) {
    var step = 350;
    if (nextBtn)
      nextBtn.addEventListener("click", function () {
        track.scrollBy({ left: step, behavior: "smooth" });
      });
    if (prevBtn)
      prevBtn.addEventListener("click", function () {
        track.scrollBy({ left: -step, behavior: "smooth" });
      });

    // wheel horizontal
    track.addEventListener(
      "wheel",
      function (e) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          track.scrollLeft += e.deltaY;
          e.preventDefault();
        }
      },
      { passive: false }
    );

    // drag to scroll
    var isDown = false,
      startX = 0,
      startLeft = 0,
      moved = false;
    track.addEventListener("pointerdown", function (e) {
      isDown = true;
      moved = false;
      startX = e.pageX;
      startLeft = track.scrollLeft;
      track.classList.add("dragging");
    });
    window.addEventListener("pointermove", function (e) {
      if (!isDown) return;
      var walk = e.pageX - startX;
      if (Math.abs(walk) > 4) moved = true;
      track.scrollLeft = startLeft - walk;
    });
    window.addEventListener("pointerup", function () {
      isDown = false;
      track.classList.remove("dragging");
    });
    // suppress click after drag
    track.addEventListener(
      "click",
      function (e) {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );
  }

  /* ---------- 9. CARD TILT 3D ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document
      .querySelectorAll(".feature-card, .project-card, .skill-cert")
      .forEach(function (card) {
        card.addEventListener("mousemove", function (e) {
          var r = card.getBoundingClientRect();
          var cx = (e.clientX - r.left) / r.width - 0.5;
          var cy = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform =
            "translateY(-6px) rotateX(" +
            -cy * 5 +
            "deg) rotateY(" +
            cx * 5 +
            "deg)";
        });
        card.addEventListener("mouseleave", function () {
          card.style.transform = "";
        });
      });
  }

  /* ---------- 10. MAGNETIC BUTTONS ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".magnetic").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform =
          "translate(" + x * 0.2 + "px," + y * 0.3 + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- 11. RIPPLE ---------- */
  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var r = btn.getBoundingClientRect();
      var circle = document.createElement("span");
      var size = Math.max(r.width, r.height);
      circle.className = "ripple";
      circle.style.width = circle.style.height = size + "px";
      circle.style.left = e.clientX - r.left - size / 2 + "px";
      circle.style.top = e.clientY - r.top - size / 2 + "px";
      btn.appendChild(circle);
      setTimeout(function () {
        circle.remove();
      }, 600);
    });
  });

  /* ---------- 12. CUSTOM CURSOR ---------- */
  var glow = document.getElementById("cursorGlow");
  var dot = document.getElementById("cursorDot");
  if (glow && dot && window.matchMedia("(hover: hover)").matches) {
    var gx = 0, gy = 0, tx = 0, ty = 0;
    document.addEventListener("mousemove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
      dot.style.transform =
        "translate(" + tx + "px," + ty + "px) translate(-50%,-50%)";
    });
    (function loop() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform =
        "translate(" + gx + "px," + gy + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
    document
      .querySelectorAll("a, button, .magnetic")
      .forEach(function (el) {
        el.addEventListener("mouseenter", function () {
          dot.classList.add("is-active");
        });
        el.addEventListener("mouseleave", function () {
          dot.classList.remove("is-active");
        });
      });
  }

  /* ---------- 13. HERO PARALLAX ---------- */
  var orb1 = document.querySelector(".hero-orb-1");
  var orb2 = document.querySelector(".hero-orb-2");
  if ((orb1 || orb2) && !reduceMotion) {
    window.addEventListener(
      "scroll",
      function () {
        var y = window.pageYOffset;
        if (orb1) orb1.style.transform = "translateY(" + y * 0.18 + "px)";
        if (orb2) orb2.style.transform = "translateY(" + y * -0.12 + "px)";
      },
      { passive: true }
    );
  }

  /* ---------- 14. BACK TO TOP ---------- */
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- 15. IMAGE FALLBACK ---------- */
  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function () {
      img.style.opacity = "0.35";
      img.style.filter = "grayscale(1)";
      img.setAttribute("data-broken", "true");
    });
  });

  /* ---------- FOOTER YEAR ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
