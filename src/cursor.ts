namespace ScrollAwesome {
    export class Cursor {
        private readonly _cursorBody: HTMLDivElement;
        
        constructor(cursorBody: HTMLDivElement) {
            this._cursorBody = cursorBody;
        }
        public Move(topPosition: Number) {
            this._cursorBody.style.top = `${topPosition}px`;
        }
        get Height() {
            return this._cursorBody.getBoundingClientRect().height;
        }
    }
}
