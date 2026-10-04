(function() {
	function configureNav() {
		const menu = document.getElementById("mainNav");
		if (!menu) {
			return;
		}

		const items = menu.querySelectorAll(".nav-item");
		const currentLink = window.location.pathname + window.location.hash;

		for (let item of items) {
			const link = item.querySelector("a");
			const button = item.querySelector("button");
			if (!link) { // not a real case, but just to be safe
				continue;
			}
			const path = link.pathname + link.hash;
			if (path === currentLink) {
				item.classList.add("current");
			}

			if (link.hash !== "") {
				link.onclick = () => {
					const current = menu.querySelector(".nav-item.current");
					if (current) {
						current.classList.remove("current");
					}
					item.classList.add("current");
				}
			}

			if (button) {
				button.onclick = (e) => {
					e.preventDefault();
					e.stopPropagation();
					if (item.classList.contains("expanded")) {
						item.classList.remove("expanded");
						item.classList.add("collapsed");
					} else {
						item.classList.add("expanded");
						item.classList.remove("collapsed");
					}
				};
			}
		}
	}

	configureNav();
}());

// this is required to support prism's line numbers
(function() {
	document.querySelectorAll('pre').forEach(function(el) {
		if (el.classList.values().some(c => c === "clyde-code")) {
			el.classList.add('line-numbers');
			return;
		}
		el.classList.add('line-numbers');
		const hasLangClass = Array.from(el.classList.values()).some(c => c.startsWith("language-"));
		if (!hasLangClass) {
			el.classList.add("language-custom");
		}
	});
}());
