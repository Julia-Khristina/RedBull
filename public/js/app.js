document.addEventListener('DOMContentLoaded', function () {
  const path = window.location.pathname;

  document.querySelectorAll('.nav-item').forEach(function (item) {
    const href = item.getAttribute('href');
    if (href && path.startsWith(href)) {
      item.classList.add('active');
      item.closest('.nav-item-wrapper').classList.add('active');
    }
  });
});