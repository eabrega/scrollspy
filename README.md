# dual-side scroll v1.0.1
## Назначение
Скрипт предназначен для отображения текущего положения страницы при помощи скользящего указателя в блоке навигации. 

[LiveDemo](https://eabrega.github.io/dual-side-scroll)

## Как это работает
Все что нужно - это наличие бокового блока меню с установленными ссылками на соотвествующие параграфы в тексте.
При создании объекта нужно указать селекторы курсора и меню, а так же функцию обратного вызова. 

При возникновении события onscroll в обработчик будет передан объект:
```typescript
    Progress {
        // id текущего параграфа
        id: string;
        // процент на который он был просмотрен
        percent: number;
    }
```
При изменении размера окна скрипт атоматически пересчитает пропорциональные значения. Это бывает нужно в мобильной версии. При повороте экрана устройства прокрутка продолжит работать корректно.


## Установка

`<script src="./js/lib/dual-side-scroll.min.js"></script>`

## Пример

Исходный код скрипта [LiveDemo](https://eabrega.github.io/dual-side-scroll) страницы.
```javascript
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
```

## Планируемые обновления

* Интерактивный курсор с помощью которого можно прокручивать страницу
* Закладки в параграфах
