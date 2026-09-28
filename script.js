(() => {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------- Header: scrolled state ---------- */
  function initHeader() {
    const header = document.querySelector(".header");
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ---------- Mobile navigation ---------- */
  function initMobileNav() {
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("nav");
    const mobileQuery = window.matchMedia("(max-width: 900px)");

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
    };

    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    mobileQuery.addEventListener("change", (e) => { if (!e.matches) setOpen(false); });
  }

  /* ---------- Active nav link on scroll ---------- */
  function initScrollSpy() {
    const links = [...document.querySelectorAll(".nav__list .nav__link")];
    const sections = links.map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => observer.observe(s));
  }

  /* ---------- Scroll reveal (with stagger for siblings) ---------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    items.forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
      const index = siblings.indexOf(el);
      if (siblings.length > 1) el.style.setProperty("--delay", `${index * 0.1}s`);
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el) => observer.observe(el));
  }

  /* ---------- Footer subscribe form ---------- */
  function initSubscribe() {
    const form = document.getElementById("subscribeForm");
    const input = form.querySelector("input");
    const msg = document.getElementById("subscribeMsg");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      msg.classList.toggle("is-error", !valid);
      input.setAttribute("aria-invalid", String(!valid));
      if (!valid) {
        msg.textContent = "Please enter a valid email address.";
        input.focus();
        return;
      }
      msg.textContent = "Thanks for subscribing!";
      form.reset();
    });
  }

  initHeader();
  initMobileNav();
  initScrollSpy();
  initReveal();
  initSubscribe();
})();
