function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
    link.setAttribute("aria-current", "false");
  });
  document.getElementById(sectionId).classList.add("active");
  const activeLink = document.querySelector(`[href="#${sectionId}"]`);
  activeLink.classList.add("active");
  activeLink.setAttribute("aria-current", "page");
  document.querySelector(".nav").classList.remove("show");
  document.querySelector(".nav").scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  const sidebarToggle = document.querySelector(".sidebar-toggle");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav a");
  // Select all elements with class 'stat-number'
  const counters = document.querySelectorAll(".stat-number");

  if (!sidebarToggle || !nav) return;

  // Add .active only if on mobile
  function setupMobileNav() {
    if (window.innerWidth <= 768) {
      nav.classList.add("active");
    } else {
      nav.classList.remove("active", "show");
    }
  }

  // Setup initial state
  setupMobileNav();

  // Update on resize
  window.addEventListener("resize", setupMobileNav);

  // Toggle sidebar on button click
  sidebarToggle.addEventListener("click", () => {
    if (nav.classList.contains("active")) {
      nav.classList.toggle("show");
    }
  });

  // Close sidebar when any link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("active")) {
        nav.classList.remove("show");
      }
    });
  });

  const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;

          const targetAttr = counter.getAttribute("data-target");
          const suffix = counter.getAttribute("data-suffix") || "+";

          const target = parseInt(targetAttr, 10);
          if (isNaN(target) || target < 0) {
            console.error(
              `Invalid or negative data-target for element:`,
              counter
            );
            counter.textContent = "N/A";
            return;
          }

          let startTime = null;
          const duration = 1000; // Total duration in ms

          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(progress * target);

            counter.textContent = currentValue;

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              counter.textContent = target + suffix;
            }
          };

          requestAnimationFrame(animate);
          observer.unobserve(counter);
        }
      });
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }
  );

  counters.forEach((counter) => {
    observer.observe(counter);

    // Optional cleanup if element is removed
    const mutationObserver = new MutationObserver(() => {
      if (!document.contains(counter)) {
        observer.unobserve(counter);
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
});

// Intersection observer for animations
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document.querySelectorAll(".education-item, .experience-item, .book-card, .expertise-card, .role-card, .conference-item").forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(20px)";
    item.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(item);
  });

// Typing effect for hero title
const heroTitle = document.querySelector(".hero h1");
const titleText = heroTitle.textContent;
heroTitle.textContent = "";
let i = 0;
function typeWriter() {
  if (i < titleText.length) {
    heroTitle.textContent += titleText.charAt(i);
    i++;
    setTimeout(typeWriter, 80);
  }
}
setTimeout(typeWriter, 300);

// Stats counter animation
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const statNumber = entry.target.querySelector(".stat-number");
      const target = parseInt(statNumber.textContent.replace("+", ""));
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          statNumber.textContent =
            target + (statNumber.textContent.includes("+") ? "+" : "");
          clearInterval(timer);
        } else {
          statNumber.textContent =
            Math.floor(current) +
            (statNumber.textContent.includes("+") ? "+" : "");
        }
      }, 40);
      statsObserver.unobserve(entry.target);
    }
  });
});
document
  .querySelectorAll(".stat-card")
  .forEach((card) => statsObserver.observe(card));

// Search functionality
const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.placeholder = "Search content...";
searchInput.setAttribute("aria-label", "Search website content");
searchInput.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 10px 15px;
                border: 2px solid #f6e05e;
                border-radius: 9999px;
                background: rgba(45, 55, 72, 0.9);
                color: #e5e7eb;
                z-index: 1000;
                font-size: 14px;
                width: 200px;
                transition: all 0.3s ease;
            `;
searchInput.addEventListener("focus", function () {
  this.style.width = "300px";
});
searchInput.addEventListener("blur", function () {
  this.style.width = "200px";
});
searchInput.addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  document
    .querySelectorAll(
      ".education-item, .experience-item, .book-card, .expertise-card, .role-card, .conference-item"
    )
    .forEach((item) => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(searchTerm) ? "block" : "none";
      item
        .querySelectorAll(
          "p, h1, h2, h3, .degree, .position, .book-title, .conference-title"
        )
        .forEach((el) => {
          el.style.backgroundColor =
            searchTerm && text.includes(searchTerm)
              ? "rgba(246, 224, 94, 0.3)"
              : "";
        });
    });
});
document.body.appendChild(searchInput);

// Print button
const printButton = document.createElement("button");
printButton.innerHTML = '<i class="fas fa-print"></i>';
printButton.setAttribute("aria-label", "Print page");
printButton.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: #f6e05e;
                color: #1a202c;
                border: none;
                font-size: 18px;
                cursor: pointer;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                transition: all 0.3s ease;
            `;
printButton.addEventListener("click", () => window.print());
printButton.addEventListener("mouseenter", function () {
  this.style.transform = "scale(1.1)";
});
printButton.addEventListener("mouseleave", function () {
  this.style.transform = "scale(1)";
});
document.body.appendChild(printButton);

// Back to top button
const backToTopButton = document.createElement("button");
backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopButton.setAttribute("aria-label", "Back to top");
backToTopButton.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: #2a4365;
                color: #f7fafc;
                border: none;
                font-size: 16px;
                cursor: pointer;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                transition: all 0.3s ease;
                opacity: 0;
                transform: translateY(20px);
            `;
backToTopButton.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);
window.addEventListener("scroll", () => {
  backToTopButton.style.opacity = window.pageYOffset > 300 ? "1" : "0";
  backToTopButton.style.transform =
    window.pageYOffset > 300 ? "translateY(0)" : "translateY(20px)";
});
document.body.appendChild(backToTopButton);

// Keyboard navigation
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      showSection(link.getAttribute("href").slice(1));
    }
  });
});
