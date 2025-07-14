// Dynamic include for modular components
const loadComponent = async (id, path) => {
  const response = await fetch(path);
  const html = await response.text();
  document.getElementById(id).innerHTML = html;
};

// Load static components
window.onload = () => {
  loadComponent("site-header", "components/header.html");
  loadComponent("site-nav", "components/nav.html");
  loadComponent("main-content", "layouts/landing.html");
  loadComponent("site-footer", "components/footer.html");
};
