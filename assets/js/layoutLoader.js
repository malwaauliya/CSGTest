window.addEventListener("DOMContentLoaded", async () => {
  const loadHTML = async (id, path) => {
    const el = document.getElementById(id);
    if (el) {
      const res = await fetch(path);
      const html = await res.text();
      el.innerHTML = html;
    }
  };

  await Promise.all([
    loadHTML("sidebar", "./components/sidebar.html"),
    loadHTML("navbar", "./components/navbar.html"),
    loadHTML("footer", "./components/footer.html"),
  ]);
});