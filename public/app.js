/**
 * RMIT University Vietnam
 * Course: COSC3060 | COSC3061 Web Programming Studio
 * Semester: 2026B
 * Assessment: Full-Stack In-Class Lab Test
 * Author: Kai Nguyen
 * ID: s4126139
 * Acknowledgement: MDN Web Docs for browser DOM APIs.
 */

// The form still works without JavaScript; this only communicates loading state.
const refreshForm = document.querySelector('[data-refresh-form]');

if (refreshForm) {
  const refreshButton = refreshForm.querySelector('[data-refresh-button]');
  const refreshLabel = refreshForm.querySelector('[data-refresh-label]');

  refreshForm.addEventListener('submit', () => {
    refreshButton.disabled = true;
    refreshButton.setAttribute('aria-busy', 'true');
    refreshLabel.textContent = 'Refreshing...';
  });

  // Restore the button when the user returns through the browser back/forward cache.
  window.addEventListener('pageshow', () => {
    refreshButton.disabled = false;
    refreshButton.removeAttribute('aria-busy');
    refreshLabel.textContent = 'Refresh';
  });
}
