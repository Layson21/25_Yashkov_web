window.onload = function () {
    window.scrollTo(0, 0);
};

const header = document.getElementById("header");
var check_hover = 0;

function updateHeaderOpacity() {
    const scrollY = window.scrollY;

    if (scrollY > 10 && check_hover === 0) {
        header.style.opacity = "0.8";
    } else {
        header.style.opacity = "1";
    }
}

header.addEventListener("mouseenter", () => {
    check_hover = 1;
    updateHeaderOpacity();
});

header.addEventListener("mouseleave", () => {
    check_hover = 0;
    updateHeaderOpacity();
});

window.addEventListener("scroll", () => {
    updateHeaderOpacity();
});


const kitty_container = document.getElementById("kitty");
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
	kitty_container.appendChild(kitty);

	setTimeout(() => {kitty.remove();}, 2300);
}
