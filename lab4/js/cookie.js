//При загрузке на страницу определяем тему из локал стореджа

window.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const switchSlider = document.querySelector(".switch-slider");
    const cartImages = document.querySelectorAll(".cartImage");
    document.documentElement.style.setProperty("--transition-duration", "0s");

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        body.classList.add("light-theme");
        switchSlider.style.left = "2.7vh";
        cartImages[1].style.opacity = "1";
    }

    setTimeout(() => {
        document.documentElement.style.setProperty("--transition-duration", "0.7s");
    }, 50);
});

// Функция сохранения изображения в локал сторедж

async function saveImagesToLocalStorage(reviewsImages) {
    const reviewsImagesBase64 = await Promise.all(reviewsImages.map(async reviewImages => {
        const avatar = reviewImages[0];
        const images = reviewImages[1]; 

        const avatarBase64 = avatar instanceof File ? await getBase64FromFile(avatar) : null;

        const validImages = images.filter(image => image instanceof File);
        const imagesBase64 = validImages.length > 0 
            ? await Promise.all(validImages.map(getBase64FromFile)) 
            : [];

        return [avatarBase64, imagesBase64];
    }));

    localStorage.setItem('reviewsImages', JSON.stringify(reviewsImagesBase64));
}

// Функция загрузки изобажения из локал стореджа

function loadImagesFromLocalStorage() {
    const reviewsImagesBase64 = JSON.parse(localStorage.getItem('reviewsImages') || '[]');
    
    return reviewsImagesBase64.map(reviewImages => {
        const avatarBase64 = reviewImages[0];  
        const imagesBase64 = reviewImages[1];  

        const avatarImg = new Image();
        avatarImg.src = avatarBase64; 

        const images = imagesBase64.map(base64 => {
            const img = new Image();
            img.src = base64; 
            return img;
        });

        return [avatarImg, images]; 
    });
}

// Извлекаем base64 строку из src

function extractBase64FromImageSrc(src) {
    const regex = /^data:image\/[a-zA-Z]*;base64,/;
    return src.replace(regex, '');
}

// Превращаем base64 в файл

function base64ToFile(input, fileName = 'file.jpg') {
    let base64String = input;

    if (input instanceof HTMLImageElement) {
        base64String = input.src;
    }

    const base64Data = base64String.includes(",") ? base64String.split(",")[1] : base64String;

    const byteCharacters = atob(base64Data);
    const byteArray = new Uint8Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    return new File([blob], fileName, { type: 'image/jpeg' });
}

// Получаем base64 строку из файла

function getBase64FromFile(file) {
    return new Promise((resolve, reject) => {
        if (!(file instanceof File)) {
            console.error("Ошибка: getBase64FromFile получил некорректные данные:", file);
            reject("Файл отсутствует или имеет неверный формат");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// Сохраняем текст в куки


function saveTextToCookies(textData) {
    const textJson = JSON.stringify(textData);
    setCookie('reviewsText', textJson, 30); 
}


// Загружаем текст с куки

function loadTextFromCookies() {
    const textJson = getCookie('reviewsText');
    if (textJson) {
        return JSON.parse(textJson);
    }
    return [];
}

// Создаем куки

function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000)); // время в миллисекундах
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
}

// Удаляем куки

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// Получаем куки

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
}

