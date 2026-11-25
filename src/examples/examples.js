const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');

tooltipTriggerList.forEach((tooltipTriggerEl) => {
	const tooltip = new bootstrap.Tooltip(tooltipTriggerEl, {
		trigger: 'hover focus'
	});

	tooltipTriggerEl.addEventListener('click', () => {
		tooltip.hide();
	});
});