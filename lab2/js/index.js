window.onload = function () {
    window.scrollTo(0, 0);
};


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


const cart = document.querySelector(".cartImage");
cart.addEventListener('click', () => {
    window.location.href = "https://qiwi.com";
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
