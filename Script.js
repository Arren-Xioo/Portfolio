document.addEventListener("DOMContentLoaded", () => {
  // ─────────────────────────────────────────────
  //  DEVICE HELPERS
  // ─────────────────────────────────────────────
  const isTouchDevice = () =>
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const isSmallScreen = () => window.innerWidth < 768;

  const useParallax = !isTouchDevice() && !isSmallScreen();

  // ─────────────────────────────────────────────
  //  BUILD FUN GALLERY FLIP CARDS
  //  Reads each .fun-card's <img>, data-name, data-caption
  //  then injects the .fun-inner / .fun-front / .fun-back structure.
  //  The HTML stays clean — no nested divs needed there.
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
    back.innerHTML = `<h3>${name}</h3><p>${caption}</p>`;

    inner.appendChild(front);
    inner.appendChild(back);

    card.innerHTML = "";
    card.appendChild(inner);
  });

  // Touch tap — flip one card at a time on mobile/tablet
  if (isTouchDevice()) {
    funCards.forEach((card) => {
      card.addEventListener("click", () => {
        const isAlreadyFlipped = card.classList.contains("flipped");

        funCards.forEach((otherCard) => {
          otherCard.classList.remove("flipped");
        });

        if (!isAlreadyFlipped) {
          card.classList.add("flipped");
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
  }

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
    parallaxHeader.classList.toggle("scrolled", window.scrollY > 60);
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  // ─────────────────────────────────────────────
  //  PARALLAX (desktop only)
  // ─────────────────────────────────────────────
  const knight = document.getElementById("nbg");
  const hero = document.querySelector(".hero-content");
  const castle = document.querySelector(".section1 img:first-child");

  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const scroll = window.scrollY;
        const height = window.innerHeight;

        if (scroll <= height) {
          if (useParallax) {
            if (knight)
              knight.style.transform = `translate(${-scroll * 0.1}px, ${scroll * 0.5}px)`;
            if (castle)
              castle.style.transform = `translateY(${scroll * 0.1}px) scale(${
                1 + scroll * 0.0004
              })`;
            if (hero)
              hero.style.transform = `translate(-50%, calc(-50% + ${
                scroll * 0.7
              }px))`;
          }
          if (hero) hero.style.opacity = Math.max(0, 1 - scroll / 500);
        }

        ticking = false;
      });
      ticking = true;
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
  //  PROJECT CAROUSEL — duplicate for seamless loop
  // ─────────────────────────────────────────────
  const train = document.getElementById("projectTrain");
  if (train) {
    train.innerHTML += train.innerHTML;
    if (isSmallScreen()) train.style.animationDuration = "28s";
  }

  // ─────────────────────────────────────────────
  //  UNIFIED MODAL
  // ─────────────────────────────────────────────
  const modal = document.getElementById("certModal");
  const container = document.getElementById("modalImageContainer");
  const caption = document.getElementById("caption");

  const openModal = (rawData, title) => {
    if (!modal || !container) return;
    container.innerHTML = "";

    rawData
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
      .forEach((path) => {
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
    modal.querySelector(".close-modal")?.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.style.display = "none";
    document.body.style.overflow = "";
  };

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(
      ".modal-trigger, .screenshot-btn, .view-cert-btn"
    );
    if (!trigger) return;
    const rawData = trigger.getAttribute("data-img") || trigger.src || "";
    if (!rawData) return;
    const title =
      trigger.closest(".project-info, .cert-info")?.querySelector("h3")
        ?.innerText || trigger.alt || "";
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
      { passive: true }
    );
    modal.addEventListener(
      "touchend",
      (e) => {
        if (e.changedTouches[0].clientY - touchStartY > 80) closeModal();
      },
      { passive: true }
    );
  }

  // ─────────────────────────────────────────────
  //  NAV ACTIVE LINK
  // ─────────────────────────────────────────────
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener(
    "scroll",
    () => {
      let current = "";
      sections.forEach((sec) => {
        if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
      });
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === "#" + current
        );
      });
    },
    { passive: true }
  );

  // ─────────────────────────────────────────────
  //  AUTO-CLOSE MOBILE NAV
  // ─────────────────────────────────────────────
  const navCollapse = document.getElementById("navbarNav");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992 && navCollapse) {
        bootstrap.Collapse.getInstance(navCollapse)?.hide();
      }
    });
  });

  // ─────────────────────────────────────────────
  //  RESIZE — reset hero transform on orientation change
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
    { passive: true }
  );
});
