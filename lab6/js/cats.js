import {siteConstructor} from './constructor.js';

siteConstructor();

class Img {
    constructor(url, alt, width, left, top) {
        this.url = url;
        this.alt = alt;
        this.width = width;
        this.left = left;
        this.top = top;
        
        this.createImage();
        this.moveImage();
    }

    createImage() {
        this.img = document.createElement("img");
        const main = document.querySelector("main");
        
        this.img.src = this.url;
        this.img.alt = this.alt;
        this.img.style.maxWidth = this.width;
        this.img.style.height = this.width;
        this.img.style.left = this.left;
        this.img.style.top = this.top;
        this.img.classList.add("cat");
        
        main.appendChild(this.img);
    }

    moveImage() {
        let directionX = Math.random() < 0.5 ? 1 : -1;
        let directionY = Math.random() < 0.5 ? 1 : -1; 
        const speed = Math.floor(Math.random() * 4) + 2; 
        
        
        setInterval(() => {
            const rect = this.img.getBoundingClientRect();
            
          
            if (rect.right >= (window.innerWidth - 10) || rect.left <= 10) {
                directionX *= -1;
            }
            this.img.style.left = (rect.left + directionX * speed) + "px";
            
           
            if (rect.bottom >= (window.innerHeight - 10) || rect.top <= 10) {
                directionY *= -1;
            }
            this.img.style.top = (rect.top + directionY * speed) + "px";
        }, 16); 
    }
}

async function getCatUrl() {
    const url = "https://api.thecatapi.com/v1/images/search";

    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error("Ошибка загрузки изображения");

        let data = await response.json();
        let catUrl = data[0]?.url;
        if (!catUrl) throw new Error("URL изображения не найден");

        return catUrl;
    }
    catch (error){
        alert(error.message);
    }
}


for (let i = 0; i < 50; i++) {
    const imgSize = window.innerWidth / 6;
    const buffer = 50; 
    const maxX = window.innerWidth - 2 * buffer - imgSize - 10; 
    const maxY = window.innerHeight - 2 * buffer - imgSize - 10; 

    let pos = {
        x: Math.floor(Math.random() * (maxX - buffer)) + buffer, 
        y: Math.floor(Math.random() * (maxY - buffer)) + buffer
    };

    getCatUrl().then((url) => {
        if (url) {
            new Img(url, "Котик", `${imgSize}px`, `${pos.x}px`, `${pos.y}px`);
        }
    });
}