// ═══ CRITICAL: RUN IMMEDIATELY BEFORE ANY OTHER CODE ═══
// This must be the FIRST thing executed
(function () {
  // Disable scroll restoration
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  // Clear any hash from URL immediately
  if (window.location.hash) {
    const cleanUrl = window.location.pathname + window.location.search;
    history.replaceState(null, null, cleanUrl);
  }

  // Force scroll to top synchronously
  window.scrollTo(0, 0);

  // Prevent any initial scroll behavior
  const preventInitialScroll = function (e) {
    window.scrollTo(0, 0);
    e.preventDefault();
    return false;
  };

  // Block scroll events for a short period
  window.addEventListener("scroll", preventInitialScroll, {
    passive: false,
    once: false,
  });
  setTimeout(() => {
    window.removeEventListener("scroll", preventInitialScroll);
    window.scrollTo(0, 0);
  }, 500);
})();

// Main DOMContentLoaded event
document.addEventListener("DOMContentLoaded", () => {
  // Additional scroll reset
  window.scrollTo(0, 0);

  // Check if there's a valid hash that should be navigated to
  if (window.location.hash) {
    const hash = window.location.hash;
    // Clear hash again
    history.replaceState(
      null,
      null,
      window.location.pathname + window.location.search,
    );
    setTimeout(() => {
      history.replaceState(null, null, hash);
      const element = document.querySelector(hash);
      if (element) {
        // Only scroll if it's not the fun gallery or if it's explicitly linked
        // Skip auto-scrolling to fun gallery sections
        if (!hash.includes("fun") && !hash.includes("gallery")) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 100);
  }

  const isTouchDevice = () =>
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const isSmallScreen = () => window.innerWidth < 768;

  const useParallax = !isTouchDevice() && !isSmallScreen();

  // ─────────────────────────────────────────────
  //  FLIP CARDS (with keyboard support)
  // ─────────────────────────────────────────────
  const funCards = document.querySelectorAll(".fun-card");

  funCards.forEach((card) => {
    const img = card.querySelector("img");
    const name = card.dataset.name || "";
    const caption = card.dataset.caption || "";

    if (!img) return;

    const inner = document.createElement("div");
    inner.className = "fun-inner";

    const front = document.createElement("div");
    front.className = "fun-front";
    front.appendChild(img.cloneNode(true));

    const back = document.createElement("div");
    back.className = "fun-back";
    back.innerHTML = `<h3>${escapeHtml(name)}</h3><p>${escapeHtml(caption)}</p>`;

    inner.appendChild(front);
    inner.appendChild(back);

    card.innerHTML = "";
    card.appendChild(inner);
  });

  // Helper function to prevent XSS
  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Flip card on click/tap
  const flipCard = (card) => {
    const isAlreadyFlipped = card.classList.contains("flipped");

    funCards.forEach((otherCard) => {
      otherCard.classList.remove("flipped");
    });

    if (!isAlreadyFlipped) {
      card.classList.add("flipped");
    }
  };

  funCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      flipCard(card);
    });

    // Keyboard support: Enter and Space
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        flipCard(card);
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".fun-card")) {
      funCards.forEach((card) => {
        card.classList.remove("flipped");
      });
    }
  });

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
      current.substring(0, j) +
      '<span class="cursor" aria-hidden="true">|</span>';

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
  //  NAVBAR
  // ─────────────────────────────────────────────
  const parallaxHeader = document.querySelector(".parallax-header");

  function updateNavbar() {
    if (!parallaxHeader) return;
    parallaxHeader.classList.toggle("scrolled", window.scrollY > 60);
  }

  updateNavbar();

  // ─────────────────────────────────────────────
  //  PARALLAX
  // ─────────────────────────────────────────────
  const knight = document.getElementById("Knight");
  const hero = document.querySelector(".hero-content");
  const castle = document.querySelector("#castle");
  const section2 = document.querySelector(".section2");
  const section2Overlay = document.querySelector(".section2-light-overlay");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  let ticking = false;

  function handleScrollEffects() {
    const scroll = window.scrollY;
    const height = window.innerHeight;

    updateNavbar();

    if (scroll <= height) {
      if (useParallax) {
        if (knight) {
          const knightX = Math.round(-scroll * 0.15);
          const knightY = Math.round(scroll * 0.1);
          const knightScale = Math.max(1, 1 + scroll * 0.00055);
          knight.style.transform = `translate(${knightX}px, ${knightY}px) scale(${knightScale})`;
        }
        if (castle) {
          const castleY = scroll * 0.5;
          const castleScale = 1 + scroll * 0.0003;
          castle.style.transform = `translateY(${castleY}px) scale(${castleScale})`;
        }
        if (hero) {
          const heroY = scroll * 0.72;
          const heroScale = Math.max(0.8, 1 - scroll * 0.0004);
          hero.style.transform = `translate(-50%, calc(-50% + ${heroY}px)) scale(${heroScale})`;
        }
      }
      if (hero) hero.style.opacity = Math.max(0, 1 - scroll / 380);
    }

    if (section2) {
      const section2Start = Math.max(0, section2.offsetTop - height);
      const blendProgress = Math.min(
        1,
        Math.max(0, (scroll - section2Start) / (height * 1.15)),
      );

      if (useParallax) {
        const bgY = 50 - blendProgress * 40;
        section2.style.backgroundPosition = `center ${bgY}%`;
        if (section2Overlay) {
          const overlayY = blendProgress * -260;
          const overlayScale = 1 + blendProgress * 0.24;
          section2Overlay.style.transform = `translateY(${overlayY}px) scale(${overlayScale})`;
        }
      } else {
        section2.style.backgroundPosition = "top center";
        if (section2Overlay) {
          section2Overlay.style.transform = "none";
        }
      }
    }

    let current = "";
    sections.forEach((sec) => {
      if (scroll >= sec.offsetTop - 160) current = sec.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + current,
      );
    });

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(handleScrollEffects);
    },
    { passive: true },
  );

  handleScrollEffects();

  // ─────────────────────────────────────────────
  //  SCROLL REVEAL
  // ─────────────────────────────────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        e.target.classList.toggle("active", e.isIntersecting);
      });
    },
    { threshold: 0.1 },
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
  //  PROJECT CAROUSEL
  // ─────────────────────────────────────────────
  const train = document.getElementById("projectTrain");
  if (train) {
    train.innerHTML += train.innerHTML;
    if (isSmallScreen()) train.style.animationDuration = "28s";
  }

  // ─────────────────────────────────────────────
  //  UNIFIED MODAL (with JSON parsing)
  // ─────────────────────────────────────────────
  const modal = document.getElementById("certModal");
  const container = document.getElementById("modalImageContainer");
  const caption = document.getElementById("caption");

  const openModal = (rawData, title) => {
    if (!modal || !container) return;
    container.innerHTML = "";

    let imageArray = [];

    // Parse JSON array if available, otherwise fallback to split
    try {
      if (rawData.startsWith("[")) {
        imageArray = JSON.parse(rawData);
      } else {
        imageArray = rawData
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean);
      }
    } catch (e) {
      console.warn("Failed to parse modal data:", e);
      imageArray = rawData
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
    }

    imageArray.forEach((path) => {
      const img = document.createElement("img");
      img.src = path;
      img.className = "modal-content";
      img.alt = title || "Certificate or screenshot image";
      img.style.display = "block";
      img.style.marginBottom = "20px";
      container.appendChild(img);
    });

    if (caption) caption.innerText = title || "";
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    modal.querySelector(".close-modal")?.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.style.display = "none";
    document.body.style.overflow = "";
  };

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(
      ".modal-trigger, .screenshot-btn, .view-cert-btn",
    );
    if (!trigger) return;
    const rawData = trigger.getAttribute("data-img") || trigger.src || "";
    if (!rawData) return;
    const title =
      trigger.closest(".project-info, .cert-info")?.querySelector("h3")
        ?.innerText ||
      trigger.alt ||
      "";
    openModal(rawData, title);
  });

  document
    .querySelectorAll(".close-modal")
    .forEach((btn) => btn.addEventListener("click", closeModal));
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Swipe down to close
  if (modal) {
    let touchStartY = 0;
    modal.addEventListener(
      "touchstart",
      (e) => {
        touchStartY = e.touches[0].clientY;
      },
      { passive: true },
    );
    modal.addEventListener(
      "touchend",
      (e) => {
        if (e.changedTouches[0].clientY - touchStartY > 80) closeModal();
      },
      { passive: true },
    );
  }

  // ─────────────────────────────────────────────
  //  AUTO-CLOSE MOBILE NAV (with null check)
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
  //  RESIZE
  // ─────────────────────────────────────────────
  let resizeTimer;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (hero && window.scrollY === 0) {
          hero.style.transform = "translate(-50%, -50%)";
          hero.style.opacity = "1";
        }
      }, 250);
    },
    { passive: true },
  );

  // Final scroll reset after everything is loaded
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 0);

  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 50);

  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);

  window.addEventListener("load", function () {
    window.scrollTo(0, 0);
  });
});
