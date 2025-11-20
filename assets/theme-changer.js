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

// --- Perfect-fit helper: compute an accurate --page-reserve CSS variable so
// max-height calc in CSS can ensure the grid fits vertically. Runs on load and resize.
;(function(){
  function debounce(fn, ms){
    let t;
    return function(...args){
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this,args), ms);
    };
  }

  function computePageReserve(){
    const header = document.querySelector('.hero') || document.querySelector('header') || document.querySelector('h1');
    const footer = document.querySelector('footer');
    const headerH = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
    const footerH = footer ? Math.ceil(footer.getBoundingClientRect().height) : 0;
    const bodyStyle = window.getComputedStyle(document.body);
    const paddingTop = parseFloat(bodyStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(bodyStyle.paddingBottom) || 0;
    // small extra reserve to account for margins, browser chrome, etc.
    const extra = 20;
    let reserve = headerH + footerH + paddingTop + paddingBottom + extra;
    // clamp to sensible bounds so extreme values don't break layout
    reserve = Math.max(60, Math.min(280, reserve));
    document.documentElement.style.setProperty('--page-reserve', reserve + 'px');
  }

  document.addEventListener('DOMContentLoaded', computePageReserve);
  window.addEventListener('resize', debounce(computePageReserve, 120));
  if(document.readyState === 'interactive' || document.readyState === 'complete') computePageReserve();
})();

// --- Size equalizer: make grid cards in each row match height dynamically ---
// Works per-grid: measures number of columns from computed gridTemplateColumns
// and equalizes heights for each row. Runs on load and debounced resize.
;(function(){
  function debounce(fn, ms){
    let t;
    return function(...args){
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this,args), ms);
    };
  }

  function equalizeGrid(grid){
    if(!grid) return;
    const children = Array.from(grid.children).filter(n => n.nodeType===1);
    if(children.length===0) return;

    // reset heights
    children.forEach(c => { c.style.height = 'auto'; });

    const computed = window.getComputedStyle(grid);
    const cols = computed.gridTemplateColumns ? computed.gridTemplateColumns.split(' ').length : 1;
    if(cols <= 1){ return; }

    for(let i=0;i<children.length;i+=cols){
      const row = children.slice(i, i+cols);
      const heights = row.map(r => Math.ceil(r.getBoundingClientRect().height));
      const max = Math.max(...heights, 0);
      row.forEach(r => { r.style.height = max + 'px'; });
    }
  }

  function equalizeAll(){
    const grids = document.querySelectorAll('.resources-grid');
    grids.forEach(g => equalizeGrid(g));
  }

  // Run after DOM is parsed and a short delay to allow font/layout to stabilize
  document.addEventListener('DOMContentLoaded', () => setTimeout(equalizeAll, 60));
  // Re-run on window resize
  window.addEventListener('resize', debounce(equalizeAll, 120));
})();