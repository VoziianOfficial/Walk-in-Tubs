const body = document.body;
const header = document.querySelector(".site-header");
const nav = document.querySelector(".site-nav");
const navToggle = document.querySelector(".nav-toggle");
const headerActions = document.querySelector(".header-actions");
const footerLegal = document.querySelector(".footer-legal");
const faqButtons = document.querySelectorAll(".faq-question");
const forms = document.querySelectorAll("form[data-form-type]");
const revealTargets = document.querySelectorAll(".feature-card, .service-card, .detail-card, .contact-card, .contact-info-card, .service-overview-card, .step-card, .faq-item, .value-item, .quote-panel, .editorial-image");
const legalRootPrefix = window.location.pathname.includes("/services/") ? "../" : "";
const legalLinks = [
  { href: `${legalRootPrefix}terms-of-service.html`, label: "Terms" },
  { href: `${legalRootPrefix}privacy-policy.html`, label: "Privacy" },
  { href: `${legalRootPrefix}cookie-policy.html`, label: "Cookie Policy" },
];

if (header) {
  const syncHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 18);
  syncHeader();
  window.addEventListener("scroll", syncHeader);
}

if (nav && navToggle) {
  if (!nav.querySelector(".nav-menu-extra")) {
    const menuExtra = document.createElement("div");
    menuExtra.className = "nav-menu-extra";
    menuExtra.innerHTML = `
      <p>Contact</p>
      <a href="tel:+18885550194">(888) 555-0194</a>
      <a href="mailto:hello@walkintubguide.com">hello@walkintubguide.com</a>
      <span>1201 Peachtree Street NE, Atlanta, GA 30361</span>
    `;
    nav.appendChild(menuExtra);
  }

  const servicesLink = Array.from(nav.querySelectorAll(":scope > a")).find((link) => (link.getAttribute("href") || "").includes("services.html"));
  if (servicesLink && !nav.querySelector(".mobile-services-row")) {
    const servicesAnchorNext = servicesLink.nextElementSibling;
    const servicesRow = document.createElement("div");
    servicesRow.className = "mobile-services-row";

    servicesLink.classList.add("mobile-services-link");
    servicesRow.appendChild(servicesLink);

    const servicesToggle = document.createElement("button");
    servicesToggle.type = "button";
    servicesToggle.className = "mobile-services-toggle";
    servicesToggle.setAttribute("aria-expanded", "false");
    servicesToggle.setAttribute("aria-label", "Open services submenu");
    servicesToggle.innerHTML = `
      <svg viewBox="0 0 24 24" role="img" focusable="false" aria-hidden="true">
        <path d="M7 10l5 5 5-5" />
      </svg>
    `;
    servicesRow.appendChild(servicesToggle);
    nav.insertBefore(servicesRow, servicesAnchorNext);

    const servicesMenu = document.createElement("div");
    servicesMenu.className = "mobile-services-menu";
    servicesMenu.setAttribute("aria-label", "Services submenu");
    const serviceSubLinks = [
      { href: `${legalRootPrefix}services.html`, label: "All Services" },
      { href: `${legalRootPrefix}services/walk-in-tub-installation.html`, label: "Installation" },
      { href: `${legalRootPrefix}services/walk-in-tub-replacement.html`, label: "Replacement" },
      { href: `${legalRootPrefix}services/walk-in-tub-repair.html`, label: "Repair" },
      { href: `${legalRootPrefix}services/walk-in-tub-conversion.html`, label: "Conversion" },
      { href: `${legalRootPrefix}services/hydrotherapy-walk-in-tubs.html`, label: "Hydrotherapy" },
      { href: `${legalRootPrefix}services/accessible-bathroom-upgrades.html`, label: "Accessible Upgrades" },
    ];
    serviceSubLinks.forEach((item) => {
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.label;
      servicesMenu.appendChild(link);
    });
    servicesRow.insertAdjacentElement("afterend", servicesMenu);

    servicesToggle.addEventListener("click", () => {
      const expanded = servicesToggle.getAttribute("aria-expanded") === "true";
      servicesToggle.setAttribute("aria-expanded", String(!expanded));
      servicesToggle.setAttribute("aria-label", expanded ? "Open services submenu" : "Close services submenu");
      servicesMenu.classList.toggle("is-open", !expanded);
      servicesRow.classList.toggle("is-open", !expanded);
    });

    servicesLink.addEventListener("click", (event) => {
      if (window.innerWidth <= 980) {
        event.preventDefault();
        servicesToggle.click();
      }
    });
  }

  const closeNav = () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    nav.querySelectorAll(".mobile-services-toggle").forEach((toggle) => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open services submenu");
    });
    nav.querySelectorAll(".mobile-services-menu").forEach((submenu) => submenu.classList.remove("is-open"));
    nav.querySelectorAll(".mobile-services-row").forEach((row) => row.classList.remove("is-open"));
    body.classList.remove("menu-open");
  };

  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navToggle.setAttribute("aria-label", expanded ? "Open menu" : "Close menu");
    nav.classList.toggle("is-open", !expanded);
    body.classList.toggle("menu-open", !expanded);
  });

  nav.querySelectorAll("a:not(.mobile-services-link)").forEach((link) => {
    link.addEventListener("click", () => {
      closeNav();
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && nav.classList.contains("is-open")) {
      closeNav();
    }
  });
}

const swipeGridSelector = ".benefit-grid, .service-overview-grid, .steps-grid, .value-grid, .testimonials-grid, .service-grid";
const swipeGrids = document.querySelectorAll(swipeGridSelector);

const sliderState = new WeakMap();

const cleanupLoopTrack = (grid) => {
  const state = sliderState.get(grid);
  if (state?.onScroll) {
    grid.removeEventListener("scroll", state.onScroll);
  }
  if (state?.onDotClick && state?.pagination) {
    state.pagination.removeEventListener("click", state.onDotClick);
  }
  if (state?.pagination) {
    state.pagination.remove();
  }
  if (state?.clearSnapTimer) {
    state.clearSnapTimer();
  }
  sliderState.delete(grid);
  grid.querySelectorAll(".swipe-clone").forEach((clone) => clone.remove());
  grid.classList.remove("is-loop-track");
  grid.removeAttribute("tabindex");
  grid.removeAttribute("role");
  grid.removeAttribute("aria-label");
  grid.scrollLeft = 0;
  delete grid.dataset.loopReady;
};

const setupLoopTrack = (grid) => {
  if (grid.dataset.loopReady === "true") {
    return;
  }

  const originalSlides = Array.from(grid.children).filter((child) => !child.classList.contains("swipe-clone"));
  if (originalSlides.length < 2) {
    return;
  }

  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
  firstClone.classList.add("swipe-clone");
  lastClone.classList.add("swipe-clone");
  firstClone.setAttribute("aria-hidden", "true");
  lastClone.setAttribute("aria-hidden", "true");
  firstClone.querySelectorAll("a, button, input, select, textarea, [tabindex]").forEach((item) => item.setAttribute("tabindex", "-1"));
  lastClone.querySelectorAll("a, button, input, select, textarea, [tabindex]").forEach((item) => item.setAttribute("tabindex", "-1"));

  grid.appendChild(firstClone);
  grid.insertBefore(lastClone, grid.firstChild);
  grid.classList.add("is-loop-track");
  grid.dataset.loopReady = "true";
  grid.setAttribute("tabindex", "0");
  grid.setAttribute("role", "region");
  grid.setAttribute("aria-label", "Swipe cards");

  const slideStep = () => {
    const firstReal = Array.from(grid.children).find((child) => !child.classList.contains("swipe-clone"));
    if (!firstReal) {
      return 0;
    }
    const gapRaw = window.getComputedStyle(grid).columnGap || window.getComputedStyle(grid).gap || "0px";
    const gap = Number.parseFloat(gapRaw) || 0;
    return firstReal.getBoundingClientRect().width + gap;
  };

  requestAnimationFrame(() => {
    const step = slideStep();
    if (step > 0) {
      grid.scrollLeft = step;
    }
  });

  const pagination = document.createElement("div");
  pagination.className = "swipe-pagination";
  pagination.setAttribute("aria-label", "Slider pagination");
  originalSlides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "swipe-dot";
    dot.setAttribute("aria-label", `Go to card ${index + 1}`);
    dot.dataset.index = String(index);
    pagination.appendChild(dot);
  });
  grid.insertAdjacentElement("afterend", pagination);

  const updatePagination = () => {
    const step = slideStep();
    if (step <= 0) {
      return;
    }
    const totalReal = originalSlides.length;
    const normalized = ((grid.scrollLeft / step) - 1 + totalReal) % totalReal;
    const activeIndex = Math.round(normalized) % totalReal;
    pagination.querySelectorAll(".swipe-dot").forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
      dot.setAttribute("aria-current", index === activeIndex ? "true" : "false");
    });
  };

  const onDotClick = (event) => {
    const target = event.target.closest(".swipe-dot");
    if (!target) {
      return;
    }
    const step = slideStep();
    const targetIndex = Number.parseInt(target.dataset.index || "0", 10);
    if (step > 0) {
      grid.scrollTo({
        left: step * (targetIndex + 1),
        behavior: "smooth",
      });
    }
  };
  pagination.addEventListener("click", onDotClick);

  let isAdjusting = false;
  let snapTimer = null;
  const onScroll = () => {
    if (!grid.classList.contains("swipe-track")) {
      return;
    }
    if (isAdjusting) {
      return;
    }

    const step = slideStep();
    if (step <= 0) {
      return;
    }

    const totalReal = originalSlides.length;
    const leftBoundary = step * 0.35;
    const rightBoundary = step * (totalReal + 0.65);

    if (grid.scrollLeft <= leftBoundary) {
      isAdjusting = true;
      grid.scrollLeft = step * totalReal;
      requestAnimationFrame(() => {
        isAdjusting = false;
        updatePagination();
      });
    } else if (grid.scrollLeft >= rightBoundary) {
      isAdjusting = true;
      grid.scrollLeft = step;
      requestAnimationFrame(() => {
        isAdjusting = false;
        updatePagination();
      });
    }
    if (snapTimer) {
      window.clearTimeout(snapTimer);
    }
    snapTimer = window.setTimeout(() => {
      if (!grid.classList.contains("swipe-track") || isAdjusting) {
        return;
      }
      const snapIndex = Math.round(grid.scrollLeft / step);
      grid.scrollTo({
        left: snapIndex * step,
        behavior: "smooth",
      });
    }, 120);
    updatePagination();
  };
  grid.addEventListener("scroll", onScroll, { passive: true });

  sliderState.set(grid, {
    pagination,
    onDotClick,
    onScroll,
    clearSnapTimer: () => {
      if (snapTimer) {
        window.clearTimeout(snapTimer);
        snapTimer = null;
      }
    },
  });
  updatePagination();
};

const syncMobileSwipers = () => {
  const isMobile = window.innerWidth <= 720;
  swipeGrids.forEach((grid) => {
    const disableSwipe = grid.classList.contains("editorial-values");
    const cardCount = Array.from(grid.children).filter((child) => !child.classList.contains("swipe-clone") && child.matches("article, a, div, li")).length;
    if (isMobile && cardCount > 2 && !disableSwipe) {
      grid.classList.add("swipe-track");
      setupLoopTrack(grid);
    } else {
      grid.classList.remove("swipe-track");
      cleanupLoopTrack(grid);
    }
  });
};

syncMobileSwipers();
window.addEventListener("resize", syncMobileSwipers);

if (headerActions && !headerActions.querySelector(".header-email.desktop-email")) {
  const desktopEmail = document.createElement("a");
  desktopEmail.className = "header-email desktop-email";
  desktopEmail.href = "mailto:hello@walkintubguide.com?subject=Request%20Estimate";
  desktopEmail.innerHTML = '<span class="header-email-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="img" focusable="false"><path d="M3 7l9 6 9-6" /><rect x="3" y="6" width="18" height="12" rx="2" /></svg></span><span>Request Estimate</span>';

  const mobileEmail = document.createElement("a");
  mobileEmail.className = "header-email mobile-email";
  mobileEmail.href = desktopEmail.href;
  mobileEmail.setAttribute("aria-label", "Request estimate by email");
  mobileEmail.innerHTML = '<span class="header-email-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="img" focusable="false"><path d="M3 7l9 6 9-6" /><rect x="3" y="6" width="18" height="12" rx="2" /></svg></span>';

  headerActions.insertBefore(desktopEmail, navToggle || null);
  headerActions.insertBefore(mobileEmail, desktopEmail);
}

if (footerLegal && !footerLegal.querySelector(".legal-links")) {
  const legalNav = document.createElement("nav");
  legalNav.className = "legal-links";
  legalNav.setAttribute("aria-label", "Legal pages");
  legalLinks.forEach((item) => {
    const link = document.createElement("a");
    link.href = item.href;
    link.textContent = item.label;
    legalNav.appendChild(link);
  });
  footerLegal.appendChild(legalNav);
}

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    item.classList.toggle("is-open", !expanded);
  });
});

forms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    if (button) {
      button.textContent = "Request Sent";
      button.disabled = true;
    }
    form.insertAdjacentHTML("beforeend", '<p class="form-note">Thanks. Your request has been recorded for provider matching review.</p>');
  }, { once: true });
});

const cookieStorageKey = "bp_cookie_consent_v1";

if (!window.localStorage.getItem(cookieStorageKey)) {
  const cookieBanner = document.createElement("aside");
  cookieBanner.className = "cookie-consent";
  cookieBanner.setAttribute("role", "dialog");
  cookieBanner.setAttribute("aria-label", "Cookie consent");
  cookieBanner.innerHTML = `
    <div class="cookie-consent-content">
      <p>We use cookies to improve site performance, remember your preferences, and support a smoother browsing experience.</p>
      <nav class="cookie-consent-links" aria-label="Cookie legal links">
        <a href="${legalLinks[0].href}">Terms</a>
        <a href="${legalLinks[1].href}">Privacy</a>
        <a href="${legalLinks[2].href}">Cookie Policy</a>
      </nav>
      <div class="cookie-consent-actions">
        <button type="button" class="btn btn-secondary cookie-btn-decline">Decline</button>
        <button type="button" class="btn btn-primary cookie-btn-accept">Accept</button>
      </div>
    </div>
  `;

  body.appendChild(cookieBanner);
  body.classList.add("cookie-banner-visible");

  const syncCookieOffset = () => {
    body.style.setProperty("--cookie-banner-height", `${cookieBanner.offsetHeight}px`);
  };
  syncCookieOffset();
  window.addEventListener("resize", syncCookieOffset);

  const finishCookieChoice = (value) => {
    window.localStorage.setItem(cookieStorageKey, value);
    cookieBanner.remove();
    body.classList.remove("cookie-banner-visible");
    body.style.removeProperty("--cookie-banner-height");
    window.removeEventListener("resize", syncCookieOffset);
  };

  cookieBanner.querySelector(".cookie-btn-accept")?.addEventListener("click", () => finishCookieChoice("accepted"));
  cookieBanner.querySelector(".cookie-btn-decline")?.addEventListener("click", () => finishCookieChoice("declined"));
}

if ("IntersectionObserver" in window) {
  revealTargets.forEach((target, index) => {
    target.classList.add("page-reveal");
    target.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.14,
    rootMargin: "0px 0px -8% 0px",
  });
  revealTargets.forEach((target) => observer.observe(target));
}

body.classList.add("is-ready");
