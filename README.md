# Scroll progress (dual-side-scroll) v1.2.1
[![npm](https://img.shields.io/npm/v/dual-side-scroll?color=green)](https://www.npmjs.com/package/dual-side-scroll)
![npm](https://img.shields.io/npm/dy/dual-side-scroll)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/dual-side-scroll)
[![GitHub license](https://img.shields.io/github/license/jerosoler/Drawflow)](https://github.com/jerosoler/Drawflow/blob/master/LICENSE)


## Assignment
This tiny plugin is designed to show the progress of the page scrolling interactively. There are two types of actions: `onScrolled` and `onChanged`. 
They can be used together or separately.

- `onScrolled` - returns to the progress for each scroll event. It is convenient to use when you need to display progress in real time.
- `onChanged` - works only when one paragraph is replaced to another. This is useful for switching the active menu item in the navigation block.

[LiveDemo](https://eabrega.github.io/scroll-progress)

## How does it work?
All you need is a navigation menu with links to the relevant paragraphs in the text. When initializing an object, you need to specify cursor and menu selectors, as well as a callback function.

When the `onScrolled` event is used, an object will be sent to the processing unit:
```typescript
    Progress {
        // id of current paragraph
        Id: string;
        // % of paragraph being reviewed
        Percent: number;
    }
```
When the `onChanged` event is used, the id of the current paragraph will be sent to the processing unit.

When the window is changed in size, the script automatically will be adjuscted to the proportional value. This is sometimes needed in the mobile version. When the device screen is rotated, the scrolling will continue to work correctly.

## Installation

```
npm i dual-side-scroll
```

Take the minified version of the script from `dist` and place it in your application directory. Make sure the plugin connection string is located above the connection string of your scripts.

```html 
<script src="./<your_js_directory>/scroll-progress.min.js"></script>
```

For debugging purposes, there is an unminified version with sourcemap.

## Example

The source code of the page [LiveDemo](https://eabrega.github.io/scroll-progress) script.
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

## Planned updates
* Interactive cursor to scroll the page
* Bookmarks in paragraphs
