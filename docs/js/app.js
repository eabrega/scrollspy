document.addEventListener("DOMContentLoaded", function (event) {
    let currentParagraphName = document.getElementById('current-paragraph-name');
    let currentParagraphPercent = document.getElementById('current-paragraph-percent');

    let scroll = new DualSideScroll.Init(
        "#cursor",
        "menu",
        x => {
            currentParagraphName.innerText = document.getElementById(x.id).innerText;
            currentParagraphPercent.innerText = x.percent;
        }
    );
});