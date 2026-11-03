let links = document.querySelectorAll('#wrapper aside a');
let observer = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (!entry.isIntersecting) return;
		console.log('intersect!');
		let id = entry.target.id;
		links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
	})
}, {
	rootMargin: '0px 0px -70% 0px',
	threshold: 0,
});
document.querySelectorAll('main h2, main h3, main h4').forEach((h) => observer.observe(h));
