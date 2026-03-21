const aboutPanels = document.querySelectorAll(".values-section .feature-card");

aboutPanels.forEach((panel, index) => {
  panel.style.transitionDelay = `${index * 60}ms`;
});
