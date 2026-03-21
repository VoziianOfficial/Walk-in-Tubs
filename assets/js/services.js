const serviceCards = document.querySelectorAll(".service-card");
const servicesHero = document.querySelector(".services-hero");

serviceCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 45}ms`;
  card.style.setProperty("--service-index", index + 1);

  const targetHref = card.dataset.href;

  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) rotateX(${(-offsetY * 1.4).toFixed(2)}deg) rotateY(${(offsetX * 1.8).toFixed(2)}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });

  card.addEventListener("focusin", () => {
    card.classList.add("is-lit");
  });

  card.addEventListener("focusout", () => {
    card.classList.remove("is-lit");
  });

  if (targetHref) {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) {
        return;
      }
      window.location.href = targetHref;
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        window.location.href = targetHref;
      }
    });
  }
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-lit");
      } else {
        entry.target.classList.remove("is-lit");
      }
    });
  }, { threshold: 0.35 });

  serviceCards.forEach((card) => observer.observe(card));
}

if (servicesHero) {
  servicesHero.classList.add("is-loaded");
}
