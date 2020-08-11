const anhorTopOffset = 0;

document.addEventListener("DOMContentLoaded", function (event) {
    let scroller = new ScrollAwesome.Scroller(
        anhorTopOffset,
        "#cursor",
        "#meny",
        false,
        x => {
            console.log(x);
            let part = document.getElementById(x.id).innerText;
            document.getElementById('paragraph').innerText = part;
            document.getElementById('percent').innerText = `${x.percent} %`
        }
    );
});