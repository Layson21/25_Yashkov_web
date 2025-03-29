import {siteConstructor} from './constructor.js';

siteConstructor();

const BASE_URL = "https://learnproject-2530f-default-rtdb.asia-southeast1.firebasedatabase.app";

class ProductManager {
    static async delete (id) {
        const url = `${BASE_URL}/store/${id}.json`;

        try {
            const response = await fetch(url, {
              method: 'DELETE'
            });

            if (!response.ok) throw new Error("Ошибка удаления товара.");
            if (response.status === 200) {
                console.log("Товар был успешно удален!");
                return true;
            }
        }
        catch (error){
            if (error instanceof TypeError) {
                console.log("Проверьте стабильность вашего интернет-соединения.");
            }
            console.log(error.message);
            return false;
        }   
    }

    static async update(id, product) {
        const url = `${BASE_URL}/store/${id}.json`;

        try {

            const response = await fetch(url, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });

            if (!response.ok) throw new Error("Ошибка изменения товара.");

            const data = await response.json();
            if (response.status === 200) {
                console.log(`Товар был успешно изменен!`);
                console.log("Дата:",data);
                return data;
            }
        }
        catch (error){
            if (error instanceof TypeError) {
                console.log("Проверьте стабильность вашего интернет-соединения.");
            }
            console.log(error.message);
            return false;
        }  
    }

    static async modify(id, product) {
        const url = `${BASE_URL}/store/${id}.json`;

        try {
            const response = await fetch(url, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });

            if (!response.ok) throw new Error("Ошибка изменения данных товара.");

            const data = await response.json();
            if (response.status === 200) {
                console.log(`Данные товара были успешно изменены!`);
                console.log("Дата:",data);
                return data;
            }
        }
        catch (error){
            if (error instanceof TypeError) {
                console.log("Проверьте стабильность вашего интернет-соединения.");
            }
            console.log(error.message);
            return false;
        }  
    }

    static createBlock(product) {
        let check = true;
        if (Object.keys(product).length === 0) {
            product = {
                title: "Товаров по вашему запросы не было найдено",
            };
            check = false;
        }
        const productBlock = document.createElement("div");
        productBlock.classList.add("product-box");

        const header = document.createElement('div');
        header.classList.add("product-header");

        const title = document.createElement("h2");
        title.innerHTML = product.title;
        title.classList.add("product-title");
        header.appendChild(title);

        const searchResultsBox = document.getElementsByClassName("search-results-box")[0];

        if (check && product.status !== 0) {
            const buttonBox = document.createElement("div");
            buttonBox.classList.add("product-buttons-box");

            const deleteProductButton = document.createElement("button");
            deleteProductButton.innerText = "Удалить";
            buttonBox.appendChild(deleteProductButton);

            const updateProductButton = document.createElement("button");
            updateProductButton.innerText = "Обновить";
            buttonBox.appendChild(updateProductButton);

            const changeProductButton = document.createElement("button");
            changeProductButton.innerText = "Изменить";
            buttonBox.appendChild(changeProductButton);

            header.appendChild(buttonBox);

            productBlock.appendChild(header);

            const infoBox = document.createElement("div");
            infoBox.classList.add("product-info");

            const textInfoBox = document.createElement("div");
            textInfoBox.classList.add("product-text-info");
      
            const category = document.createElement("div");
            category.innerHTML = `<b><u>Category:</u></b> ${product.category}`;
            category.classList.add("category");
            textInfoBox.appendChild(category);

            const description = document.createElement("div");
            description.innerHTML = `<b><u>Description:</u></b> ${product.description}`;
            description.classList.add("description");
            textInfoBox.appendChild(description);

            infoBox.appendChild(textInfoBox);

            const imgInfoBox = document.createElement("div");
            imgInfoBox.classList.add("product-img-info"); 

            const img = document.createElement("img");
            img.src = product.image;
            img.referrerpolicy = "no-referrer";
            img.classList.add("product-img");
            imgInfoBox.appendChild(img);

            infoBox.appendChild(imgInfoBox);

            productBlock.appendChild(infoBox);

            const price = document.createElement("div");
            price.innerText = `Price: ${product.price}`;
            price.classList.add("price");
            productBlock.appendChild(price);

            deleteProductButton.addEventListener("click", () => {
                const confirmed = confirm("Вы уверены, что хотите удалить этот товар?");
                if (confirmed) {
                    const activeElements = document.querySelectorAll("button, input, textarea");
                    activeElements.forEach(button => {
                        button.disabled = true; 
                    }); 
                    ProductManager.delete(product.id).then(isDeleted => { 
                        activeElements.forEach(button => {
                            button.disabled = false; 
                        }); 
                        if (!isDeleted) return alert("Не удалось удалить товар! Повторите попытку позже.");
                        alert("Товар был успешно удален!");
                        searchResultsBox.removeChild(productBlock);
                    });
                }
            });

            updateProductButton.addEventListener("click", () => {
                const addBlock = createForm();

                const main = document.querySelector("main");
                main.appendChild(addBlock);

                const closeButton = document.getElementsByClassName("close-button")[0];
                const inputTitle = document.getElementById("input-title");
                const inputDescription = document.getElementById("input-description");
                const inputCategory = document.getElementById("input-category");
                const inputPrice = document.getElementById("input-price");
                const inputImage = document.getElementById("input-image");
                const form = document.querySelector("form");

                closeButton.addEventListener("click", () => {
                    main.removeChild(addBlock);
                    const activeElements = document.querySelectorAll("button, input, textarea");
                    activeElements.forEach(button => {
                        button.disabled = false; 
                    });
                });

                form.addEventListener("submit", () => {
                    event.preventDefault();

                    if (!inputTitle.value.trim() || inputTitle.value.trim().length < 5) return alert("Введите название товара(не менее 5 символов)");
                    if (!inputCategory.value.trim() || inputCategory.value.trim().length < 5) return alert("Введите категорию товара(не менее 5 символов)");
                    if (!inputDescription.value.trim() || inputDescription.value.trim().length < 50) return alert("Введите описание товара(не менее 50 символов)");
                    if (!inputPrice.value || isNaN(Number(inputPrice.value)) || Number(inputPrice.value) <= 0) return alert("Введите корректную цену");
                    if (inputImage.files.length === 0) return alert("Выберите изображение");

                    const file = inputImage.files[0];
                    if (!file.type.startsWith("image/")) return alert("Некорректный формат. Выберите изображение.");

                    const activeElements = document.querySelectorAll("button, input, textarea");
                    activeElements.forEach(button => {
                        button.disabled = true; 
                    });

                    ProductManager.uploadImg(file).then(url => {
                        if (url.length === 0) {
                            alert("Не удалось загрузить изображение. Выберите другое изображение или повторите попытку позже.")
                            activeElements.forEach(button => {
                                button.disabled = false; 
                            });
                            return;
                        }
                        const productInfo = {
                            title: inputTitle.value.trim(),
                            category: inputCategory.value.trim(),
                            price:inputPrice.value,
                            description: inputDescription.value.trim(),
                            image: url
                        }
                        ProductManager.update(product.id, productInfo).then(newProduct => {
                            activeElements.forEach(button => {
                                button.disabled = false; 
                            });
                            if (!newProduct) return alert('Не удалось обновить товар. Повторите попытку позже.');
                            alert("Товар успешно обновлен.");
                            title.innerText = newProduct.title;
                            category.innerHTML = `<b><u>Category:</u></b> ${newProduct.category}`;
                            description.innerHTML = `<b><u>Description:</u></b> ${newProduct.description}`;
                            price.innerText = `Price: ${newProduct.price}`;
                            img.src = newProduct.image;
                            main.removeChild(addBlock);
                        });
                    });
                });
            });

            changeProductButton.addEventListener("click", () => {
                const addBlock = createForm();

                const main = document.querySelector("main");
                main.appendChild(addBlock);

                const closeButton = document.getElementsByClassName("close-button")[0];
                const inputTitle = document.getElementById("input-title");
                const inputDescription = document.getElementById("input-description");
                const inputCategory = document.getElementById("input-category");
                const inputPrice = document.getElementById("input-price");
                const inputImage = document.getElementById("input-image");
                const form = document.querySelector("form");

                closeButton.addEventListener("click", () => {
                    main.removeChild(addBlock);
                    const activeElements = document.querySelectorAll("button, input, textarea");
                    activeElements.forEach(button => {
                        button.disabled = false; 
                    });
                });

                form.addEventListener("submit", () => {
                    event.preventDefault();

                    const productInfo = {};

                    if (inputTitle.value.trim().length > 0 && inputTitle.value.trim().length < 5) return alert("Введите название товара(не менее 5 символов)");
                    else if (inputTitle.value.trim().length !== 0) productInfo.title = inputTitle.value.trim();

                    if (inputCategory.value.trim().length > 0 && inputCategory.value.trim().length < 5) return alert("Введите категорию товара(не менее 5 символов)");
                    else if (inputCategory.value.trim().length !== 0) productInfo.category = inputCategory.value.trim();

                    if (inputDescription.value.trim().length > 0 && inputDescription.value.trim().length < 50) return alert("Введите описание товара(не менее 50 символов)");
                    else if (inputDescription.value.trim().length !== 0) productInfo.description = inputDescription.value.trim();

                    if (inputPrice.value.trim().length > 0 && (isNaN(Number(inputPrice.value)) || Number(inputPrice.value) <= 0)) return alert("Введите корректную цену");
                    else if (inputPrice.value.trim() > 0) productInfo.price = inputPrice.value;    

                    const activeElements = document.querySelectorAll("button, input, textarea");
                    activeElements.forEach(button => {
                        button.disabled = true; 
                    });

                    if (inputImage.files.length > 0) {
                        const file = inputImage.files[0];
                        if (!file.type.startsWith("image/")) return alert("Некорректный формат. Выберите изображение.");

                        ProductManager.uploadImg(file).then(url => {
                            if (url.length === 0) {
                                alert("Не удалось загрузить изображение. Выберите другое изображение или повторите попытку позже.")
                                activeElements.forEach(button => {
                                    button.disabled = false; 
                                });
                                return;
                            }
                            productInfo.image = url;

                            ProductManager.modify(product.id, productInfo).then(newProduct => {
                                activeElements.forEach(button => {
                                    button.disabled = false; 
                                });
                                if (!newProduct) return alert('Не удалось обновить данные товара. Повторите попытку позже.');
                                alert("Данные товара успешно обновлены.");

                                if ("title" in newProduct) {
                                    title.innerText = newProduct.title;
                                }

                                if ("category" in newProduct) {
                                    category.innerHTML = `<b><u>Category:</u></b> ${newProduct.category}`;
                                }

                                if ("description" in newProduct) {
                                    description.innerHTML = `<b><u>Description:</u></b> ${newProduct.description}`;
                                }

                                if ("price" in newProduct) {
                                    price.innerText = `Price: ${newProduct.price}`;
                                }

                                if ("image" in newProduct) {
                                    img.src = newProduct.image;
                                }

                                main.removeChild(addBlock);
                            });
                        });
                    }
                    else {
                        ProductManager.modify(product.id, productInfo).then(newProduct => {
                            activeElements.forEach(button => {
                                button.disabled = false; 
                            });
                            if (!newProduct) return alert('Не удалось обновить данные товара. Повторите попытку позже.');
                            alert("Данные товара успешно обновлены.");

                            if ("title" in newProduct) {
                                title.innerText = newProduct.title;
                            }

                            if ("category" in newProduct) {
                                category.innerHTML = `<b><u>Category:</u></b> ${newProduct.category}`;
                            }

                            if ("description" in newProduct) {
                                description.innerHTML = `<b><u>Description:</u></b> ${newProduct.description}`;
                            }

                            if ("price" in newProduct) {
                                price.innerText = `Price: ${newProduct.price}`;
                            }

                            main.removeChild(addBlock);
                        });
                    }
                });
            });
        }
        else {
            productBlock.appendChild(header);
        }

        searchResultsBox.appendChild(productBlock);
    }

    static loadProducts(filter, products) {
        if (products[0].status === 0) {
            this.createBlock(products[0]);
            return false;
        }
        filter = filter.toLowerCase();
        const filtered = products.filter(product => (product.title.toLowerCase().includes(filter) || product.category.toLowerCase().includes(filter) || product.description.toLowerCase().includes(filter)));
        console.log(filtered);
        if (filtered.length === 0) {
            this.createBlock({});
        }

        filtered.forEach(product => ProductManager.createBlock(product));
        return true;
    }

    static async getProducts() {
        const url = `${BASE_URL}/store.json`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Ошибка загрузки товаров.");

            const data = await response.json();
            if (!data) throw new Error("Товары не были найдены.");
            return Object.entries(data).map(([id, obj]) => ({ id, ...obj }));;
        }
        catch (error){
            if (error instanceof TypeError) {
                return [{
                    title: "Проверьте стабильность вашего интернет-соединения.",
                    status: 0
                }];
            }
            console.log(error.message);
            return [];
        }
    }

    static async create(product) {
        const url = `${BASE_URL}/store.json`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            })

            if (!response.ok) throw new Error("Не удалось добавить товар.");

            const data = await response.json();
            console.log(data);
            return true;
        }
        catch (error) {
            console.log(error.message);
            return false;
        }
    }

    static async uploadImg(file) {
        const url = "https://api.imgur.com/3/image";
        const CLIENT_ID = "caefbe5107ad923";

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Client-ID ${CLIENT_ID}`
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Не удалось загрузить изображение на сервис.")

            const data = await response.json();
            if (data.success) {
                const imageUrl = data.data.link;
                console.log(`Url: ${imageUrl}`);
                return imageUrl;
            }
            else {
                console.log("Не удалось получить url изображения", data)
            }

        }
        catch (error) {
            console.log(error.message);
            return "";
        }
    }
}

const searchButton = document.getElementsByClassName("search-button")[0];
const searchField = document.getElementsByClassName("search-field")[0];
const searchResultsBox = document.getElementsByClassName("search-results-box")[0];

const addButton = document.getElementById("add-button");

async function search() {
    const activeElements = document.querySelectorAll("button, input, textarea");
    searchResultsBox.replaceChildren();
    activeElements.forEach(button => {
        button.disabled = true; 
    });
    ProductManager.getProducts().then(products => {
        console.log(products);

        const isLoaded = ProductManager.loadProducts(searchField.value, products);
        if (!isLoaded) alert("Не удалось загрузить товары.");

        activeElements.forEach(button => {
            button.disabled = false; 
        });
    });
}

searchButton.addEventListener('click', search);
searchField.addEventListener('keydown', () => {
    if (event.key === "Enter") search();
});

function createForm() {
    const activeElements = document.querySelectorAll("button, input, textarea");
    activeElements.forEach(button => {
        button.disabled = true; 
    });

    const addBlock = document.createElement("div");
    addBlock.classList.add("add-block");

    const closeButton = document.createElement("button");
    closeButton.classList.add("close-button");
    closeButton.innerText = "X";
    addBlock.appendChild(closeButton);

    const titleBlock = document.createElement("h2");
    titleBlock.innerText = "Введите данные:";
    titleBlock.id = "product-title-block";
    addBlock.appendChild(titleBlock);

    const form = document.createElement("form");
    form.classList.add("form");

    const inputTitle = document.createElement("input");
    inputTitle.classList.add("input-info");
    inputTitle.id = "input-title";
    inputTitle.title = "Название товара";
    inputTitle.placeholder = "Название товара";

    const inputCategory = document.createElement("input");
    inputCategory.classList.add("input-info");
    inputCategory.id = "input-category";
    inputCategory.title = "Категория товара";
    inputCategory.placeholder = "Категория товара";

    const inputDescription = document.createElement("textarea");
    inputDescription.classList.add("input-info");
    inputDescription.id = "input-description";
    inputDescription.title = "Описание товара";
    inputDescription.placeholder = "Описание товара";

    const inputPrice = document.createElement("input");
    inputPrice.classList.add("input-info");
    inputPrice.id = "input-price";
    inputPrice.title = "Цена товара";
    inputPrice.placeholder = "Цена товара";


    const inputImage = document.createElement("input");
    inputImage.type = "file";
    inputImage.id = "input-image";
    inputImage.accept = "image/*";
    inputImage.classList.add("input-info");

    const submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.value = "Отправить";
    submitButton.classList.add("buttons");

    form.appendChild(inputTitle);
    form.appendChild(inputCategory);
    form.appendChild(inputDescription);
    form.appendChild(inputPrice);
    form.appendChild(inputImage);
    form.appendChild(submitButton);

    addBlock.appendChild(form);

    return addBlock;
}

addButton.addEventListener('click', () => { 
    const addBlock = createForm();

    const main = document.querySelector("main");
    main.appendChild(addBlock);

    const closeButton = document.getElementsByClassName("close-button")[0];
    const inputTitle = document.getElementById("input-title");
    const inputDescription = document.getElementById("input-description");
    const inputCategory = document.getElementById("input-category");
    const inputPrice = document.getElementById("input-price");
    const inputImage = document.getElementById("input-image");
    const form = document.querySelector("form");

    closeButton.addEventListener("click", () => {
        main.removeChild(addBlock);
        const activeElements = document.querySelectorAll("button, input, textarea");
        activeElements.forEach(button => {
            button.disabled = false; 
        });
    });

    form.addEventListener("submit", () => {
        event.preventDefault();

        if (!inputTitle.value.trim() || inputTitle.value.trim().length < 5) return alert("Введите название товара(не менее 5 символов)");
        if (!inputCategory.value.trim() || inputCategory.value.trim().length < 5) return alert("Введите категорию товара(не менее 5 символов)");
        if (!inputDescription.value.trim() || inputDescription.value.trim().length < 50) return alert("Введите описание товара(не менее 50 символов)");
        if (!inputPrice.value || isNaN(Number(inputPrice.value)) || Number(inputPrice.value) <= 0) return alert("Введите корректную цену");
        if (inputImage.files.length === 0) return alert("Выберите изображение");

        const file = inputImage.files[0];
        if (!file.type.startsWith("image/")) return alert("Некорректный формат. Выберите изображение.");

        const activeElements = document.querySelectorAll("button, input, textarea");
        activeElements.forEach(button => {
            button.disabled = true; 
        });

        ProductManager.uploadImg(file).then(url => {
            if (url.length === 0) {
                alert("Не удалось загрузить изображение. Выберите другое изображение или повторите попытку позже.")
                activeElements.forEach(button => {
                    button.disabled = false; 
                });
                return;
            }
            const product = {
                title: inputTitle.value.trim(),
                category: inputCategory.value.trim(),
                price:inputPrice.value,
                description: inputDescription.value.trim(),
                image: url
            }
            ProductManager.create(product).then(isCreated => {
                activeElements.forEach(button => {
                    button.disabled = false; 
                });
                if (!isCreated) return alert('Не удалось добавить товар. Повторите попытку позже.');
                alert("Товар успешно добавлен в магазин.");
                main.removeChild(addBlock);
            });
        });
    });
}); 
