"use strict";
var ScrollProgress;
(function (ScrollProgress) {
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
    ScrollProgress.Cursor = Cursor;
})(ScrollProgress || (ScrollProgress = {}));
var ScrollProgress;
(function (ScrollProgress) {
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
    ScrollProgress.MenuItem = MenuItem;
})(ScrollProgress || (ScrollProgress = {}));
var ScrollProgress;
(function (ScrollProgress) {
    class Menu {
        constructor(cursorBody, elements) {
            this._menuHtmlElements = elements;
            this._cursor = new ScrollProgress.Cursor(cursorBody);
            this._menuItems = this.MapToMenuItems(elements);
        }
        get Items() {
            return this._menuItems;
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
        ReInit() {
            this._menuItems = this.MapToMenuItems(this._menuHtmlElements);
        }
        MapToMenuItems(Elements) {
            if (Elements.length < 1)
                throw new Error('Menu can not be empty!');
            let menuItems = Elements
                .map(element => {
                var _a, _b;
                let id = (_a = element.getAttribute("href")) === null || _a === void 0 ? void 0 : _a.replace('#', '');
                if (!id)
                    throw new Error(`Menu item '${(_b = element.textContent) === null || _b === void 0 ? void 0 : _b.trim()}' has not link to paragraph.`);
                return new ScrollProgress.MenuItem(id, element.getBoundingClientRect().height);
            });
            return menuItems;
        }
    }
    ScrollProgress.Menu = Menu;
})(ScrollProgress || (ScrollProgress = {}));
var ScrollProgress;
(function (ScrollProgress) {
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
    ScrollProgress.Paragraph = Paragraph;
})(ScrollProgress || (ScrollProgress = {}));
var ScrollProgress;
(function (ScrollProgress) {
    class Page {
        constructor(height, cursorBody, menuBody, onScrolled, onChanged) {
            var _a;
            this._offsetY = 0;
            this._oldParagraph = null;
            this._curentPosition = 0;
            this._onScrolled = () => null;
            this._onChanged = () => null;
            this._height = height;
            this._onScrolled = onScrolled;
            this._onChanged = onChanged;
            this._menu = new ScrollProgress.Menu(cursorBody, Array.from(menuBody.children));
            this._paragraphs = this.MapToParagraphs(this._menu.Items);
            this._menu.UpdateCursorPosition(this.Progress);
            (_a = this._onScrolled) === null || _a === void 0 ? void 0 : _a.call(this, this.Progress);
            window.addEventListener('scroll', () => this.Scrolling());
            window.addEventListener('resize', () => this.ReInit());
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
                return new ScrollProgress.Paragraph(element.getAttribute("id"), currentElementHeight, nextElementHeight - currentElementHeight, element.textContent);
            });
            return paragraphs;
        }
        Scrolling() {
            var _a;
            this._curentPosition = window.pageYOffset;
            this._menu.UpdateCursorPosition(this.Progress);
            (_a = this._onScrolled) === null || _a === void 0 ? void 0 : _a.call(this, this.Progress);
        }
        get CurrentParagraph() {
            var _a, _b;
            let curentParagraph = (_a = this._paragraphs.find(paragraph => {
                if (this._curentPosition >= paragraph.Top &&
                    this._curentPosition <= paragraph.Top + paragraph.Height)
                    return paragraph;
            })) !== null && _a !== void 0 ? _a : this._paragraphs[0];
            if (curentParagraph.Id != this._oldParagraph) {
                (_b = this._onChanged) === null || _b === void 0 ? void 0 : _b.call(this, curentParagraph === null || curentParagraph === void 0 ? void 0 : curentParagraph.Id);
                this._oldParagraph = curentParagraph.Id;
            }
            return curentParagraph;
        }
        get Progress() {
            let curentParagraph = this.CurrentParagraph;
            let progress = Math.round(((this._curentPosition - curentParagraph.Top) / curentParagraph.Height) * 100);
            return {
                id: curentParagraph.Id,
                percent: progress
            };
        }
        ReInit() {
            var _a;
            this._height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
            this._paragraphs = this.MapToParagraphs(this._menu.Items);
            this._menu.ReInit();
            this._menu.UpdateCursorPosition(this.Progress);
            (_a = this._onScrolled) === null || _a === void 0 ? void 0 : _a.call(this, this.Progress);
        }
    }
    ScrollProgress.Page = Page;
})(ScrollProgress || (ScrollProgress = {}));
var ScrollProgress;
(function (ScrollProgress) {
    class Init {
        constructor(cursorSelector, menuSelector, onScrolled, onChanged) {
            let height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
            let cursor = this.GetElementOrThrowError(cursorSelector);
            let menu = this.GetElementOrThrowError(menuSelector);
            this._page = new ScrollProgress.Page(height, cursor, menu, onScrolled, onChanged);
        }
        GetElementOrThrowError(selector) {
            let element = document.querySelector(selector);
            if (!element)
                throw new Error(`Element with selector '${selector}' not found!`);
            return element;
        }
    }
    ScrollProgress.Init = Init;
})(ScrollProgress || (ScrollProgress = {}));
//# sourceMappingURL=scroll-progress.js.map