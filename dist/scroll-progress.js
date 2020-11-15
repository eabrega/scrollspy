"use strict";
var ScrollProgress;
(function (ScrollProgress) {
    class Cursor {
        constructor(cursorBody) {
            this._cursorBody = cursorBody;
        }
        Move(YPosition) {
            this._cursorBody.style.top = `${YPosition}px`;
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
        constructor(menuBody, elements, cursorBody) {
            this._cursor = null;
            if (elements.length < 1)
                throw new Error('Menu can not be empty!');
            this._menuBody = menuBody;
            this._menuHtmlElements = elements;
            if (cursorBody != null)
                this._cursor = new ScrollProgress.Cursor(cursorBody);
            this._menuItems = this.MapToMenuItems(elements);
        }
        get Items() {
            return this._menuItems;
        }
        UpdateCursorPosition(progress) {
            var _a, _b, _c;
            if (this._cursor == null)
                return;
            let indexParagraph = this._menuItems.findIndex(i => i.Id == progress.Id);
            let height = this._menuItems
                .filter((item, index) => {
                if (index < indexParagraph + 1) {
                    return item.Height;
                }
            })
                .map((item) => item.Height)
                .reduce((sum, curent) => sum + curent);
            let currentItemHeight = this._menuItems[indexParagraph].Height;
            let curentCursorPosition = (height - currentItemHeight + ((_b = (_a = this === null || this === void 0 ? void 0 : this._cursor) === null || _a === void 0 ? void 0 : _a.Height) !== null && _b !== void 0 ? _b : 0)) + (currentItemHeight * progress.Percent / 100);
            (_c = this === null || this === void 0 ? void 0 : this._cursor) === null || _c === void 0 ? void 0 : _c.Move(curentCursorPosition);
        }
        ReInit() {
            this._menuItems = this.MapToMenuItems(this._menuHtmlElements);
        }
        MapToMenuItems(elements) {
            let menuItems = Array.from(elements)
                .map((element, index) => {
                var _a, _b, _c;
                let id = (_a = element.getAttribute("href")) === null || _a === void 0 ? void 0 : _a.replace('#', '');
                let currentElementHeight = Math.round(element.getBoundingClientRect().top);
                let nextElementHeight = Math.round((_c = (_b = elements[index + 1]) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect()) === null || _c === void 0 ? void 0 : _c.top);
                if (!nextElementHeight)
                    nextElementHeight = this._menuBody.getBoundingClientRect().height + this._menuBody.getBoundingClientRect().top;
                return new ScrollProgress.MenuItem(id, nextElementHeight - currentElementHeight);
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
        constructor(height, menuBody, cursorBody, onScrolled, onChanged) {
            var _a;
            this._timeOut = 0;
            this._oldParagraph = null;
            this._curentPosition = 0;
            this._onScrolled = () => null;
            this._onChanged = () => null;
            this._height = height;
            this._onScrolled = onScrolled;
            this._onChanged = onChanged;
            this.ConfirmMenyIsNotNull(menuBody);
            this._menu = new ScrollProgress.Menu(menuBody, menuBody.getElementsByTagName('a'), cursorBody);
            this._paragraphs = this.MapToParagraphs(this._menu.Items);
            this.CheckParagraphLinks(this._paragraphs, this._menu.Items);
            this._menu.UpdateCursorPosition(this.Progress);
            (_a = this._onScrolled) === null || _a === void 0 ? void 0 : _a.call(this, this.Progress);
            window.addEventListener('scroll', () => this.Scrolling());
            window.addEventListener('resize', () => this.ReInitRunnwer());
        }
        MapToParagraphs(menyItems) {
            let queryString = menyItems
                .map(link => `#${link.Id}`)
                .join(', ');
            let paragraphs = Array.from(document.querySelectorAll(queryString))
                .map((element, index, array) => {
                var _a, _b;
                let currentElementHeight = Math.round(element.getBoundingClientRect().top + window.pageYOffset);
                let nextElementHeight = Math.round(((_b = (_a = array[index + 1]) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) === null || _b === void 0 ? void 0 : _b.top) + window.pageYOffset);
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
                Id: curentParagraph.Id,
                Percent: progress > 0 ? progress : 0
            };
        }
        ReInitRunnwer() {
            clearTimeout(this._timeOut);
            this._timeOut = setTimeout(() => this.ReInit(), 200);
        }
        ConfirmMenyIsNotNull(menuChildrens) {
            if (menuChildrens == null)
                throw new Error("Menu body can't be NULL");
        }
        CheckParagraphLinks(paragraphs, menuItems) {
            menuItems.every((par) => {
                let paragraph = paragraphs.find(x => x.Id == par.Id);
                if (paragraph)
                    return true;
                else
                    throw new Error(`Menu item with id '${par.Id}' not linked for paragraph!`);
            });
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
            this._page = new ScrollProgress.Page(height, menu, cursor, onScrolled, onChanged);
        }
        GetElementOrThrowError(selector) {
            if (selector == null)
                return null;
            let element = document.querySelector(selector);
            if (!element)
                throw new Error(`Element with selector '${selector}' not found!`);
            return element;
        }
    }
    ScrollProgress.Init = Init;
})(ScrollProgress || (ScrollProgress = {}));
//# sourceMappingURL=scroll-progress.js.map