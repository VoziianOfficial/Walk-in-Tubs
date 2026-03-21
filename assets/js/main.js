const body = document.body;
const header = document.querySelector(".site-header");
const nav = document.querySelector(".site-nav");
const navToggle = document.querySelector(".nav-toggle");
const faqButtons = document.querySelectorAll(".faq-question");
const forms = document.querySelectorAll("form[data-form-type]");
const revealTargets = document.querySelectorAll(".feature-card, .service-card, .detail-card, .contact-card, .contact-info-card, .service-overview-card, .step-card, .faq-item, .value-item, .quote-panel, .editorial-image");

if (header) {
  const syncHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 18);
  syncHeader();
  window.addEventListener("scroll", syncHeader);
}

if (nav && navToggle) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open", !expanded);
    body.classList.toggle("menu-open", !expanded);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      body.classList.remove("menu-open");
    });
  });
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
