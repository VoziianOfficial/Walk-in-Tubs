const homeLead = document.querySelector('#lead-form .lead-form select[name="service"]');

if (homeLead) {
  homeLead.addEventListener("change", () => {
    homeLead.style.borderColor = homeLead.value ? "rgba(15, 122, 114, 0.35)" : "";
  });
}
