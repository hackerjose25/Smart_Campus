/**
 * Smart Campus Portal — Mobile Layout Manager
 * Handles sidebar toggling and overlay for small screens.
 */

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const topbar = document.querySelector('.topbar');

  if (!sidebar || !topbar) return;

  // 1. Create Overlay
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);

  // 2. Create Burger Button
  const burgerBtn = document.createElement('button');
  burgerBtn.className = 'mobile-nav-toggle';
  burgerBtn.innerHTML = '☰';
  
  // Insert burger button at the start of the topbar
  topbar.insertBefore(burgerBtn, topbar.firstChild);

  // 3. Toggle Functions
  const toggleSidebar = () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  };

  const closeSidebar = () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  };

  // 4. Listeners
  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSidebar();
  });

  overlay.addEventListener('click', closeSidebar);

  // Close sidebar when clicking a nav item on mobile
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        closeSidebar();
      }
    });
  });

  // Re-check on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      closeSidebar();
    }
  });
});
