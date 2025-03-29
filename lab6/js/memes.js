import {siteConstructor} from './constructor.js';

siteConstructor();

let memes = [];
let currentIndex = -1;

async function fetchMeme() {
    try {
        const response = await fetch('https://meme-api.com/gimme');
        const data = await response.json();
        return {
            title: data.title,
            url: data.url
        };
    } catch (error) {
        console.error('Ошибка при загрузке мема:', error);
        return {
            title: 'Ошибка',
            url: 'https://via.placeholder.com/300x200?text=Ошибка+загрузки+мема'
        };
    }
}

function displayMeme(index) {
    const main = document.querySelector('main');
    main.innerHTML = ''; 

    const memeContainer = document.createElement('div');
    memeContainer.classList.add('meme-container');

    const memeImg = document.createElement('img');
    memeImg.src = memes[index].url;
    memeImg.alt = memes[index].title;

    const memeTitle = document.createElement('p');
    memeTitle.textContent = memes[index].title;

    memeContainer.appendChild(memeTitle);
    memeContainer.appendChild(memeImg);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');

    const prevButton = document.createElement('button');
    prevButton.textContent = '←';
    prevButton.classList.add("button");
    prevButton.addEventListener('click', showPreviousMeme);
    prevButton.disabled = index === 0;

    const nextButton = document.createElement('button');
    nextButton.textContent = '→';
    nextButton.classList.add("button");
    nextButton.addEventListener('click', showNextMeme);

    buttonsContainer.appendChild(prevButton);
    buttonsContainer.appendChild(nextButton);

    main.appendChild(memeContainer);
    main.appendChild(buttonsContainer);
}

function showPreviousMeme() {
    if (currentIndex > 0) {
        currentIndex--;
        displayMeme(currentIndex);
    }
}

function showNextMeme() {
    if (currentIndex < memes.length - 1) {
        currentIndex++;
        displayMeme(currentIndex);
    } else {
    	const activeElements = document.querySelectorAll("button");
    	activeElements.forEach(button => button.disabled = true);
        fetchMeme().then(newMeme => {
	        memes.push(newMeme);
	        currentIndex++;
	        displayMeme(currentIndex);
	        activeElements.forEach(button => button.disabled = false);
        });
    }
}

async function init() {
    const firstMeme = await fetchMeme();
    memes.push(firstMeme);
    currentIndex = 0;
    displayMeme(currentIndex);
}

init();