// theme-switcher.js
function toggleTheme() {
  // Use the root element so CSS selectors like [data-theme] on <html> work
  const root = document.documentElement;
  const currentTheme = root.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  root.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  // Update button icon/text to reflect current theme
  const themeBtn = document.getElementById('theme-toggle') || document.querySelector('.theme-toggle');
  if (themeBtn) {
    // show an icon for the active theme (sun for light, moon for dark)
    themeBtn.textContent = newTheme === 'light' ? '🌞' : '🌙';
  }
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme') ||
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.setAttribute('data-theme', savedTheme);

  // Wire up the toggle button if present
  const themeBtn = document.getElementById('theme-toggle') || document.querySelector('.theme-toggle');
  if (themeBtn) {
    // initialize button icon
    themeBtn.textContent = savedTheme === 'light' ? '🌞' : '🌙';
    themeBtn.addEventListener('click', toggleTheme);
  }
});