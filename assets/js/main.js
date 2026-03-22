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

if (header) {
  const syncHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 18);
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
}

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

  const closeNav = () => {
    if (!mobilePanel) return;

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
  };

  const openNav = () => {
    if (!mobilePanel) return;

    mobilePanel.classList.add("is-open");
    mobilePanel.setAttribute("aria-hidden", "false");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    lockScroll();
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