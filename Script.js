document.addEventListener("DOMContentLoaded", () => {

  // ─────────────────────────────────────────────
  //  DEVICE HELPERS
  // ─────────────────────────────────────────────
  const isTouchDevice = () =>
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const isSmallScreen = () => window.innerWidth < 768;

  // Parallax runs only on non-touch desktops for best performance
  const useParallax = !isTouchDevice() && !isSmallScreen();


  // ─────────────────────────────────────────────
  //  TYPEWRITER
  // ─────────────────────────────────────────────
  const textElement = document.getElementById("typewriter");
  const phrases = ["FULL STACK DEVELOPER", "STI IT STUDENT", "CREATIVE CODER"];
  let i = 0,
    j = 0,
    deleting = false;

  function type() {
    if (!textElement) return;
    const current = phrases[i];

    textElement.innerHTML =
      current.substring(0, j) + '<span class="cursor">|</span>';

    if (!deleting) {
      j++;
      if (j > current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      j--;
      if (j === 0) {
        deleting = false;
        i = (i + 1) % phrases.length;
      }
    }

    setTimeout(type, deleting ? 50 : 120);
  }

  type();


  // ─────────────────────────────────────────────
  //  NAVBAR — scroll-activated background
  // ─────────────────────────────────────────────
  const parallaxHeader = document.querySelector(".parallax-header");

  function updateNavbar() {
    if (!parallaxHeader) return;
    if (window.scrollY > 60) {
      parallaxHeader.classList.add("scrolled");
    } else {
      parallaxHeader.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar(); // run once on load


  // ─────────────────────────────────────────────
  //  PARALLAX (desktop-only)
  // ─────────────────────────────────────────────
  const knight = document.getElementById("nbg");
  const hero   = document.querySelector(".hero-content");
  const castle = document.querySelector(".section1 img:first-child");

  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scroll = window.scrollY;
          const height = window.innerHeight;

          if (scroll <= height) {
            if (useParallax) {
              if (knight) {
                knight.style.transform = `translate(${-scroll * 0.1}px, ${scroll * 0.5}px)`;
              }
              if (castle) {
                castle.style.transform = `translateY(${scroll * 0.1}px) scale(${1 + scroll * 0.0004})`;
              }
              if (hero) {
                hero.style.transform = `translate(-50%, calc(-50% + ${scroll * 0.7}px))`;
              }
            }

            // Fade hero text on ALL devices
            if (hero) {
              hero.style.opacity = Math.max(0, 1 - scroll / 500);
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );


  // ─────────────────────────────────────────────
  //  SCROLL REVEAL
  // ─────────────────────────────────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        e.target.classList.toggle("active", e.isIntersecting);
      });
    },
    // Slightly lower threshold so cards trigger earlier on small screens
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(".reveal, .reveal-card, .about-container")
    .forEach((el, index) => {
      if (el.classList.contains("reveal-card")) {
        el.style.transitionDelay = `${(index % 4) * 0.1}s`;
      }
      revealObserver.observe(el);
    });


  // ─────────────────────────────────────────────
  //  PROJECT CAROUSEL — duplicate cards for seamless loop
  // ─────────────────────────────────────────────
  const train = document.getElementById("projectTrain");
  if (train) {
    train.innerHTML += train.innerHTML; // duplicate for infinite loop

    // Faster scroll on small screens so it doesn't feel sluggish
    if (isSmallScreen()) {
      train.style.animationDuration = "28s";
    }
  }


  // ─────────────────────────────────────────────
  //  UNIFIED MODAL (single & multiple images)
  // ─────────────────────────────────────────────
  const modal     = document.getElementById("certModal");
  const container = document.getElementById("modalImageContainer");
  const caption   = document.getElementById("caption");

  const openModal = (rawData, title) => {
    if (!modal || !container) return;

    container.innerHTML = "";

    const images = rawData
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    images.forEach((path) => {
      const img = document.createElement("img");
      img.src = path;
      img.className = "modal-content";
      img.alt = title || "";
      img.style.display = "block";
      img.style.marginBottom = "20px";
      container.appendChild(img);
    });

    if (caption) caption.innerText = title || "";
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (!modal) return;
    modal.style.display = "none";
    document.body.style.overflow = "";
  };

  // Event delegation — catches clicks on all trigger elements
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(
      ".modal-trigger, .screenshot-btn, .view-cert-btn"
    );
    if (trigger) {
      const rawData =
        trigger.getAttribute("data-img") || trigger.src || "";
      const title =
        trigger
          .closest(".project-info, .cert-info")
          ?.querySelector("h3")?.innerText || trigger.alt || "";
      if (rawData) openModal(rawData, title);
    }
  });

  // Close: button, backdrop click, Escape key
  document
    .querySelectorAll(".close-modal")
    .forEach((btn) => btn.addEventListener("click", closeModal));

  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Swipe down to close on touch devices
  if (modal) {
    let touchStartY = 0;
    modal.addEventListener(
      "touchstart",
      (e) => { touchStartY = e.touches[0].clientY; },
      { passive: true }
    );
    modal.addEventListener(
      "touchend",
      (e) => {
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (dy > 80) closeModal(); // swipe down 80 px → close
      },
      { passive: true }
    );
  }


  // ─────────────────────────────────────────────
  //  NAV ACTIVE LINK HIGHLIGHT
  // ─────────────────────────────────────────────
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener(
    "scroll",
    () => {
      let current = "";
      sections.forEach((sec) => {
        if (window.scrollY >= sec.offsetTop - 160) {
          current = sec.id;
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
          link.classList.add("active");
        }
      });
    },
    { passive: true }
  );


  // ─────────────────────────────────────────────
  //  AUTO-CLOSE MOBILE NAV ON LINK CLICK
  // ─────────────────────────────────────────────
  const navCollapse = document.getElementById("navbarNav");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992 && navCollapse) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });


  // ─────────────────────────────────────────────
  //  RESIZE HANDLER
  //  Resets hero transform on orientation change / resize
  //  so stale parallax values don't misplace the text.
  // ─────────────────────────────────────────────
  let resizeTimer;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (hero && window.scrollY === 0) {
          hero.style.transform = "translate(-50%, -50%)";
          hero.style.opacity   = "1";
        }
      }, 250);
    },
    { passive: true }
  );

});
