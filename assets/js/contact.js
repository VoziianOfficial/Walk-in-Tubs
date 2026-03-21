const messageField = document.querySelector('textarea[name="message"]');

if (messageField) {
  messageField.addEventListener("input", () => {
    messageField.style.minHeight = "140px";
  });
}
