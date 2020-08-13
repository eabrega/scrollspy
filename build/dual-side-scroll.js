"use strict";
var DualSideScroll;
(function (DualSideScroll) {
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
    DualSideScroll.Cursor = Cursor;
})(DualSideScroll || (DualSideScroll = {}));
var DualSideScroll;
(function (DualSideScroll) {
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
    DualSideScroll.MenuItem = MenuItem;
})(DualSideScroll || (DualSideScroll = {}));
var DualSideScroll;
(function (DualSideScroll) {
    class Menu {
        constructor(cursorBody, menuBody, menuItems) {
            this._cursor = new DualSideScroll.Cursor(cursorBody);
            this._menuItems = menuItems;
            this._menuBody = menuBody;
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
        get Items() {
            return this._menuItems;
        }
    }
    DualSideScroll.Menu = Menu;
})(DualSideScroll || (DualSideScroll = {}));
var DualSideScroll;
(function (DualSideScroll) {
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
    DualSideScroll.Paragraph = Paragraph;
})(DualSideScroll || (DualSideScroll = {}));
var DualSideScroll;
(function (DualSideScroll) {
    class Page {
        constructor(height, cursorBody, menuBody, isDedug, callBack) {
            var _a;
            this._offsetY = 0;
            this._curentPosition = 0;
            this._callBack = () => null;
            this._isDebug = false;
            this._height = height;
            this._callBack = callBack;
            this._isDebug = isDedug;
            let menuItems = this.MapToMenuItems(Array.from(menuBody.children));
            this._paragraphs = this.MapToParagraphs(menuItems);
            this._menu = new DualSideScroll.Menu(cursorBody, menuBody, menuItems);
            this._menu.UpdateCursorPosition(this.Progress);
            (_a = this._callBack) === null || _a === void 0 ? void 0 : _a.call(this, this.Progress);
            window.addEventListener('scroll', () => this.Scrolling());
            window.addEventListener('resize', () => this.ReinitHeight());
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
                return new DualSideScroll.Paragraph(element.getAttribute("id"), currentElementHeight, nextElementHeight - currentElementHeight, element.textContent);
            });
            return paragraphs;
        }
        MapToMenuItems(Elements) {
            if (Elements.length < 1)
                throw new Error('Menu can not be empty!');
            let menuItems = Elements
                .map(element => {
                var _a, _b, _c, _d;
                let id = element.tagName === 'A' ?
                    (_a = element.getAttribute("href")) === null || _a === void 0 ? void 0 : _a.replace('#', '') :
                    (_c = (_b = element.querySelector('a')) === null || _b === void 0 ? void 0 : _b.getAttribute("href")) === null || _c === void 0 ? void 0 : _c.replace('#', '');
                if (!id)
                    throw new Error(`Menu item '${(_d = element.textContent) === null || _d === void 0 ? void 0 : _d.trim()}' has not link to paragraph.`);
                return new DualSideScroll.MenuItem(id, element.getBoundingClientRect().height);
            });
            return menuItems;
        }
        Scrolling() {
            var _a;
            this._curentPosition = window.pageYOffset;
            this._menu.UpdateCursorPosition(this.Progress);
            (_a = this._callBack) === null || _a === void 0 ? void 0 : _a.call(this, this.Progress);
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
        ReinitHeight() {
            this._height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
            this._paragraphs = this.MapToParagraphs(this._menu.Items);
        }
    }
    DualSideScroll.Page = Page;
})(DualSideScroll || (DualSideScroll = {}));
var DualSideScroll;
(function (DualSideScroll) {
    class Init {
        constructor(cursorSelector, menuSelector, isDebug, callBack) {
            let height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
            let cursor = this.GetElementOrThrowError(cursorSelector);
            let menu = this.GetElementOrThrowError(menuSelector);
            this._page = new DualSideScroll.Page(height, cursor, menu, isDebug, callBack);
        }
        GetElementOrThrowError(selector) {
            let element = document.querySelector(selector);
            if (!element)
                throw new Error(`Element with selector '${selector}' not found!`);
            return element;
        }
    }
    DualSideScroll.Init = Init;
})(DualSideScroll || (DualSideScroll = {}));
//# sourceMappingURL=dual-side-scroll.js.map