const CONTACT_CONFIG = {
  email: "essess_43@rediffmail.com",
  whatsappNumber: "919674547653",
  mapQuery: "12 B, Prabhu Ram Sankar Lane, Kolkata, West Bengal 700046, India",
  socialLinks: {
    whatsapp: "https://wa.me/919674547653"
  }
};

function buildWhatsAppUrl(message) {
  return `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function buildEnquiryMessage(data) {
  return [
    "New enquiry from the website",
    "",
    `Full Name: ${data.fullName}`,
    `Company Email: ${data.email}`,
    `Company Name: ${data.company}`,
    `Inquiry Type: ${data.inquiryType}`,
    "Message:",
    data.message
  ].join("\n");
}

function readEnquiryData(form) {
  const formData = new FormData(form);
  return {
    fullName: (formData.get("fullName") || "").toString().trim(),
    email: (formData.get("email") || "").toString().trim(),
    company: (formData.get("company") || "").toString().trim(),
    inquiryType: (formData.get("inquiryType") || "").toString().trim(),
    message: (formData.get("message") || "").toString().trim()
  };
}

function validateEnquiry(data) {
  return Boolean(
    data.fullName &&
    data.email &&
    data.company &&
    data.inquiryType &&
    data.message
  );
}

function setStatus(text, isError = false) {
  const status = document.getElementById("enquiry-status");
  if (!status) return;
  status.textContent = text;
  status.classList.toggle("text-error", isError);
  status.classList.toggle("text-secondary", !isError);
}

function wireContactActions() {
  document.querySelectorAll("[data-contact-email]").forEach((node) => {
    node.setAttribute("href", `mailto:${CONTACT_CONFIG.email}`);
  });

  document.querySelectorAll("[data-contact-phone]").forEach((node) => {
    node.setAttribute("href", `tel:+${CONTACT_CONFIG.whatsappNumber}`);
  });

  document.querySelectorAll("[data-map-link]").forEach((node) => {
    node.setAttribute(
      "href",
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_CONFIG.mapQuery)}`
    );
  });

  document.querySelectorAll("[data-whatsapp-link]").forEach((node) => {
    const message =
      node.getAttribute("data-whatsapp-message") ||
      "Hello, I would like to know more about Milestar Shoes products.";
    node.setAttribute("href", buildWhatsAppUrl(message));
  });
}

function wireEnquiryForm() {
  const form = document.getElementById("enquiry-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  form.querySelectorAll("[data-enquiry-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const data = readEnquiryData(form);

      if (!validateEnquiry(data)) {
        setStatus("Please fill in all enquiry fields before sending.", true);
        return;
      }

      const message = buildEnquiryMessage(data);

      if (button.dataset.enquiryAction === "mail") {
        const subject = `New Enquiry - ${data.inquiryType}`;
        const mailtoUrl =
          `mailto:${CONTACT_CONFIG.email}?subject=${encodeURIComponent(subject)}` +
          `&body=${encodeURIComponent(message)}`;
        window.location.href = mailtoUrl;
        setStatus("Your email draft is ready to send.");
        return;
      }

      window.open(buildWhatsAppUrl(message), "_blank", "noopener");
      setStatus("Your WhatsApp enquiry is ready to send.");
    });
  });
}

function addFloatingWhatsAppButton() {
  const button = document.createElement("a");
  button.className = "floating-whatsapp";
  button.href = CONTACT_CONFIG.socialLinks.whatsapp;
  button.target = "_blank";
  button.rel = "noopener noreferrer";
  button.setAttribute("aria-label", "Chat on WhatsApp");
  button.innerHTML = `
    <span class="material-symbols-outlined" aria-hidden="true">chat</span>
    <span class="floating-whatsapp-label">WhatsApp</span>
  `;
  document.body.appendChild(button);
}

function handleNavScroll() {
  const nav = document.querySelector("nav");
  if (!nav) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.add("nav-scrolled");
    } else {
      nav.classList.remove("nav-scrolled");
    }
  });
}

function handleMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const closeBtn = document.querySelector(".close-menu");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const body = document.body;

  if (!overlay) return;

  const toggleMenu = (show) => {
    if (show) {
      hamburger?.classList.add("is-active");
      overlay.classList.add("is-active");
      body.classList.add("overflow-hidden");
    } else {
      hamburger?.classList.remove("is-active");
      overlay.classList.remove("is-active");
      body.classList.remove("overflow-hidden");
    }
  };

  hamburger?.addEventListener("click", () => {
    const isActive = overlay.classList.contains("is-active");
    toggleMenu(!isActive);
  });

  closeBtn?.addEventListener("click", () => {
    toggleMenu(false);
  });

  // Close menu when clicking a link
  overlay.querySelectorAll(".mobile-menu-link").forEach((link) => {
    link.addEventListener("click", () => {
      toggleMenu(false);
    });
  });
}

function initThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  const html = document.documentElement;
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    html.classList.add("dark");
    toggle.checked = true;
  }

  toggle.addEventListener("change", () => {
    html.classList.toggle("dark", toggle.checked);
    localStorage.setItem("theme", toggle.checked ? "dark" : "light");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  handleNavScroll();
  handleMobileMenu();
  wireContactActions();
  wireEnquiryForm();
  addFloatingWhatsAppButton();
  initThemeToggle();
});
