// Mobile navigation toggle with accessible state updates.
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

// Close the mobile menu after selecting a navigation item.
document.querySelectorAll("#navLinks a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

// Reveal content when it enters the viewport. Respect reduced-motion preferences.
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

// Dynamic footer year.
const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

// Client-side contact form validation and mailto composition.
// This is a static-site form; it does not submit to a server.
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
const emailInput = document.getElementById("visitorEmail");

emailInput?.addEventListener("input", () => {
  emailInput.setCustomValidity("");
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    if (formNote) formNote.textContent = "Please complete all fields correctly before continuing.";
    return;
  }

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  // Prevent whitespace-only values from passing required validation.
  if (name.length < 2 || message.length < 10) {
    if (formNote) formNote.textContent = "Name must be at least 2 characters and message at least 10 characters.";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailInput.setCustomValidity("Enter a valid email address.");
    emailInput.reportValidity();
    return;
  }

  const recipient = "YOUR_EMAIL@example.com"; // Replace with your real email address before publishing.
  if (recipient.includes("YOUR_EMAIL")) {
    if (formNote) formNote.textContent = "Please update the recipient email in js/script.js before using this form.";
    return;
  }
  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  if (formNote) formNote.textContent = "Your email app should open with the message ready to send.";
});
