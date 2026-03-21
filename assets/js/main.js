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

  const closeNav = () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    body.classList.remove("menu-open");
  };

  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navToggle.setAttribute("aria-label", expanded ? "Open menu" : "Close menu");
    nav.classList.toggle("is-open", !expanded);
    body.classList.toggle("menu-open", !expanded);
  });

  nav.querySelectorAll("a").forEach((link) => {
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

const syncMobileSwipers = () => {
  const isMobile = window.innerWidth <= 720;
  swipeGrids.forEach((grid) => {
    const cardCount = Array.from(grid.children).filter((child) => child.matches("article, a, div, li")).length;
    if (isMobile && cardCount > 2) {
      grid.classList.add("swipe-track");
    } else {
      grid.classList.remove("swipe-track");
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
