# Scroll progress (dual-side-scroll) v1.2.1
## Назначение
Этот крошечный плагин предназначен для отображения прогресса прокрутки страницы в интерактивном режиме.
Предусмотренно два типа события `onScrolled` и `onChanged`. Они могут использоваться как совместно, так и по отдельности.

- `onScrolled` - возвращет объект `progress` на каждое событие прокрутки. Его удобно использовать тогда, когда вам необходимо отображать прогресс в реальном времени
- `onChanged` - срабатывает только при смене одного параграфа на другой. Это полезно для переключения активного пункта меню в блоке навигации.


[LiveDemo](https://eabrega.github.io/scroll-progress)

## Как это работает
Все что нужно - это наличие навигационного меню с установленными ссылками на соотвествующие параграфы в тексте.
При инициализации объекта нужно указать селекторы курсора и меню, а так же функцию обратного вызова. 

При возникновении события `onScrolled` в обработчик будет передан объект:
```typescript
    Progress {
        // id текущего параграфа
        Id: string;
        // процент на который он был просмотрен
        Percent: number;
    }
```
При возникновении события `onChanged` в обработчик будет передан id текущего параграфа.

При изменении размера окна скрипт атоматически пересчитает пропорциональные значения. Это бывает нужно в мобильной версии. При повороте экрана устройства прокрутка продолжит работать корректно.


## Установка

```
npm i dual-side-scroll
```

Возьмите из `dist` минифицированную версию скрипта и поместите ее в каталог с вашим приложением. 
Позаботьтесь о том, чтобы строка подключения плагина была расположенна выше строки подключения ваших скриптов.

```html 
<script src="./<your_js_directory>/scroll-progress.min.js"></script>
```

В отладочных целях присутствует неминифицированная версия с sourcemap.

## Пример

Исходный код скрипта [LiveDemo](https://eabrega.github.io/scroll-progress) страницы.
```javascript
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
            document.querySelectorAll('a[href*="link"]')
                .forEach(element => 
                    element.classList.remove('active-meny-item')
                );
            document.querySelector(`[href="#${id}"]`).classList
                .add('active-meny-item');
        }
    );
});
```

## Планируемые обновления

* Интерактивный курсор с помощью которого можно прокручивать страницу
* Закладки в параграфах
