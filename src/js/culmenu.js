import culmenu from './cul-main-menu.json'
const culjson = JSON.parse(JSON.stringify(culmenu));

export function makeCULmenu(destEl) {

	const createUnorderedList = (culjson) => {
		const ul = document.createElement('ul');
		ul.className = 'list-unstyled w-100';

		for (let items in culjson) {
			const culMenuDiv = document.createElement('div');
			const ul2 = document.createElement('ul');
			const li = document.createElement('li');
			const butt = document.createElement('button');
			culMenuDiv.id = items.replace(/\s+/g, '-').toLowerCase()+'-collapse';
			culMenuDiv.classList.add('collapse');
			li.classList.add('mb-1');
			ul2.className = 'btn-toggle-nav list-unstyled fw-normal pb-1';
			butt.className = 'btn btn-toggle ps-0 d-inline-flex w-100 align-items-center rounded border-0 collapsed';
			butt.setAttribute('data-bs-target', '#'+items.replace(/\s+/g, '-').toLowerCase()+'-collapse');
			butt.setAttribute('data-bs-toggle', 'collapse');
			butt.setAttribute('aria-expanded', 'false');
			culjson[items].forEach(item => {
				butt.innerHTML = items;
				li.appendChild(butt);
				const li2 = document.createElement('li');
				const a = document.createElement('a');
				a.href = item.href;
				a.innerHTML = item.value;
				a.classList.add('d-block');
				li2.appendChild(a);
				ul2.appendChild(li2);
				culMenuDiv.appendChild(ul2);
			});
			li.appendChild(butt);
			li.appendChild(culMenuDiv);
			ul.appendChild(li);
		}

		return ul;
	};

const list = createUnorderedList(culjson);
document.getElementById(destEl).appendChild(list);

}
