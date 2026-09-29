/* Loaded in <head> to avoid a flash; a file, not inline, because CSP blocks inline script. */
(() => {
  const STORAGE_KEY = "portfolio-theme";
  const ORDER = ["auto", "light", "dark"];
  const root = document.documentElement;
  const systemLight = window.matchMedia("(prefers-color-scheme: light)");

  const read = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return ORDER.includes(stored) ? stored : "auto";
    } catch {
      return "auto";
    }
  };

  const write = (value) => {
    try {
      if (value === "auto") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, value);
    } catch {
    }
  };

  const systemTheme = () => (systemLight.matches ? "light" : "dark");
  const resolve = (choice) => (choice === "auto" ? systemTheme() : choice);
  const labelFor = (choice) => (choice === "auto" ? "Auto" : choice === "light" ? "Light" : "Dark");

  let choice = read();

  const setRoot = () => {
    const resolved = resolve(choice);
    root.setAttribute("data-theme", resolved);
    root.setAttribute("data-theme-choice", choice);
    return resolved;
  };

  const apply = () => {
    const resolved = setRoot();
    const label = labelFor(choice);
    const button = document.querySelector("[data-theme-toggle]");
    if (button) {
      button.setAttribute("aria-label", `Theme: ${label}. Activate to switch theme.`);
      button.setAttribute("title", `Theme: ${label}`);
      button.setAttribute("data-theme-state", choice);
      const text = button.querySelector(".theme-label");
      if (text) text.textContent = label;
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", resolved === "light" ? "#f2f7f8" : "#070a0d");
    document.dispatchEvent(new CustomEvent("themechange", { detail: { choice, resolved } }));
  };

  setRoot();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  } else {
    apply();
  }

  const onSystemChange = () => {
    if (choice === "auto") apply();
  };

  if (typeof systemLight.addEventListener === "function") {
    systemLight.addEventListener("change", onSystemChange);
  } else if (typeof systemLight.addListener === "function") {
    systemLight.addListener(onSystemChange);
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-theme-toggle]");
    if (!button) return;
    event.preventDefault();
    choice = ORDER[(ORDER.indexOf(choice) + 1) % ORDER.length];
    write(choice);
    apply();
  });
})();
