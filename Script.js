(function () {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  if (window.location.hash) {
    const cleanUrl = window.location.pathname + window.location.search;
    history.replaceState(null, null, cleanUrl);
  }

  window.scrollTo(0, 0);

  const preventInitialScroll = function (e) {
    window.scrollTo(0, 0);
    e.preventDefault();
    return false;
  };

  window.addEventListener("scroll", preventInitialScroll, {
    passive: false,
    once: false,
  });
  setTimeout(() => {
    window.removeEventListener("scroll", preventInitialScroll);
    window.scrollTo(0, 0);
  }, 500);
})();

document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0);

  if (window.location.hash) {
    const hash = window.location.hash;
    history.replaceState(
      null,
      null,
      window.location.pathname + window.location.search,
    );
  }

  const isTouchDevice = () =>
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const isSmallScreen = () => window.innerWidth < 768;

  const useParallax = !isTouchDevice() && !isSmallScreen();

  // ─────────────────────────────────────────────
  //  FLIP CARDS
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

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Flip card on click
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
  const castle = document.querySelector("Castle");
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
          const heroY = scroll * 0.75;
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
  //  PROJECT CAROUSEL (TRAIN ANIMATION)
  // ─────────────────────────────────────────────
  const train = document.getElementById("projectTrain");
  const projectWindow = document.querySelector(".project-window");

  if (train) {
    Array.from(train.children).forEach((card) => {
      card.dataset.original = "true";
    });
  }

  function getOriginalProjectCards() {
    if (!train) return [];
    return Array.from(
      train.querySelectorAll('.project-card-horizontal[data-original="true"]'),
    );
  }

  function cleanupProjectClones() {
    if (!train) return;
    Array.from(
      train.querySelectorAll('.project-card-horizontal[data-clone="true"]'),
    ).forEach((clone) => clone.remove());
  }

  function resetProjectCardStyles(cards) {
    cards.forEach((card) => {
      card.style.width = "";
      card.style.minWidth = "";
      card.style.flexShrink = "";
      card.style.flexDirection = "";
    });
  }

  function setupProjectCarousel() {
    if (!train) return;

    const isMobile = window.innerWidth < 768;

    cleanupProjectClones();

    const originalCards = getOriginalProjectCards();
    if (!originalCards.length) return;

    // Stop any existing animation
    train.style.animation = "none";
    train.style.width = "";
    train.style.transform = "none";
    train.style.display = "flex";
    train.style.flexWrap = "nowrap";

    resetProjectCardStyles(originalCards);

    // Clear existing clones and content
    train.innerHTML = "";

    const cloneCount = 5;

    for (let i = 0; i < cloneCount; i++) {
      originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.dataset.clone = "true";
        if (i === 0) {
          clone.dataset.original = "true";
        }
        train.appendChild(clone);
      });
    }

    const allCards = Array.from(
      train.querySelectorAll(".project-card-horizontal"),
    );

    let totalWidth = 0;
    allCards.forEach((card) => {
      totalWidth += card.offsetWidth;
    });

    const gap = isMobile ? 20 : 40;
    totalWidth += (allCards.length - 1) * gap;

    train.style.width = `${totalWidth}px`;
    train.style.transform = "translateX(0)";

    const singleSetWidth = totalWidth / cloneCount;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
    @keyframes seamlessLoop {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-${singleSetWidth}px);
      }
    }
  `;
    document.head.appendChild(styleSheet);

    train.style.animation = `seamlessLoop ${isMobile ? 20 : 35}s linear infinite`;
    train.style.animationPlayState = "running";

    if (!isMobile) {
      train.style.gap = "40px";
      train.style.padding = "10px 0";

      if (projectWindow) {
        projectWindow.style.overflow = "hidden";
        projectWindow.style.overflowX = "hidden";
        projectWindow.style.overflowY = "hidden";
        projectWindow.style.webkitOverflowScrolling = "";
        projectWindow.style.maskImage =
          "linear-gradient(to right, transparent, black 5%, black 95%, transparent)";
        projectWindow.style.webkitMaskImage =
          "linear-gradient(to right, transparent, black 5%, black 95%, transparent)";
        projectWindow.style.padding = "50px 0";
      }

      allCards.forEach((card) => {
        card.style.flexShrink = "0";
        card.style.width = "min(800px, calc(100vw - 48px))";
        card.style.minWidth = "";
        card.style.flexDirection = "";
      });
    } else {
      train.style.flexDirection = "row";
      train.style.gap = "20px";
      train.style.padding = "10px 20px";

      if (projectWindow) {
        projectWindow.style.overflow = "hidden";
        projectWindow.style.overflowX = "hidden";
        projectWindow.style.overflowY = "hidden";
        projectWindow.style.webkitOverflowScrolling = "";
        projectWindow.style.maskImage = "none";
        projectWindow.style.webkitMaskImage = "none";
        projectWindow.style.padding = "20px 0";
      }

      allCards.forEach((card) => {
        card.style.width = "280px";
        card.style.minWidth = "280px";
        card.style.flexShrink = "0";
        card.style.flexDirection = "column";
      });
    }
  }

  // Initial setup
  setupProjectCarousel();

  let carouselResizeTimer;
  let carouselResizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(carouselResizeTimeout);
    carouselResizeTimeout = setTimeout(() => {
      setupProjectCarousel();
    }, 250);
  });

  // ─────────────────────────────────────────────
  //  UNIFIED MODAL
  // ─────────────────────────────────────────────
  const modal = document.getElementById("certModal");
  const container = document.getElementById("modalImageContainer");
  const caption = document.getElementById("caption");

  const openModal = (rawData, title) => {
    if (!modal || !container) return;
    container.innerHTML = "";

    let imageArray = [];

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
      img.onerror = () => {
        img.alt = `[Image not found: ${path}]`;
        img.style.opacity = "0.6";
        img.style.minHeight = "100px";
        img.style.display = "flex";
        img.style.alignItems = "center";
        img.style.justifyContent = "center";
        img.style.backgroundColor = "rgba(0,0,0,0.5)";
      };

      container.appendChild(img);
    });

    if (imageArray.length === 0) {
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "No images to display.";
      errorMsg.style.color = "white";
      errorMsg.style.padding = "20px";
      container.appendChild(errorMsg);
    }

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
  //  AUTO-CLOSE MOBILE NAV
  // ─────────────────────────────────────────────
  const navCollapse = document.getElementById("navbarNav");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (
        window.innerWidth < 992 &&
        navCollapse &&
        window.bootstrap?.Collapse
      ) {
        const bsCollapse =
          bootstrap.Collapse.getInstance(navCollapse) ||
          new bootstrap.Collapse(navCollapse, { toggle: false });
        bsCollapse.hide();
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
