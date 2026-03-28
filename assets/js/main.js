/* ==========================================================
   Haq Enterprises — Premium Enterprise Motion & UX v2.0
   - Scroll reveal (IntersectionObserver)
   - Navbar scroll state + blur enhancement
   - Hero parallax (GPU-friendly)
   - Scroll-to-top
   - Button ripple (premium)
   - Magnetic hover (subtle)
   - Card tilt (very subtle)
   - Form validation + success message
   - Cursor spotlight (soft glow)
   - Counter animations
========================================================== */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  /* ==========================================================
     Navbar scroll state
  ========================================================== */
  const nav = document.querySelector(".hx-nav");
  function onScrollNav() {
    if (!nav) return;
    const y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle("is-scrolled", y > 10);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ==========================================================
     Scroll-to-top
  ========================================================== */
  const scrollTopBtn = document.getElementById("hxScrollTop");
  function onScrollTopBtn() {
    if (!scrollTopBtn) return;
    const y = window.scrollY || document.documentElement.scrollTop;
    scrollTopBtn.classList.toggle("is-visible", y > 420);
  }
  window.addEventListener("scroll", onScrollTopBtn, { passive: true });
  onScrollTopBtn();
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* ==========================================================
     Scroll reveal (IntersectionObserver)
  ========================================================== */
  const revealEls = document.querySelectorAll(".hx-reveal");
  if (!prefersReducedMotion && "IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Slight stagger for siblings
            const siblings = entry.target.parentElement
              ? Array.from(entry.target.parentElement.querySelectorAll(".hx-reveal"))
              : [];
            const idx = siblings.indexOf(entry.target);
            const delay = Math.min(idx * 60, 300);
            setTimeout(() => {
              entry.target.classList.add("is-in");
            }, delay);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.10, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ==========================================================
     Hero parallax (scroll-based, very subtle)
  ========================================================== */
  const heroBg = document.querySelector(".hx-hero-bg");
  if (!prefersReducedMotion && heroBg) {
    let ticking = false;
    const parallaxStrength = 0.05;

    function heroParallax() {
      const y = window.scrollY || document.documentElement.scrollTop;
      const offset = Math.min(28, Math.max(-28, y * parallaxStrength));
      heroBg.style.transform = `translate3d(0, ${offset}px, 0)`;
      ticking = false;
    }

    window.addEventListener("scroll", () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(heroParallax);
      }
    }, { passive: true });
    heroParallax();
  }

  /* ==========================================================
     Cursor spotlight glow (hero section only)
  ========================================================== */
  const hero = document.querySelector(".hx-hero");
  if (!prefersReducedMotion && hero && !isTouchDevice) {
    const spotlight = document.createElement("div");
    spotlight.style.cssText = `
      position:absolute;pointer-events:none;z-index:0;border-radius:50%;
      width:500px;height:500px;
      background:radial-gradient(circle, rgba(0,77,38,.09) 0%, transparent 70%);
      transform:translate(-50%,-50%);
      transition:opacity 400ms ease;
      opacity:0;
    `;
    hero.style.position = "relative";
    hero.appendChild(spotlight);

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      spotlight.style.opacity = "1";
      spotlight.style.left = (e.clientX - rect.left) + "px";
      spotlight.style.top = (e.clientY - rect.top) + "px";
    }, { passive: true });
    hero.addEventListener("mouseleave", () => {
      spotlight.style.opacity = "0";
    }, { passive: true });
  }

  /* ==========================================================
     Button ripple effect
  ========================================================== */
  const rippleTargets = document.querySelectorAll(".btn-hx-primary");
  rippleTargets.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (prefersReducedMotion) return;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "hx-ripple";
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
      ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
      btn.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 700);
    });
  });

  /* ==========================================================
     Subtle card tilt on hover (desktop only)
  ========================================================== */
  if (!prefersReducedMotion && !isTouchDevice) {
    const tiltCards = document.querySelectorAll(".hx-card, .hx-stat");
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const tiltX = y * -3;
        const tiltY = x * 3;
        card.style.transform = `translate3d(0, -5px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }, { passive: true });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        card.style.transition = "transform 400ms ease";
        setTimeout(() => { card.style.transition = ""; }, 400);
      }, { passive: true });
    });
  }

  /* ==========================================================
     Magnetic button effect (very subtle)
  ========================================================== */
  if (!prefersReducedMotion && !isTouchDevice) {
    const magnetBtns = document.querySelectorAll(".btn-hx-primary");
    magnetBtns.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.12;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.12;
        btn.style.transform = `translate3d(${x}px, ${y - 2}px, 0)`;
      }, { passive: true });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      }, { passive: true });
    });
  }

  /* ==========================================================
     Counter animation (for stat values containing numbers)
  ========================================================== */
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const counters = document.querySelectorAll("[data-hx-count]");
    if (counters.length) {
      const counterIO = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute("data-hx-count"), 10);
            const duration = 1200;
            const start = performance.now();
            const easeOut = (t) => 1 - Math.pow(1 - t, 3);

            function tick(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              el.textContent = Math.round(easeOut(progress) * target);
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach((el) => counterIO.observe(el));
    }
  }

  /* ==========================================================
     Card shine (light sweep on hover)
  ========================================================== */
  if (!prefersReducedMotion && !isTouchDevice) {
    const shineCards = document.querySelectorAll(".hx-card");
    shineCards.forEach((card) => {
      let shine = null;

      card.addEventListener("mouseenter", () => {
        if (shine) return;
        shine = document.createElement("div");
        shine.style.cssText = `
          position:absolute;inset:0;pointer-events:none;z-index:10;
          background:linear-gradient(110deg, rgba(255,255,255,.0) 30%, rgba(255,255,255,.30) 50%, rgba(255,255,255,.0) 70%);
          transform:translateX(-100%);
          transition:transform 500ms ease;
          border-radius:inherit;
        `;
        card.style.position = "relative";
        card.appendChild(shine);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (shine) shine.style.transform = "translateX(120%)";
          });
        });
      }, { passive: true });

      card.addEventListener("mouseleave", () => {
        if (shine) {
          const s = shine;
          shine = null;
          setTimeout(() => { s.remove(); }, 500);
        }
      }, { passive: true });
    });
  }

  /* ==========================================================
     Contact form validation
  ========================================================== */
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      form.classList.add("was-validated");
      if (success) success.classList.remove("d-none");

      // Integrate with backend as needed
      form.reset();
      form.classList.remove("was-validated");
    });
  }

  /* ==========================================================
     Smooth anchor links
  ========================================================== */
  if (!prefersReducedMotion) {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const id = anchor.getAttribute("href").substring(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

})();
