"use strict";
var ScrollAwesome;
(function (ScrollAwesome) {
    class Cursor {
        constructor(cursorBody) {
            this._cursorBody = cursorBody;
        }
        Move(topPosition) {
            this._cursorBody.style.top = `${topPosition}px`;
        }
        get Height() {
            return this._cursorBody.getBoundingClientRect().height;
        }
    }
    ScrollAwesome.Cursor = Cursor;
})(ScrollAwesome || (ScrollAwesome = {}));
var ScrollAwesome;
(function (ScrollAwesome) {
    class MenuItem {
        constructor(id, height) {
            this._id = id;
            this._height = height;
        }
        get Id() {
            return this._id;
        }
        get Height() {
            return this._height;
        }
    }
    ScrollAwesome.MenuItem = MenuItem;
})(ScrollAwesome || (ScrollAwesome = {}));
var ScrollAwesome;
(function (ScrollAwesome) {
    class Menu {
        constructor(cursorBody, menuBody, menuItems) {
            this._cursor = new ScrollAwesome.Cursor(cursorBody);
            this._menuItems = menuItems;
            this._menuBody = menuBody;
            this._debugWindow = (document.createElement('div'));
            this._debugWindow.id = "debug-window";
            this._menuBody.appendChild(this._debugWindow);
        }
        UpdateCursorPosition(progress) {
            let indexParagraph = this._menuItems.findIndex(i => i.Id == progress.id);
            let height = this._menuItems
                .filter((item, index) => {
                if (index < indexParagraph + 1) {
                    return item.Height;
                }
            })
                .map((item) => item.Height)
                .reduce((sum, curent) => sum + curent);
            let currentItemHeight = this._menuItems[indexParagraph].Height;
            let curentCursorPosition = (height - currentItemHeight + this._cursor.Height) + (currentItemHeight * progress.percent / 100);
            this._cursor.Move(curentCursorPosition);
        }
        UpdateDebudWindow(params) {
            var rows = params.map((param) => {
                return `${param.name}: ${param.value}<br/>`;
            });
            this._debugWindow.innerHTML = rows.join("");
        }
    }
    ScrollAwesome.Menu = Menu;
})(ScrollAwesome || (ScrollAwesome = {}));
var ScrollAwesome;
(function (ScrollAwesome) {
    class Paragraph {
        constructor(id, top, height, name) {
            this._id = id;
            this._top = top;
            this._name = name !== null && name !== void 0 ? name : null;
            this._height = height;
        }
        get Id() {
            return this._id;
        }
        get Top() {
            return this._top;
        }
        get Name() {
            return this._name;
        }
        get Height() {
            return this._height;
        }
    }
    ScrollAwesome.Paragraph = Paragraph;
})(ScrollAwesome || (ScrollAwesome = {}));
var ScrollAwesome;
(function (ScrollAwesome) {
    class Page {
        constructor(height, offsetY, cursorBody, menuBody, isDedug, callBack) {
            var _a;
            this._curentPosition = 0;
            this._callBack = () => null;
            this._isDebug = false;
            this._height = height;
            this._offsetY = offsetY;
            this._callBack = callBack;
            this._isDebug = isDedug;
            let menuItems = this.MapToMenuItems(Array.from(menuBody.children));
            this._paragraphs = this.MapToParagraphs(menuItems);
            this._menu = new ScrollAwesome.Menu(cursorBody, menuBody, menuItems);
            this._menu.UpdateCursorPosition(this.Progress);
            (_a = this._callBack) === null || _a === void 0 ? void 0 : _a.call(this, this.Progress);
            window.addEventListener('scroll', () => this.Scrolling());
        }
        MapToParagraphs(menyItems) {
            let queryString = menyItems
                .map(link => `#${link.Id}`)
                .join(', ');
            let paragraphs = Array
                .from(document.querySelectorAll(queryString))
                .map((element, index, array) => {
                var _a, _b;
                let currentElementHeight = Math.round(element.getBoundingClientRect().top + window.pageYOffset - this._offsetY) - 3;
                let nextElementHeight = Math.round(((_b = (_a = array[index + 1]) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) === null || _b === void 0 ? void 0 : _b.top) + window.pageYOffset - this._offsetY) - 3;
                if (!nextElementHeight)
                    nextElementHeight = this._height;
                return new ScrollAwesome.Paragraph(element.getAttribute("id"), currentElementHeight, nextElementHeight - currentElementHeight, element.textContent);
            });
            return paragraphs;
        }
        MapToMenuItems(liElements) {
            if (liElements.length < 1)
                throw new Error('Menu can not be empty!');
            let menuItems = liElements
                .map(element => {
                var _a, _b;
                let id = (_b = (_a = element.querySelector('a')) === null || _a === void 0 ? void 0 : _a.getAttribute("href")) === null || _b === void 0 ? void 0 : _b.replace('#', '');
                if (!id)
                    throw new Error(`Menu item '${element.textContent}' has not link to paragraph.`);
                return new ScrollAwesome.MenuItem(id, element.getBoundingClientRect().height);
            });
            return menuItems;
        }
        Scrolling() {
            var _a, _b, _c;
            this._curentPosition = window.pageYOffset;
            this._menu.UpdateCursorPosition(this.Progress);
            (_a = this._callBack) === null || _a === void 0 ? void 0 : _a.call(this, this.Progress);
            if (this._isDebug) {
                this._menu.UpdateDebudWindow([
                    { name: "pageY", value: window.pageYOffset.toString() },
                    { name: "pageSize", value: this._height.toString() },
                    { name: "partProgress", value: `${this.Progress.percent} %` },
                    { name: "partName", value: (_c = (_b = this.CurrentParagraph) === null || _b === void 0 ? void 0 : _b.Name) !== null && _c !== void 0 ? _c : "-" },
                    { name: "partHeight", value: (this.CurrentParagraph.Height).toString() },
                ]);
            }
        }
        get CurrentParagraph() {
            let curentPart = this._paragraphs.find(paragraph => {
                if (this._curentPosition >= paragraph.Top &&
                    this._curentPosition <= paragraph.Top + paragraph.Height)
                    return paragraph;
            });
            return curentPart !== null && curentPart !== void 0 ? curentPart : this._paragraphs[0];
        }
        get Progress() {
            let curentParagraph = this.CurrentParagraph;
            let progress = Math.round(((this._curentPosition - curentParagraph.Top) / curentParagraph.Height) * 100);
            return {
                id: curentParagraph.Id,
                percent: progress
            };
        }
    }
    ScrollAwesome.Page = Page;
})(ScrollAwesome || (ScrollAwesome = {}));
var ScrollAwesome;
(function (ScrollAwesome) {
    class Scroller {
        constructor(offsetY, cursorId, menuId, isDebug, callBack) {
            let height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
            let cursor = this.GetElementOrThrowError(cursorId);
            let menu = this.GetElementOrThrowError(menuId);
            new ScrollAwesome.Page(height, offsetY, cursor, menu, isDebug, callBack);
        }
        GetElementOrThrowError(id) {
            let element = document.querySelector(id);
            if (!element)
                throw new Error(`Element with id '${id}' not found!`);
            return element;
        }
    }
    ScrollAwesome.Scroller = Scroller;
})(ScrollAwesome || (ScrollAwesome = {}));
