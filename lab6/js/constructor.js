export function siteConstructor() {
	const paths = {
	    "index.html": {
	    	title: "Доска объявлений",
	    	bg: "./img/background.jpg"
	    },
	    "cats.html": {
	    	title: "Доска котиков",
	    	bg: "./img/background_cats.jpg"
	    },
	    "store.html": {
	    	title: "Доска товаров",
	    	bg: "./img/bg-store.avif"
	    },
	    "memes.html": {
	    	title: "Доска мемов",
	    	bg: "./img/background_cats.jpg"
	    }
	};
	const lastPath = window.location.pathname.split("/").pop();

	const body = document.body;
	body.style.background = `url('${paths[lastPath].bg}')`;
	body.style.backgroundSize = "cover"; 
    body.style.backgroundAttachment = "fixed";
    body.style.backgroundPosition = "center"; 
    body.style.backgroundRepeat = "no-repeat";
    body.style.backgroundAttachment = "scroll";

	const header = document.createElement("header");

	const title = document.createElement("h1");
	title.innerText = paths[lastPath].title; 
	title.classList.add("title", "untouchable");
	header.appendChild(title);

	const sign = document.createElement("img");
	sign.src = "./img/sign.png";
	sign.classList.add("sign", "untouchable");
	header.appendChild(sign);

	const navigation = document.createElement("nav");

	const store = document.createElement("button");
	store.innerText = "Магазин";
	navigation.appendChild(store);

	const announcements = document.createElement("button");
	announcements.innerText = "Объявления";
	navigation.appendChild(announcements);

	const cats = document.createElement("button");
	cats.innerText = "Котики";
	navigation.appendChild(cats);

	const memes = document.createElement("button");
	memes.innerText = "Мемы";
	navigation.appendChild(memes);

	announcements.addEventListener("click", () => {
	    window.location.href = "index.html";
	});

	store.addEventListener("click", () => {
	    window.location.href = "store.html";
	});

	cats.addEventListener("click", () => {
	    window.location.href = "cats.html";
	});

	memes.addEventListener("click", () => {
	    window.location.href = "memes.html";
	});

	header.appendChild(navigation);

	if (lastPath == "index.html"){
		const pencil = document.createElement("img");
		pencil.src = "./img/pencil.png";
		pencil.classList.add("pencil");
		header.appendChild(pencil);

		const plus = document.createElement("img");
		plus.src = "./img/plus.png";
		plus.classList.add("plus");
		header.appendChild(plus);
	}

	const main = document.createElement("main");

	if (lastPath == "store.html"){
		const buttonsBox = document.createElement("div");
		buttonsBox.classList.add("buttons-box");

		const addButton = document.createElement("button");
		addButton.innerText = "Добавить товар";
		addButton.classList.add("buttons");
		addButton.id = "add-button";
		buttonsBox.appendChild(addButton);

		main.appendChild(buttonsBox);

		const searchBox = document.createElement("div");
		searchBox.classList.add("search-box");

		const search = document.createElement("input");
		search.classList.add("search-field");
		const help = "Введите название товара (необязательно)";
		search.placeholder = help;
		search.title = help;
		searchBox.appendChild(search);

		const searchButton = document.createElement("button");
		searchButton.classList.add("search-button");
		searchButton.innerText = "→";
		searchBox.appendChild(searchButton);

		const searchResultsBox = document.createElement("div");
		searchResultsBox.classList.add("search-results-box");

		main.appendChild(searchBox);
		main.appendChild(searchResultsBox);
	}

	body.appendChild(header);
	body.appendChild(main);
}