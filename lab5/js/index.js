let isEditable = true;

class Block {
    constructor(width, height, imgSrc, isMobile) {
        this.width = width;
        this.height = height;
        this.imgSrc = imgSrc || null;
        this.isMobile = isMobile;
        this.create();
        if (isMobile) this.addEvents();
        this.addContextMenu();
        if (this.imgSrc) this.addImage();
    }

	create() {
		this.block = document.createElement("div");
		this.block.style.width = `${this.width}px`;
		this.block.style.height = `${this.height}px`;
		this.block.style.position = "absolute";
		if (this.isMobile) this.block.style.cursor = "grab";

		this.block.style.top = `${(window.innerHeight - this.height) / 2}px`;
		this.block.style.left = `${(window.innerWidth - this.width) / 2}px`;

		const main = document.querySelector("main");
		main.appendChild(this.block);

		if (!isEditable) this.block.style.pointerEvents = "none";

	}

	addEvents() {
		let offsetX, offsetY, isDragging = false;

		const startDrag = (e) => {
		    if (e.type === 'mousedown' && e.button !== 0) return;
		    
		    isDragging = true;
		    this.block.style.cursor = "grabbing";

		    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
		    const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
		    
		    offsetX = clientX - this.block.getBoundingClientRect().left;
		    offsetY = clientY - this.block.getBoundingClientRect().top;

		    this.removeContextMenu();
		};

		const moveDrag = (e) => {
		    if (!isDragging) return;

		    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
		    const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

		    let newX = clientX - offsetX;
		    let newY = clientY - offsetY;

		    newX = Math.max(0, Math.min(newX, window.innerWidth - this.width));
		    newY = Math.max(0, Math.min(newY, window.innerHeight - this.height - 10));

		    this.block.style.left = `${newX}px`;
		    this.block.style.top = `${newY}px`;
		};

		const endDrag = () => {
		    isDragging = false;
		    this.block.style.cursor = "grab";
		    saveBlocks(); 
		};

		this.block.addEventListener("mousedown", startDrag);
	    document.addEventListener("mousemove", moveDrag);
	    document.addEventListener("mouseup", endDrag);

	    this.block.addEventListener("touchstart", startDrag);
	    document.addEventListener("touchmove", moveDrag);
	    document.addEventListener("touchend", endDrag);
	}

	addImage() {
        if (!this.imgSrc) return;

        const img = document.createElement("img");
        img.src = this.imgSrc;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        img.classList.add("untouchable");

        this.block.appendChild(img);
    }

	addContextMenu() {
		this.block.addEventListener("contextmenu", (e) => {
			if (!isEditable) return;

			e.preventDefault();

			this.removeContextMenu();

			const deleteButton = document.createElement("div");
			deleteButton.innerText = "Удалить";
			deleteButton.classList.add("delete-menu");

			deleteButton.style.top = `${e.clientY}px`;
			deleteButton.style.left = `${e.clientX}px`;

			document.body.appendChild(deleteButton);

			deleteButton.addEventListener("click", () => {
			    this.block.remove();
			    this.removeContextMenu();
			    blocks = blocks.filter(b => b !== this);
			    saveBlocks(); 
			});

			document.addEventListener("click", (event) => {
				if (!deleteButton.contains(event.target) && event.target !== this.block) {
					this.removeContextMenu();
				}
			}, { once: true });
		});
	}

	removeContextMenu() {
		const oldMenu = document.querySelector(".delete-menu");
		if (oldMenu) oldMenu.remove();
	}

	getHTML() {
		return this.block;
	}

	toJSON() {
    	return {
        	type: this.constructor.name,
        	width: this.width,
        	height: this.height,
        	imgSrc: this.imgSrc,
        	isMobile: this.isMobile,
        	position: { 
            	left: this.block.style.left, 
         		top: this.block.style.top 
      	    }
    	};
	}

    static fromJSON(data) {
        const block = new Block(data.width, data.height, data.imgSrc, data.isMobile);
        block.block.style.left = data.position.left;
        block.block.style.top = data.position.top;
        return block;
    }
}

class ImgBlock extends Block {
    constructor(imgSrc, isMobile) {
        super(300, 500, imgSrc, isMobile);
        this.innerImg = null;
        this.addUploadButton();
        this.updateEditMode();
    }

    addUploadButton() {
        this.uploadButton = document.createElement("div");
        this.uploadButton.innerText = "+";
        this.uploadButton.classList.add("upload-button");
        this.block.appendChild(this.uploadButton);

        this.fileInput = document.createElement("input");
        this.fileInput.type = "file";
        this.fileInput.accept = "image/*";
        this.fileInput.style.display = "none";
        this.block.appendChild(this.fileInput);

        this.uploadButton.addEventListener("click", () => this.fileInput.click());
        this.fileInput.addEventListener("change", (event) => this.handleImageUpload(event));
    }

handleImageUpload(event) {
    const file = event.target.files[0];

    if (file) {
        if (!file.type.startsWith("image/")) {
            alert("Пожалуйста, загрузите изображение.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            this.addInnerImage(reader.result); 
        };
        reader.readAsDataURL(file);
    }
}

addInnerImage(imgSrc, first=0) {
    if (!imgSrc) return;

    if (this.innerImg) this.innerImg.remove(); 

    this.innerImg = document.createElement("img");
    this.innerImg.src = imgSrc;
    this.innerImg.classList.add("inner-image");
    this.innerImg.addEventListener("click", () => this.fileInput.click());
    
    this.block.appendChild(this.innerImg);
    this.updateEditMode();
    saveBlocks(first);
}

    updateEditMode() {
        this.uploadButton.style.display = isEditable && !this.innerImg ? "flex" : "none";
    }

    toJSON() {
    	return { 
        	...super.toJSON(), 
        	innerImg: this.innerImg ? this.innerImg.src : null 
    	};
	}


    static fromJSON(data) {
    	const block = new ImgBlock(data.imgSrc, data.isMobile);
    	if (data.innerImg) block.addInnerImage(data.innerImg, 1);
    	block.block.style.left = data.position.left;
    	block.block.style.top = data.position.top;
    	return block;
	}

}

class TextBlock extends Block {
    constructor(imgSrc, isMobile) {
        super(300, 500, imgSrc, isMobile);
        this.text = "";
        this.createTextArea();
        this.updateEditMode();
    }

    createTextArea() {
	    this.textArea = document.createElement("textarea");
	    this.textArea.classList.add("text-area");
	    this.textArea.maxLength = 270;

	    this.saveButton = document.createElement("button");
	    this.saveButton.innerText = "Сохранить";
	    this.saveButton.classList.add("save-button");
	    this.saveButton.addEventListener("click", () => this.save());

	    this.textDisplay = document.createElement("div");
	    this.textDisplay.classList.add("text-display");
	    this.textDisplay.addEventListener("click", () => this.edit());

	    const container = document.createElement("div");
	    container.classList.add("text-container");

	    container.appendChild(this.textArea);
	    container.appendChild(this.saveButton);
	    container.appendChild(this.textDisplay);
	    this.block.appendChild(container);
	}


    save(first) {
    	this.text = this.textArea.value.trim();

    	const lineBreaksCount = (this.text.match(/\n/g) || []).length;

    	const baseLength = this.text.replace(/\n/g, "").length;

    	const adjustedLength = baseLength + lineBreaksCount * 27;

    	if (adjustedLength > 270) {
    	    alert("Текст слишком большой.");
    	    return;
    	}

    	this.textDisplay.innerText = this.text;

    	this.updateEditMode();
    	saveBlocks(first+0);
	}

    edit() {
        if (!isEditable) return;
        this.updateEditMode();
    }

    updateEditMode() {
        const isEdit = isEditable;
        this.textArea.style.display = isEdit ? "block" : "none";
        this.saveButton.style.display = isEdit ? "block" : "none";
        this.textDisplay.style.display = isEdit ? "none" : "block";
    }

    toJSON() {
    	return { 
    	    ...super.toJSON(), 
    	    text: this.textArea.value.trim() 
    	};
	}


    static fromJSON(data) {
    	const block = new TextBlock(data.imgSrc, data.isMobile);
    	block.textArea.value = data.text;
    	block.save(1);
    	block.block.style.left = data.position.left;
    	block.block.style.top = data.position.top;
    	return block;
	}
}

class FormBlock extends Block {
    constructor(imgSrc, isMobile) {
        super(300, 500, imgSrc, isMobile);
        this.name = "";
        this.gender = "М";
        this.age = "";
        this.race = "";
        this.createForm(this.name);
        this.updateEditMode();
    }

    createForm() {
	    this.nameInput = document.createElement("input");
	    this.nameInput.classList.add("form-input");
	    this.nameInput.placeholder = "Имя";
	    this.nameInput.maxLength = 25;

	    this.genderSelect = document.createElement("select");
	    this.genderSelect.classList.add("form-input");
	    ["М", "Ж"].forEach(g => {
	        let option = document.createElement("option");
	        option.value = g;
	        option.innerText = g;
	        this.genderSelect.appendChild(option);
	    });

	    this.ageInput = document.createElement("input");
	    this.ageInput.classList.add("form-input");
	    this.ageInput.placeholder = "Возраст";
	    this.ageInput.type = "number";
	    this.ageInput.min = 1;
		this.ageInput.max = 120;

		this.raceSelect = document.createElement("select");
	    this.raceSelect.classList.add("form-input");
	    ["Человек", "Дворф", "Гном", "Эльф", "Тролль", "Орк", "Гнолл", "Неизвестно"].forEach(g => {
	        let option = document.createElement("option");
	        option.value = g;
	        option.innerText = g;
	        this.raceSelect.appendChild(option);
	    });

	    this.saveButton = document.createElement("button");
	    this.saveButton.innerText = "Сохранить";
	    this.saveButton.classList.add("save-button");
	    this.saveButton.addEventListener("click", () => this.save());

	    this.textDisplay = document.createElement("div");
	    this.textDisplay.classList.add("text-display");
	    this.textDisplay.addEventListener("click", () => this.edit());

	    const container = document.createElement("div");
	    container.classList.add("form-container");

	    container.appendChild(this.nameInput);
	    container.appendChild(this.genderSelect);
	    container.appendChild(this.ageInput);
	    container.appendChild(this.raceSelect);
	    container.appendChild(this.saveButton);
	    container.appendChild(this.textDisplay);
	    this.block.appendChild(container);
	}


    save(first=0) {
    	this.name = this.nameInput.value.trim();

    	if (this.name.length < 4 || this.name.length > 25) {
    	    if (!first) alert("Имя не может быть меньше 4 символов и превышать 25 символов.");
    	    else this.nameInput.value = "Name";
    	    this.name = "Name";
    	}

    	this.gender = this.genderSelect.value;

    	this.age = parseInt(this.ageInput.value.trim(), 10);

    	if (isNaN(this.age) || this.age < 1 || this.age > 1000) {
    	    if (!first) alert("Возраст должен быть между 1 и 1000.");
    	    else this.ageInput.value = "2";
    	    this.age = 2;
    	}

    	this.race = this.raceSelect.value;

    	this.textDisplay.innerText = `Имя: ${this.name}\nПол: ${this.gender}\nВозраст: ${this.age}\nРаса: ${this.race}`;
    	this.updateEditMode();
    	saveBlocks(first);
	}

    edit() {
        if (!isEditable) return;
        this.updateEditMode();
    }

    updateEditMode() {
        const isEdit = isEditable;
        this.nameInput.style.display = isEdit ? "block" : "none";
        this.genderSelect.style.display = isEdit ? "block" : "none";
        this.ageInput.style.display = isEdit ? "block" : "none";
        this.saveButton.style.display = isEdit ? "block" : "none";
        this.raceSelect.style.display = isEdit ? "block" : "none";
        this.textDisplay.style.display = isEdit ? "none" : "block";
    }

    toJSON() {
    	return { 
    	    ...super.toJSON(), 
    	    name: this.nameInput.value.trim(), 
    	    gender: this.genderSelect.value, 
    	    age: this.ageInput.value.trim(),
    	    race: this.raceSelect.value 
    	};
	}


    static fromJSON(data) {
    	const block = new FormBlock(data.imgSrc, data.isMobile);
    	block.nameInput.value = data.name;
    	block.genderSelect.value = data.gender;
    	block.ageInput.value = data.age;
    	block.raceSelect.value = data.race;
    	block.save(1);
    	block.block.style.left = data.position.left;
    	block.block.style.top = data.position.top;
    	return block;
	}
}


function siteConstuctor() {
	const body = document.body;
	body.style.background = "url('./img/background.jpg')";
	body.style.backgroundSize = "cover";

	const header = document.createElement("header");

	const title = document.createElement("h1");
	title.innerText = "доска объявлений";
	title.classList.add("title", "untouchable");
	header.appendChild(title);

	const sign = document.createElement("img");
	sign.src = "./img/sign.png";
	sign.classList.add("sign", "untouchable");
	header.appendChild(sign);

	const pencil = document.createElement("img");
	pencil.src = "./img/pencil.png";
	pencil.classList.add("pencil");
	header.appendChild(pencil);

	const plus = document.createElement("img");
	plus.src = "./img/plus.png";
	plus.classList.add("plus");
	header.appendChild(plus);

	const main = document.createElement("main");

	const footer = document.createElement("footer");

	body.appendChild(header);
	body.appendChild(main);
	body.appendChild(footer);

	loadBlocks();
}

function toggleEditMode() {
    isEditable = !isEditable;

    document.querySelector(".pencil").style.filter = isEditable ? "invert(50%)" : "none";

    document.querySelector(".plus").style.display = isEditable ? "block" : "none";

    document.querySelectorAll("main > div").forEach(block => {
        block.style.pointerEvents = isEditable ? "auto" : "none";
    });

    blocks.forEach(block => {
        if (block.updateEditMode) block.updateEditMode();
    });

    if (!isEditable) removeBlockSelectionMenu();
}

let blocks = [];

function createBlock(BlockType, imgSrc) {
    const newBlock = new BlockType(imgSrc, true);
    blocks.push(newBlock);
    saveBlocks();
}

function showBlockSelection() {
    if (!isEditable) return;

    removeBlockSelectionMenu(); 

    const menu = document.createElement("div");
    menu.classList.add("block-selection-menu");

    const options = [
        { name: "Изображение", type: ImgBlock, img: "./img/wanted.png" },
        { name: "Форма", type: FormBlock, img: "./img/paper.png" },
        { name: "Текст", type: TextBlock, img: "./img/paper.png" }
    ];

    options.forEach(option => {
        const btn = document.createElement("div");
        btn.classList.add("block-option");
        btn.innerText = option.name;
        btn.addEventListener("click", () => {
            createBlock(option.type, option.img);
            removeBlockSelectionMenu();
        });

        menu.appendChild(btn);
    });

    document.body.appendChild(menu);

    menu.style.position = "absolute";
    menu.style.top = `${plus.getBoundingClientRect().bottom + 10}px`;
    menu.style.left = `${plus.getBoundingClientRect().left}px`;

    document.addEventListener("mousedown", (event) => {
        if (!menu.contains(event.target) && event.target !== plus) {
            removeBlockSelectionMenu();
        }
    }, { once: true });
}

function removeBlockSelectionMenu() {
    const oldMenu = document.querySelector(".block-selection-menu");
    if (oldMenu) oldMenu.remove();
}

function saveBlocks(first=0) {
	if (!first)
	{
	    const data = blocks.map(block => block.toJSON());
	    localStorage.setItem("blocks", JSON.stringify(data));
    }
}

function loadBlocks() {
    const data = JSON.parse(localStorage.getItem("blocks") || "[]");
    
    if (data.length === 0) {
        createBlock(TextBlock, "./img/paper.png");
        blocks[0].textArea.value = "Информация.\n\n Удалять, добавлять и перемещать блоки можно только в режиме редактирования. Для удаления нажмите на блок правой кнопкой мыши.";
	    blocks[0].save(1);
	    saveBlocks(1);
    }
    else {
	    blocks = data.map(blockData => {
	        switch (blockData.type) {
	            case "ImgBlock":
	                return ImgBlock.fromJSON(blockData);
	            case "TextBlock":
	                return TextBlock.fromJSON(blockData);
	            case "FormBlock":
	                return FormBlock.fromJSON(blockData);
	            default:
	                return Block.fromJSON(blockData);
	        }
	    });
    }
    toggleEditMode();
}


siteConstuctor();

const pencil = document.querySelector(".pencil");
pencil.addEventListener("click", toggleEditMode);

const plus = document.querySelector(".plus");
plus.addEventListener("click", showBlockSelection);



