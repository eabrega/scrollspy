document.addEventListener("DOMContentLoaded", function (event) {
    let currentParagraphName = document.getElementById('current-paragraph-name');
    let currentParagraphPercent = document.getElementById('current-paragraph-percent');

    new ScrollProgress.Init(
        "#cursor",
        "menu",
        progress => {
            currentParagraphName.innerText = document.getElementById(progress.Id).innerText;
            currentParagraphPercent.innerText = progress.Percent + '%';
        },
        id => {
            document.querySelectorAll('a[href*="link"]').forEach(element => element.classList.remove('active-meny-item'));
            document.querySelector(`[href="#${id}"]`).classList.add('active-meny-item');
        }
    );
});