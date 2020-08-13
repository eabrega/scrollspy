# dual-side scroll v1.0
## Назначение
Эта  предназначенна для отображениея текущего положения страницы при помщи скользящего указателя в блоке навигации.

Всякий раз когда просиходит событие `onScroll` функция обратного вызова возвращает id текущего параграфа и процент на который он был "прокручен".

## Как это работает
Все что нужно для коректной работы - это наличие бокового блока меню с установленными ссылками на соотвествующие парагрфы в тексте.

## Использование

`(html)`

## Пример

Исхдный код Demo страницы.
```javascript
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
```

## Известные проблемы

При изменении размера экрана необходимо перезагрузить страниуц или пересоздать объект, так-как пропорции не будут пересчитанны.

## Планируемые обновления

* 11
