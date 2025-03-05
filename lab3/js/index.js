window.onload = function () {
    window.scrollTo(0, 0);
};

const header = document.getElementById("header");
let checkHover = 0;

function updateHeaderOpacity() {
    const scrollY = window.scrollY;

    if (scrollY > 10 && check_hover === 0) {
        header.style.opacity = "0.8";
    } else {
        header.style.opacity = "1";
    }
}

header.addEventListener("mouseenter", () => {
    checkHover = 1;
    updateHeaderOpacity();
});

header.addEventListener("mouseleave", () => {
    checkHover = 0;
    updateHeaderOpacity();
});

window.addEventListener("scroll", () => {
    updateHeaderOpacity();
});


const kittyContainer = document.getElementById("kitty");
function spawnKitty() {
	const randomY = Math.floor(Math.random() * (window.innerHeight * 0.8) + window.scrollY + window.innerHeight * 0.1);
	let kitty = document.createElement("img");
	kitty.src = "img/gifs/kitty-flip.gif";
	kitty.style.width = "20%";
	kitty.style.top = `${randomY}px`;
	kitty.style.position = "absolute";
	kitty.style.left = "-20%";
	kitty.style.zIndex = 1;
	kitty.style.animation = "kitty_run 2.3s linear";
	kittyContainer.appendChild(kitty);

	setTimeout(() => {kitty.remove();}, 2300);
}

const body = document.body;

const questions = [
    "Какой самый мудрый фрукт, а?",  
    "Сколько лапса кушать надо, чтобы кунг-фу постигать?",  
    "Мудрый панда сидеть, думать... Что он говорить?",  
    "Если дракон чихать, что с небом случаться?",  
    "Ты подниматься на высок гора, что там видеть?",  
    "Какой напиток в крови у мастер великий чай-церемония?",  
    "Кто настоящий дзен-мастер в бамбук лес?",  
    "Ты палка брать, быстро-быстро лапса кушать – что происходить?",  
    "Куда исчезать одна носка, когда стирать?",  
    "Почему старый мастер всегда гладить борода?",  
    "Что сильнее: один тигр или сто утка?",  
    "Если кот-хлеб с маслом падать, что делать?",  
    "Что делать, если пельмень упасть на пол? Время три секунда работать?",  
    "Ты бросать монета в фонтан, что загадывать?",    
    "Какой зверь самый ленивый, но всё равно великий?",    
    "Чем отличается хороший меч от плохой палка?",  
    "Что самый важный в боевой искусство: сила или умение есть лапса без рук?",  
    "Почему пельмени всегда быть вместе, но всё равно одинокий внутри?"  
];

const answers = [
    "личи",  
    "42",  
    "мудрость",  
    "бах",  
    "еще одна гора",  
    "чай",  
    "панда",  
    "вселенная ломаться",  
    "телепорт",  
    "набираться мудрость",  
    "утка",
    "время остановиться",  
    "пока никто не видит",  
    "миска рис",   
    "панда",    
    "меч рубить, палка бить",  
    "есть лапса без рук",  
    "пельмень грустный, но вкусный" 
];



const fakeAnswers = [
    "банан",  
    "1000",  
    "он спать",  
    "пламя",  
    "небо",  
    "кофе",  
    "обезьяна",  
    "лапса исчезать",  
    "черная дыра",  
    "борода тёплый",  
    "тигр",
    "кот зависать",  
    "нельзя есть",  
    "вечная молодость",   
    "черепаха",    
    "ничем",  
    "сила",  
    "пельмень не одинокий" 
];

currentQuestionIndex = 0;
let score = 300;
let timer, question, answer1, answer2, result, blockContent, music;

function startGame(timeout=1000, first=true) {
    if (first) {
        blockContent = document.createElement("div");
        document.body.style.overflowY = "hidden";
        blockContent.classList.add("block-content", "centered");
        blockContent.style.flexDirection = "column";
        document.body.appendChild(blockContent);
        setTimeout(() => { blockContent.style.opacity = "1"; }, 5);

        question = document.createElement("span");
        answer1 = document.createElement("span");
        answer2 = document.createElement("span");
        timer = document.createElement("span");
        result = document.createElement("img");
        music = document.createElement("audio");
        music.src = "../music/music.mp3";
        music.type ="audio/mpeg";

        question.style.fontSize = "3vw";
        answer1.style.fontSize = "2vw";
        answer2.style.fontSize = "2vw";
        timer.style.fontSize = "1.5vw";
        result.style.position = "absolute";

        question.style.color = "white";
        answer1.style.color = "white";
        answer2.style.color = "white";
        timer.style.color = "white";
        result.style.color = "white";

        question.style.fontWeight = "bold";
        answer1.style.fontWeight = "bold";
        answer2.style.fontWeight = "bold";
        timer.style.fontWeight = "bold";
        result.style.fontWeight = "bold";

        blockContent.appendChild(question);
        blockContent.appendChild(answer1);
        blockContent.appendChild(answer2);
        blockContent.appendChild(timer);
        blockContent.appendChild(music);
    }

    function startQuestionnaire() {
	    if (currentQuestionIndex >= questions.length) {
	        alert(`Тест окончен! Ваш социальный рейтинг: ${score}`);
	        if (score < 0) {
	        	alert("Ужас! Отправляться санаторий отдых уйгур!")
	        	window.location.href = "../img/pictures/mine.jpg";
	        }
	        currentQuestionIndex = 0;
	        first = 0;
	        blockContent.remove();
	        document.body.style.overflowY = "";
	        return;
	    }

	    question.textContent = questions[currentQuestionIndex];
	    let correctAnswer = answers[currentQuestionIndex];
	    let incorrectAnswer = fakeAnswers[currentQuestionIndex];

	    if (Math.random() < 0.5) {
	        answer1.textContent = `1) ${correctAnswer}`;
	        answer2.textContent = `2) ${incorrectAnswer}`;
	    } else {
	        answer1.textContent = `1) ${incorrectAnswer}`;
	        answer2.textContent = `2) ${correctAnswer}`;
	    }

	    let timeLeft = 1;
	    timer.textContent = `Осталось времени: ${timeLeft}s`;
	    let timerInterval = setInterval(() => {
	        if (timeLeft === 0) {
	            clearInterval(timerInterval);
                let userAnswer = prompt("Введите ваш ответ:");

                if (userAnswer && userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase()) {
                    score += 50;
                    result.src = "../img/pictures/plus_credit.jpg";
                } else {
                    result.src = "../img/pictures/minus_credit.jpg";
                    score -= 50;
                }
                blockContent.appendChild(result);

                setTimeout(() => {
                    result.remove();
                    currentQuestionIndex++;
                    startQuestionnaire();
                }, 2000);

	        }
	        timer.textContent = `Осталось времени: ${timeLeft}s`;
	        timeLeft--;
	    }, 1000);
	}


    setTimeout(() => {
        const start = confirm("Тест на мудрость великий китай. Пройти?");
        if (start) {
            alert("Начинаем! Любой неверный ответ - минус социальный рейтинг!");
            music.play();
            music.loop = true;
            startQuestionnaire(); 
        } else {
            alert("Мудрость ждать не будет!");
            startGame(0, false);
        }
    }, timeout);
}
