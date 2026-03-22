const body = document.body;
const header = document.querySelector(".site-header");
const nav = document.querySelector(".site-nav");
const navToggle = document.querySelector(".nav-toggle");
const footerLegal = document.querySelector(".footer-legal");
const faqButtons = document.querySelectorAll(".faq-question");
const forms = document.querySelectorAll("form[data-form-type]");
const revealTargets = document.querySelectorAll(
  ".feature-card, .service-card, .detail-card, .contact-card, .contact-info-card, .service-overview-card, .step-card, .faq-item, .value-item, .quote-panel, .editorial-image"
);

const legalRootPrefix = window.location.pathname.includes("/services/") ? "../" : "";
const legalLinks = [
  { href: `${legalRootPrefix}terms-of-service.html`, label: "Terms" },
  { href: `${legalRootPrefix}privacy-policy.html`, label: "Privacy" },
  { href: `${legalRootPrefix}cookie-policy.html`, label: "Cookie Policy" },
];

const brandMarks = document.querySelectorAll(".brand-mark");

const bathLogoIcon = `
  <svg viewBox="0 0 24 24" role="img" focusable="false" aria-hidden="true">
    <path d="M3.5 11.2h17" />
    <path d="M5.1 12.3l.7 5a2.3 2.3 0 0 0 2.2 2h8a2.3 2.3 0 0 0 2.2-2l.7-5" />
    <path d="M8.2 19.6h7.6" />
    <path d="M15.8 11.2V6.5a1.7 1.7 0 0 1 1.7-1.7h.8a1.3 1.3 0 0 1 1.3 1.3v.9" />
    <path d="M18.1 8.3h1.5" />
    <path d="M14.2 8.1v.4M13.3 8.9v.4M15.1 8.9v.4M14.2 9.7v.4" />
  </svg>
`;

brandMarks.forEach((mark) => {
  mark.innerHTML = bathLogoIcon;
  mark.setAttribute("aria-hidden", "true");
});

document.querySelectorAll(".mobile-menu-brand").forEach((brandLink) => {
  if (brandLink.querySelector(".mobile-menu-brand-icon")) return;

  const label = (brandLink.textContent || "").trim();
  brandLink.textContent = "";

  const icon = document.createElement("span");
  icon.className = "mobile-menu-brand-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = bathLogoIcon;

  const text = document.createElement("span");
  text.className = "mobile-menu-brand-text";
  text.textContent = label || "Bathing Pro";

  brandLink.appendChild(icon);
  brandLink.appendChild(text);
});

document.querySelectorAll(".header-actions").forEach((actions) => {
  if (actions.querySelector(".header-ask")) return;

  const ask = document.createElement("a");
  ask.className = "header-ask";
  ask.href = `${legalRootPrefix}contact.html#contact-form`;
  ask.setAttribute("aria-label", "Ask a question");
  ask.innerHTML = `
    <svg viewBox="0 0 24 24" role="img" focusable="false" aria-hidden="true">
      <path d="M21 15a4 4 0 0 1-4 4H9l-4 2v-2a4 4 0 0 1-2-3.5V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      <path d="M10.3 9.1a2.2 2.2 0 0 1 4 1c0 1.4-1.4 1.8-1.9 2.4-.2.2-.3.5-.3.9" />
      <path d="M12 16.9h.01" />
    </svg>
    <span>Ask a Question</span>
  `;

  const desktopPhone = actions.querySelector(".desktop-phone");
  const navToggleButton = actions.querySelector(".nav-toggle");

  if (desktopPhone) {
    desktopPhone.insertAdjacentElement("afterend", ask);
  } else if (navToggleButton) {
    navToggleButton.insertAdjacentElement("beforebegin", ask);
  } else {
    actions.appendChild(ask);
  }
});

if (header) {
  const syncHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 18);
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
}

const normalizePathname = (pathname) => {
  if (!pathname) return "";
  const stripped = pathname.split("?")[0].split("#")[0];
  return stripped.endsWith("/") ? `${stripped}index.html` : stripped;
};

const setActiveNav = () => {
  const currentPath = normalizePathname(window.location.pathname);
  const currentLeaf = currentPath.split("/").pop() || "index.html";
  const isServiceDetail = currentPath.includes("/services/");

  const navLinks = document.querySelectorAll(".site-nav a, .mobile-menu-nav > a");
  navLinks.forEach((link) => {
    link.classList.remove("is-active");
    link.removeAttribute("aria-current");
  });

  const pickTargetLeaf = () => {
    if (isServiceDetail) return "services.html";
    if (currentLeaf === "") return "index.html";
    return currentLeaf;
  };

  const targetLeaf = pickTargetLeaf();
  const candidates = Array.from(navLinks).filter((link) => {
    try {
      const linkPath = normalizePathname(new URL(link.getAttribute("href"), window.location.href).pathname);
      const linkLeaf = linkPath.split("/").pop();
      return linkLeaf === targetLeaf;
    } catch {
      return false;
    }
  });

  const activeLink = candidates[0];
  if (activeLink) {
    activeLink.classList.add("is-active");
    activeLink.setAttribute("aria-current", "page");
  }
};

setActiveNav();

if (nav && navToggle) {
  const mobilePanel = document.getElementById("mobile-menu-panel");
  const mobileCloseButton = mobilePanel?.querySelector(".mobile-menu-close");
  const accordionToggle = mobilePanel?.querySelector(".mobile-menu-accordion-toggle");
  const accordionPanel = mobilePanel?.querySelector(".mobile-menu-accordion-panel");

  let scrollY = 0;

  const lockScroll = () => {
    scrollY = window.scrollY || window.pageYOffset;
    body.classList.add("menu-open");
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
  };

  const unlockScroll = () => {
    body.classList.remove("menu-open");
    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    window.scrollTo(0, scrollY);
  };

  const iconMap = {
    home: '<svg viewBox="0 0 24 24" role="img" focusable="false"><path d="M4 10l8-6 8 6v9H4z" /><path d="M9 19v-5h6v5" /></svg>',
    services: '<svg viewBox="0 0 24 24" role="img" focusable="false"><path d="M5 7h14" /><path d="M5 12h14" /><path d="M5 17h14" /></svg>',
    about: '<svg viewBox="0 0 24 24" role="img" focusable="false"><circle cx="12" cy="8" r="3" /><path d="M5 20c1.2-3.2 3.5-5 7-5s5.8 1.8 7 5" /></svg>',
    contact: '<svg viewBox="0 0 24 24" role="img" focusable="false"><path d="M3 7l9 6 9-6" /><rect x="3" y="6" width="18" height="12" rx="2" /></svg>',
    all: '<svg viewBox="0 0 24 24" role="img" focusable="false"><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></svg>',
    install: '<svg viewBox="0 0 24 24" role="img" focusable="false"><path d="M4 12h16" /><path d="M12 4v16" /></svg>',
    replace: '<svg viewBox="0 0 24 24" role="img" focusable="false"><path d="M4 12h16" /><path d="M14 6l6 6-6 6" /></svg>',
    repair: '<svg viewBox="0 0 24 24" role="img" focusable="false"><path d="M14 7l3-3 3 3-3 3-3-3z" /><path d="M3 21l8-8" /></svg>',
    safety: '<svg viewBox="0 0 24 24" role="img" focusable="false"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" /></svg>',
    maintenance: '<svg viewBox="0 0 24 24" role="img" focusable="false"><path d="M12 8v4l3 2" /><circle cx="12" cy="12" r="8" /></svg>',
    consult: '<svg viewBox="0 0 24 24" role="img" focusable="false"><path d="M3 7l9 6 9-6" /><rect x="3" y="6" width="18" height="12" rx="2" /></svg>',
  };

  const ensureMenuIcon = (el, key) => {
    if (!el || el.querySelector(".mobile-menu-link-icon")) return;
    const label = (el.textContent || "").trim();
    el.textContent = "";

    const icon = document.createElement("span");
    icon.className = "mobile-menu-link-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = iconMap[key] || iconMap.services;

    const text = document.createElement("span");
    text.className = "mobile-menu-link-text";
    text.textContent = label;

    el.appendChild(icon);
    el.appendChild(text);
  };

  if (accordionPanel && !accordionPanel.querySelector(".mobile-menu-all-services")) {
    const allServices = document.createElement("a");
    allServices.href = `${legalRootPrefix}services.html`;
    allServices.className = "mobile-menu-all-services";
    allServices.textContent = "All Services";
    accordionPanel.prepend(allServices);
  }

  ensureMenuIcon(mobilePanel?.querySelector('.mobile-menu-nav > a[href*="index.html"]'), "home");
  ensureMenuIcon(mobilePanel?.querySelector('.mobile-menu-nav > a[href*="about.html"]'), "about");
  ensureMenuIcon(mobilePanel?.querySelector('.mobile-menu-nav > a[href*="contact.html"]'), "contact");
  ensureMenuIcon(mobilePanel?.querySelector(".mobile-menu-all-services"), "all");
  ensureMenuIcon(mobilePanel?.querySelector('.mobile-menu-accordion-panel a[href*="walk-in-tub-installation"]'), "install");
  ensureMenuIcon(mobilePanel?.querySelector('.mobile-menu-accordion-panel a[href*="walk-in-tub-replacement"]'), "replace");
  ensureMenuIcon(mobilePanel?.querySelector('.mobile-menu-accordion-panel a[href*="walk-in-tub-repair"]'), "repair");
  ensureMenuIcon(mobilePanel?.querySelector('.mobile-menu-accordion-panel a[href*="bathtub-safety-modifications"]'), "safety");
  ensureMenuIcon(mobilePanel?.querySelector('.mobile-menu-accordion-panel a[href*="contact.html"]'), "consult");

  const maintenanceLink = Array.from(mobilePanel?.querySelectorAll(".mobile-menu-accordion-panel a") || []).find(
    (link) => (link.textContent || "").includes("Maintenance")
  );
  ensureMenuIcon(maintenanceLink, "maintenance");

  if (accordionToggle && !accordionToggle.querySelector(".mobile-menu-link-icon")) {
    const label = accordionToggle.querySelector("span");
    const icon = document.createElement("span");
    icon.className = "mobile-menu-link-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = iconMap.services;

    if (label) {
      const wrap = document.createElement("span");
      wrap.className = "mobile-menu-link-label";
      label.before(wrap);
      wrap.appendChild(icon);
      wrap.appendChild(label);
    }
  }

  const openNav = () => {
    if (!mobilePanel) return;

    mobilePanel.classList.add("is-open");
    mobilePanel.setAttribute("aria-hidden", "false");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    lockScroll();

    requestAnimationFrame(() => {
      mobileCloseButton?.focus();
    });
  };

  const closeNav = () => {
    if (!mobilePanel) return;

    const focusedInsideMenu =
      mobilePanel.contains(document.activeElement) ? document.activeElement : null;

    if (focusedInsideMenu && typeof focusedInsideMenu.blur === "function") {
      focusedInsideMenu.blur();
    }

    mobilePanel.classList.remove("is-open");
    mobilePanel.setAttribute("aria-hidden", "true");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");

    if (accordionToggle && accordionPanel) {
      accordionToggle.setAttribute("aria-expanded", "false");
      accordionPanel.setAttribute("aria-hidden", "true");
      accordionPanel.classList.remove("is-open");
    }

    unlockScroll();

    requestAnimationFrame(() => {
      navToggle.focus();
    });
  };

  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    if (expanded) {
      closeNav();
    } else {
      openNav();
    }
  });

  mobileCloseButton?.addEventListener("click", closeNav);

  mobilePanel?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeNav();
    });
  });

  accordionToggle?.addEventListener("click", () => {
    if (!accordionPanel) return;

    const expanded = accordionToggle.getAttribute("aria-expanded") === "true";
    accordionToggle.setAttribute("aria-expanded", String(!expanded));
    accordionPanel.classList.toggle("is-open", !expanded);
    accordionPanel.setAttribute("aria-hidden", expanded ? "true" : "false");
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobilePanel?.classList.contains("is-open")) {
      closeNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && mobilePanel?.classList.contains("is-open")) {
      closeNav();
    }
  });
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
    item?.classList.toggle("is-open", !expanded);
  });
});

forms.forEach((form) => {
  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const button = form.querySelector('button[type="submit"]');
      if (button) {
        button.textContent = "Request Sent";
        button.disabled = true;
      }

      if (!form.querySelector(".form-note.is-success")) {
        form.insertAdjacentHTML(
          "beforeend",
          '<p class="form-note is-success">Thanks. Your request has been recorded for provider matching review.</p>'
        );
      }
    },
    { once: true }
  );
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

  cookieBanner
    .querySelector(".cookie-btn-accept")
    ?.addEventListener("click", () => finishCookieChoice("accepted"));

  cookieBanner
    .querySelector(".cookie-btn-decline")
    ?.addEventListener("click", () => finishCookieChoice("declined"));
}

if ("IntersectionObserver" in window) {
  revealTargets.forEach((target, index) => {
    target.classList.add("page-reveal");
    target.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealTargets.forEach((target) => observer.observe(target));
}

body.classList.add("is-ready");