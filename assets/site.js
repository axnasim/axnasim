// Small script to add a theme toggle button and persist preference
document.addEventListener('DOMContentLoaded', function () {
  try {
    const current = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', current);

    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.title = 'Toggle theme';
    btn.innerText = current === 'light' ? '🌞' : '🌙';

    btn.addEventListener('click', () => {
      const next = (document.documentElement.getAttribute('data-theme') === 'light') ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      btn.innerText = next === 'light' ? '🌞' : '🌙';
    });

    document.body.appendChild(btn);
  } catch (e) {
    // ignore failures in static pages
    console.error(e);
  }
});