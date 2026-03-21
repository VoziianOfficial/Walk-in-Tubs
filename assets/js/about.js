const aboutRevealTargets = document.querySelectorAll(
  ".story-intro, .story-copy, .about-image-panel, .philosophy-card, .process-panel, .callout-grid"
);
const aboutMediaPanels = document.querySelectorAll(".about-image-panel, .process-image-panel");

aboutRevealTargets.forEach((target, index) => {
  target.classList.add("page-reveal");
  target.style.transitionDelay = `${Math.min(index, 5) * 80}ms`;
});

if ("IntersectionObserver" in window) {
  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        aboutObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px",
  });

  aboutRevealTargets.forEach((target) => aboutObserver.observe(target));
} else {
  aboutRevealTargets.forEach((target) => target.classList.add("is-visible"));
}

aboutMediaPanels.forEach((panel) => {
  panel.addEventListener("mousemove", (event) => {
    if (window.innerWidth < 981) {
      return;
    }

    const rect = panel.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    panel.style.transform = `translateY(-4px) rotateX(${(-offsetY * 1.2).toFixed(2)}deg) rotateY(${(offsetX * 1.5).toFixed(2)}deg)`;
  });

  panel.addEventListener("mouseleave", () => {
    panel.style.transform = "";
  });

  panel.addEventListener("focusin", () => {
    panel.style.transform = "translateY(-4px)";
  });

  panel.addEventListener("focusout", () => {
    panel.style.transform = "";
  });
});
