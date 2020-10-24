namespace ScrollProgress {
    export class Cursor {
        private readonly _cursorBody: HTMLDivElement;

        constructor(cursorBody: HTMLDivElement) {
            this._cursorBody = cursorBody;
        }
        /**
         * Перемежает курсор в вертикальном положении
         * @param YPosition смещение в пикселях относительно верхнего края браузера
         */
        public Move(YPosition: Number): void {
            this._cursorBody.style.top = `${YPosition}px`;
        }
        get Height() {
            return this._cursorBody.getBoundingClientRect().height;
        }
    }
}
