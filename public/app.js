const refreshForm = document.querySelector('[data-refresh-form]');

if (refreshForm) {
  const refreshButton = refreshForm.querySelector('[data-refresh-button]');
  const refreshLabel = refreshForm.querySelector('[data-refresh-label]');

  refreshForm.addEventListener('submit', () => {
    refreshButton.disabled = true;
    refreshButton.setAttribute('aria-busy', 'true');
    refreshLabel.textContent = 'Refreshing...';
  });

  window.addEventListener('pageshow', () => {
    refreshButton.disabled = false;
    refreshButton.removeAttribute('aria-busy');
    refreshLabel.textContent = 'Refresh';
  });
}
