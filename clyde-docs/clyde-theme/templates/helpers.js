/**
*
* You can define custom Handlebars helpers in this file.
* Any method exported in this file will be available as a
* helper of same name in your hbs templates.
*
* For more info about helpers, check handlebars' docs
* https://handlebarsjs.com/guide/expressions.html#helpers
*
*/

// Helper to return the initial state for the navigation menu, such as
// which menu item should be expanded or not when loading the page
export function getNavCurrentState(navLink, currentFile) {
	// skip anchors as they can't be expanded
	if (navLink.includes("#")) {
		return "no-expand";
	}

	const navLinkWithoutIndex = navLink.replace("/index.html", "");
	const currentFileWithoutIndex = currentFile.replace("/index.html", "");

	if (currentFileWithoutIndex.split("/").length === 1) {
		return;
	}

	if (currentFileWithoutIndex.includes(navLinkWithoutIndex)) {
		return "loaded-expanded expanded";
	}
	return "collapsed";
}

// Helper to return the "current" class when the navigation link refers to the
// current file
export function getNavClassWhenCurrent(navLink, currentFile) {
	return navLink === currentFile ? "current" : "";
};

export function canonicalFileLink() {
	return buildLink(
		this.site.url,
		this.currentFilePath.replace(this.baseUrl, ""),
	);
}

export function buildLink(...args) {
	const parts = args.filter((a) => typeof a === "string");
	return parts.join("/").replaceAll(/\/+/g, "/");
}

export function assetImage(imageName) {
	return this.assets.images[imageName];
}

export function pageDescriptionWithFallback() {
	return this.metadata.description || this.site.description
}

export function pageImageWithFallback() {
	const image = this.metadata.page_image || this.site.image;

	if (image || this.assets.images[image]) {
		return this.assets.images[image];
	}

	return image;
}

export function pageKeywordsWithFallback() {
	return this.metadata.keywords || this.site.keywords
}

export function fullPageTitle() {
	if (this.pageTitle) {
		return `${this.pageTitle} - ${this.site.title}`;
	}
	return this.site.title;
}

/**
 * Returns previous and next link HTML elements to be used
 * in the page bottom navigation.
 * It uses the navigationMenu links to find what is the previous and
 * pages for the page provided
 */
export function getPageNavigationLinks(currentPage) {
	const listStack = [
		{ list: [this.navigationMenu], index: 0 },
	]

	let previousItem;
	let nextItem;
	let wasFound = false;

	while (listStack.length > 0) {
		const currentStack = listStack.length - 1;
		const stack = listStack[currentStack];

		while (stack.index < stack.list.length) {
			const item = stack.list[stack.index];
			stack.index += 1;

			// skip anchors
			if (item.level > 1) {
				continue;
			}

			if (wasFound) {
				nextItem = item;
				break;
			}

			if (item.path === currentPage) {
				wasFound = true;
				if (item.children && item.children.length) {
					for (let child of item.children) {
						if (child.level === 1) {
							nextItem = child;
							break;
						}
					}
					if (nextItem) {
						break;
					}
				}
			} else {
				previousItem = item;
				if (item.children && item.children.length) {
					listStack.push({ list: item.children, index: 0 });
					break;
				}
			}
		}

		if (wasFound && nextItem) {
			break;
		}

		if (stack.index >= stack.list.length && currentStack == listStack.length - 1) {
			listStack.pop();
		}
	}

	if (!wasFound) {
		return "";
	}

	let links = "";

	if (previousItem) {
		links += `<a href="${previousItem.path}" class="previous">Previous: ${previousItem.title}</a>`;
	}

	if (nextItem) {
		links += `<a href="${nextItem.path}" class="next">Next: ${nextItem.title}</a>`;
	}

	return links;
}
