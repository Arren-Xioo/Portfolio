document.addEventListener("DOMContentLoaded", () => {
  // --- TYPEWRITER ---
  const textElement = document.getElementById("typewriter");
  const phrases = ["FULL STACK DEVELOPER", "STI IT STUDENT", "CREATIVE CODER"];
  let i = 0,
    j = 0,
    deleting = false;

  function type() {
    if (!textElement) return;
    let current = phrases[i];
    textElement.innerHTML =
      current.substring(0, j) + '<span class="cursor">|</span>';

    if (!deleting) {
      j++;
      if (j === current.length) {
        deleting = true;
        setTimeout(type, 1500);
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

  // --- PARALLAX ---
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        let scroll = window.scrollY;
        let height = window.innerHeight;

        // Added Dynamic dampener to stop mobile from over-zooming/shaking
        let dampener = window.innerWidth < 768 ? 0.3 : 1;

        if (scroll <= height) {
          const knight = document.getElementById("nbg");
          const hero = document.querySelector(".hero-content");
          const castle = document.querySelector(".section1 img:first-child");

          if (knight) {
            knight.style.transform = `translate(${-scroll * 0.1 * dampener}px, ${scroll * 0.5 * dampener}px)`;
          }
          if (hero) {
            hero.style.transform = `translate(-50%, calc(-50% + ${scroll * 0.7 * dampener}px))`;
            hero.style.opacity = 1 - scroll / 700;
          }
          if (castle) {
            castle.style.transform = `translateY(${scroll * 0.1 * dampener}px) scale(${1 + scroll * 0.0004 * dampener})`;
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // --- SCROLL REVEAL ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        e.target.classList.toggle("active", e.isIntersecting);
      });
    },
    { threshold: 0.15 },
  );

  document
    .querySelectorAll(".reveal, .reveal-card, .about-container")
    .forEach((el, index) => {
      if (el.classList.contains("reveal-card")) {
        el.style.transitionDelay = `${(index % 4) * 0.1}s`;
      }
      observer.observe(el);
    });

  // --- PROJECT LOOP ---
  const train = document.getElementById("projectTrain");
  if (train) train.innerHTML += train.innerHTML;

  // --- UNIFIED MODAL LOGIC (Supports Single & Multiple Images) ---
  const modal = document.getElementById("certModal");
  const container = document.getElementById("modalImageContainer");
  const caption = document.getElementById("caption");

  const openModal = (rawData, title) => {
    if (!modal || !container) return;

    container.innerHTML = ""; // Clear previous images
    const images = rawData.split(",");

    images.forEach((path) => {
      const img = document.createElement("img");
      img.src = path.trim();
      img.className = "modal-content";
      img.style.display = "block";
      img.style.marginBottom = "20px";
      container.appendChild(img);
    });

    caption.innerText = title || "";
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (modal) modal.style.display = "none";
    document.body.style.overflow = "auto";
  };

  // Event Delegation for all triggers (Images and Buttons)
  document.addEventListener("click", (e) => {
    // Check if clicked element is a trigger or a button containing a trigger
    const trigger = e.target.closest(
      ".modal-trigger, .screenshot-btn, .view-cert-btn",
    );

    if (trigger) {
      const rawData = trigger.getAttribute("data-img") || trigger.src;
      const title =
        trigger.closest(".project-info, .cert-info")?.querySelector("h3")
          ?.innerText || trigger.alt;
      if (rawData) openModal(rawData, title);
    }
  });

  // Close Event Listeners
  document
    .querySelectorAll(".close-modal")
    .forEach((btn) => btn.addEventListener("click", closeModal));

  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // --- NAV ACTIVE LINK ---
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 150) {
        current = sec.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  });

  // --- AUTO CLOSE NAV ---
  const navCollapse = document.getElementById("navbarNav");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (
        window.innerWidth < 992 &&
        bootstrap.Collapse.getInstance(navCollapse)
      ) {
        bootstrap.Collapse.getInstance(navCollapse).hide();
      }
    });
  });
});
