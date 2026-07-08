/* ============================================================
   site.js — scroll reveals, mobile nav, nav active state,
   and the photography lightbox. Vanilla, no dependencies.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const reveals = document.querySelectorAll("[data-reveal]");
  if (reveals.length) {
    reveals.forEach((el, i) => {
      // gentle stagger for siblings
      el.style.transitionDelay = (i % 6) * 60 + "ms";
    });

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
      );
      reveals.forEach((el) => io.observe(el));

      // Failsafe: if anything is still hidden shortly after load (e.g. the
      // observer never fires because the element was already in view when
      // the page loaded, or the browser is slow), reveal it. Guarantees
      // content is never permanently invisible.
      const revealAll = () => reveals.forEach((el) => el.classList.add("in"));
      window.addEventListener("load", () => setTimeout(revealAll, 900));
    } else {
      reveals.forEach((el) => el.classList.add("in"));
    }
  }

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Lightbox ---------- */
  const lb = document.querySelector(".lightbox");
  if (lb) {
    const lbImg = lb.querySelector("img");
    const counter = lb.querySelector(".lb-counter");
    const items = Array.from(document.querySelectorAll(".masonry figure"));
    // Build a list of {thumb, full, caption} from the data attrs on each figure.
    const set = items.map((fig) => {
      const img = fig.querySelector("img");
      return {
        full: fig.dataset.full || img.src,
        caption: fig.dataset.caption || (fig.querySelector("figcaption")?.textContent ?? ""),
      };
    });
    let current = -1;

    function open(i) {
      if (!set.length) return;
      current = (i + set.length) % set.length;
      const item = set[current];
      lbImg.src = item.full;
      lbImg.alt = item.caption || "Photograph";
      counter.textContent = current + 1 + " / " + set.length;
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lb.classList.remove("open");
      lbImg.src = "";
      document.body.style.overflow = "";
    }
    function step(d) { open(current + d); }

    items.forEach((fig, i) =>
      fig.addEventListener("click", () => open(i))
    );
    lb.querySelector(".lb-close")?.addEventListener("click", close);
    lb.querySelector(".lb-prev")?.addEventListener("click", (e) => { e.stopPropagation(); step(-1); });
    lb.querySelector(".lb-next")?.addEventListener("click", (e) => { e.stopPropagation(); step(1); });
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });

    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });
  }

  /* ---------- Homepage: corner meta (year + live clock) ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  const clock = document.querySelector("[data-clock]");
  if (clock) {
    const tick = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, "0");
      const m = String(d.getMinutes()).padStart(2, "0");
      clock.textContent = `${h}:${m}`;
    };
    tick();
    setInterval(tick, 1000 * 20);
  }

  /* ---------- Homepage: cursor-following spotlight ---------- */
  const spot = document.getElementById("spotlight");
  if (spot && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let raf = 0, x = window.innerWidth / 2, y = window.innerHeight * 0.4;
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(() => {
        spot.style.setProperty("--mx", x + "px");
        spot.style.setProperty("--my", y + "px");
        raf = 0;
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    // fade in after first interaction
    window.addEventListener("pointermove", () => spot.classList.add("is-on"), { once: true });
  }
})();
