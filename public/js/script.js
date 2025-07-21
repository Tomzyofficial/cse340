// Responsive navbar toggle
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav_ul");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}
// Hamburger icon animation toggle
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
  });
}
