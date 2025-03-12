const wires = document.getElementById('wires');
const wires_copy = wires.cloneNode(true);
wires_copy.style.cssText = wires.style.cssText;
wires.parentNode.appendChild(wires_copy);
wires_copy.style.marginLeft = `${wires.parentNode.offsetWidth * 2 - 10}px`;

function wireMoving() {
    wires.style.marginLeft = `${parseInt(wires.style.marginLeft || 0, 10) - 5}px`;
    wires_copy.style.marginLeft = `${parseInt(wires_copy.style.marginLeft || 0, 10) - 5}px`;
    if (parseInt(wires_copy.style.marginLeft || 0, 10) < 0) {
        wires.style.marginLeft = "0px";
        wires_copy.style.marginLeft = `${wires.parentNode.offsetWidth * 2 - 10}px`;
    }
}

setInterval(wireMoving, 16);


const cartImages = document.querySelectorAll(".cartImage");
cartImages.forEach(cart => {
    cart.addEventListener('click', () => {
        window.location.href = "https://qiwi.com";
    });
});
const banner1 = document.getElementById("ad-banner1");
const banner2 = document.getElementById("ad-banner2");
const banner3 = document.getElementById("ad-banner3");
banner1.addEventListener('click', () => {
    window.location.href = "https://aliexpress.ru/item/1005007799453271.html?spm=a2g2w.productlist.rcmdprod.2.1cc23ca4QLWSUN&sku_id=12000042241440269";
})
banner2.addEventListener('click', () => {
    window.location.href = "https://aliexpress.ru/item/1005006142513190.html?sku_id=12000035951805646&spm=a2g2w.productlist.search_results.9.6e5030b0q0fe3o";
})
banner3.addEventListener('click', () => {
    window.location.href = "https://aliexpress.ru/item/1005006142513190.html?sku_id=12000035951805646&spm=a2g2w.productlist.search_results.9.6e5030b0q0fe3o";
})

const switchSlider = document.getElementsByClassName("switch-slider")[0];
const body = document.body;

cartImages[1].style.opacity = 0;
switchSlider.style.left = "0.3vh";


// Смена темы

function switchTheme() {

    if (switchSlider.style.left === "0.3vh") {

        body.classList.add('light-theme');
        switchSlider.style.left = "2.7vh";
        cartImages[1].style.opacity = 1;
        localStorage.setItem('theme', 'light');
    } 

    else {
        
        body.classList.remove('light-theme');
        switchSlider.style.left = "0.3vh";
        cartImages[1].style.opacity = 0;
        localStorage.setItem('theme', 'dark');
    }
}

// Конструкторы объектов отзыва и пользователя

function Review(user, rating, images, text) {
    this.user = user;
    this.rating = rating;
    this.images = images;
    this.text = text;
}

function User(name, avatar) {
    this.name = name;
    this.avatar = avatar;
}

// Создание отзыва на странице

function loadReview(review) {
    const reviewsContainer = document.getElementsByClassName("reviews-container")[0];

    const newReview = document.createElement("div");
    newReview.classList.add("review");

    const reviewHeader = document.createElement("div");
    reviewHeader.classList.add("review-header");
    const avatar = document.createElement("img");
    avatar.classList.add("avatar-icon");
    if (review.user.avatar instanceof File) {
        const reader = new FileReader();
        reader.onload = function (e) {
            avatar.src = e.target.result;
        };
        reader.readAsDataURL(review.user.avatar);
    } 
    else {
        avatar.src = "./img/standart_avatar.png";
    }

    const username = document.createElement("div");
    username.classList.add("username");
    username.textContent = review.user.name;

    const reviewRating = document.createElement("div");
    reviewRating.classList.add("review-rating");

    for (let i = 0; i < review.rating; i++) {
        const starImage = document.createElement("img");
        starImage.classList.add('starImage');
        starImage.src = './img/star.png';
        starImage.alt = "*";
        reviewRating.appendChild(starImage);
    }

    const reviewImages = document.createElement("div");
    reviewImages.classList.add("review-images");

    if (review.images.length > 0) {
        review.images.forEach(image => {
            const miniImage = document.createElement("img");
            miniImage.classList.add('miniImage');
            miniImage.alt = "image";
            miniImage.style.cursor = 'pointer';

            const reader = new FileReader();
            reader.onload = function (e) {
                miniImage.src = e.target.result;
            };
            reader.readAsDataURL(image);  


            miniImage.addEventListener("click", function () {
                openImage(miniImage);
            });

            reviewImages.appendChild(miniImage);
        });
    }


    const reviewText = document.createElement("div");
    reviewText.classList.add("review-text");
    reviewText.textContent = review.text;

    reviewHeader.appendChild(avatar);
    reviewHeader.appendChild(username);
    reviewHeader.appendChild(reviewRating);

    newReview.appendChild(reviewHeader);
    if (review.images.length > 0) {  
        newReview.appendChild(reviewImages);
    }
    newReview.appendChild(reviewText);

    reviewsContainer.appendChild(newReview);
}

// Функция открытия изображения у отзыва

function openImage(img) {
    const main = document.querySelector("main");
    document.body.style.overflow = "hidden";
    let overlay = document.createElement("div");
    overlay.style.backdropFilter = "blur(5px)";
    overlay.classList.add("centered");
    overlay.style.position = "fixed";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "999";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.left = 0;
    overlay.addEventListener("click", () => {
        main.removeChild(overlay);
        document.body.style.overflow = "";
    });

    let image = document.createElement("img");
    image.style.maxWidth = "90vw";
    image.src = img.src;
    image.alt = "Здесь должно было быть изображение.";

    overlay.appendChild(image);
    main.appendChild(overlay);
}

// Обработка формы фидбека

document.getElementById('reviewForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name');
    const reviewText = document.getElementById('reviewText');
    const rating = document.getElementById('rating');
    const avatar = document.getElementById('avatar');
    const images = document.getElementById('images');

    const labelName = document.querySelector('label[for="name"]');
    if (name.value.length < 4 || name.value.length > 25) {
        labelName.textContent = "Имя: (минимум 4 символа, максимум 25 символов)";
        labelName.style.color = "red";
        return;
    }
    else {
        labelName.textContent = "Имя:";
        labelName.style.color = "black";
    }


    const labelAvatar = document.querySelector('label[for="avatar"]');
    if (avatar.files.length > 0) {
        if (avatar.files[0].type !== "image/jpeg" ) {
            labelAvatar.textContent = "Выберите аватар: (поддерживается только JPEG)";
            labelAvatar.style.color = "red";
            return;
        }
        else {
            labelAvatar.textContent = "Выберите аватар:";
            labelAvatar.style.color = "black";
        }
    }


    const labelReviewText = document.querySelector('label[for="reviewText"]');
    if (reviewText.value.length < 50 || reviewText.value.length > 500) {
        labelReviewText.textContent = "Отзыв: (минимум 50 символов, максимум 500 символов)";
        labelReviewText.style.color = "red";
        return;
    }
    else {
        labelReviewText.textContent = "Отзыв:";
        labelReviewText.style.color = "black";
    }


    const labelRating = document.querySelector('label[for="rating"]');
    if (rating.value < 1 || rating.value > 5) {
        labelRating.style.color = "red";
        return;
    }
    else {
        labelRating.style.color = "black";
    }

    const labelImages = document.querySelector('label[for="images"]');
    if (images.files.length > 0) {
        if (images.files.length > 5) {
            labelImages.textContent = "Добавить изображения (максимум 5):";
            labelImages.style.color = "red";
            return;
        }
        else {
            labelImages.style.color = "black";
        }
        Array.from(images.files).forEach(image => {
            if (image.type !== "image/jpeg") {
                labelImages.textContent = "Добавить изображения (максимум 5): (поддерживается только JPEG)";
                labelImages.style.color = "red";
                return;
            }
            else {
                labelImages.textContent = "Добавить изображения (максимум 5):";
                labelImages.style.color = "black";
            }
        })
    }
    let newUser;
    if (avatar.files.length > 0) {
        newUser = new User(name.value, avatar.files[0])
    }
    else{
        newUser = new User(name.value, null);
    }

    const newReview = new Review(newUser, rating.value, Array.from(images.files), reviewText.value);
    reviews.push(newReview);
    new_reviews_img.push([newUser.avatar, Array.from(images.files)]);
    new_reviews_text.push([newUser.name, rating.value, reviewText.value]);
    sortingFilteringReviews(selectedSortElement.value, selectedFilterElement.value);

    localStorage.removeItem('reviewsImages');
    deleteCookie('reviewsText'); 
    console.log(new_reviews_text);
    console.log(new_reviews_img);
    saveTextToCookies(new_reviews_text);
    saveImagesToLocalStorage(new_reviews_img);
    event.preventDefault();
});

// Загружаем картинку по url и превращаем ее в объект файла для загрузки в отзыв

async function loadImage(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    const image = new File([blob], "image.jpg", { type: blob.type });

    return image;
}

//Создаем по умолчанию 3 отзыва, и еще подгружаем данные из локал стореджа и куки

let reviews = [];
let new_reviews_img = loadImagesFromLocalStorage();;
let new_reviews_text = loadTextFromCookies();


Promise.all([
    loadImage("./img/patrick.jpg"),
    loadImage("./img/tiny.jpg"),
    loadImage("./img/reptilia.jpg"),
    loadImage("./img/patrick_stone.jpg"),
    loadImage("./img/tiny_dance.jpeg"),
    loadImage("./img/who.jpg"),
    loadImage("./img/stone.jpg"),
]).then(([avatar1, avatar2, avatar3, image1, image2, image3, image4]) => {
    let initialAvatar1 = avatar1;
    let initialAvatar2 = avatar2;
    let initialAvatar3 = avatar3;
    let initialImage1 = image1;
    let initialImage2 = image2;
    let initialImage3 = image3;
    let initialImage4 = image4;
    const userPatrick = new User("Патрик", initialAvatar1);
    const userTiny = new User("Тини", initialAvatar2);
    const userReptilia = new User("Ящер", initialAvatar3);
    const firstReview = new Review(userTiny, 3, [initialImage2], "Рапиру трудно найти, легко потерять, и невозможно разбить. Зато умный дом есть.");
    const secondReview = new Review(userReptilia, 4, [initialImage3, initialImage4], "Плотину надо поднять. Рычагом. Я его дам. Канал нужно завалить камнем. Камень я не дам. Он сейчас полируется в своем новом доме.");
    const thirdReview = new Review(userPatrick, 5, [initialImage1], "Камень живет в умном доме, а я в камне. Значит я тоже умный! Камень доволен... я тоже.");

    reviews = [firstReview, secondReview, thirdReview];

    new_reviews_text.forEach((reviewText, index) => {
        const [name, rating, text] = reviewText; 
        const [avatar, images] = new_reviews_img[index];
        let imageFiles = [];
        let avatarImg = null;
        if (!avatar.src.includes("null") && avatar instanceof HTMLImageElement) {
            const avatarBase64 = extractBase64FromImageSrc(avatar.src);
            avatarImg = base64ToFile(avatarBase64, 'avatar.jpg');
        }
        if (images.length > 0) {
            imageFiles = images.map((imgBase64, i) => base64ToFile(imgBase64, `image_${index}_${i}.jpg`));
        }
        new_reviews_img[index] = [avatarImg, imageFiles];
        

        const user = new User(name, avatarImg);
        const review = new Review(user, rating, imageFiles, text);

        reviews.push(review);
    });
    sortingFilteringReviews("1", "1");
});

//Фильтр и сортировка

const selectedSortElement = document.getElementById('sorting');
const selectedFilterElement = document.getElementById('filtering');

selectedSortElement.addEventListener('change', () => sortingFilteringReviews(selectedSortElement.value, selectedFilterElement.value));
selectedFilterElement.addEventListener('change', () => sortingFilteringReviews(selectedSortElement.value, selectedFilterElement.value));

function sortingFilteringReviews(sortValue, filterValue) {
    const reviewsContainer = document.getElementsByClassName("reviews-container")[0];
    if (sortValue === "1") {
        reviewsContainer.innerHTML = "";
        reviews.sort((a, b) => b.rating - a.rating);
    }
    else if (sortValue === "2") {
        reviewsContainer.innerHTML = "";
        reviews.sort((a, b) => a.rating - b.rating);
    }

    if (filterValue === "1") {
        reviewsContainer.innerHTML = "";
        reviews.forEach(review => {
            loadReview(review);
        });
    }
    else if (filterValue === "2") {
        reviewsContainer.innerHTML = "";
        reviews.forEach(review => {
            if (review.text.length <= 100) {
                loadReview(review);
            }
        });
    }
    else if (filterValue === "3") {
        reviewsContainer.innerHTML = "";
        reviews.forEach(review => {
            if (review.text.length > 100) {
                loadReview(review);
            }
        });
    }
}