const serviceCards = document.querySelectorAll(".service-card");

serviceCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 40}ms`;
});
