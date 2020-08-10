///<reference path="menuItem.ts"/>
///<reference path="cursor.ts"/>
namespace ScrollAwesome {
    export interface INameValue {
        name: string;
        value: string;
    }
    export interface IProgress {
        id: string;
        percent: number;
    }
    export class Menu {
        private _debugWindow: HTMLDivElement;
        private readonly _menuBody: HTMLUListElement;
        private readonly _menuItems: Array<MenuItem>;
        private readonly _cursor: Cursor;

        constructor(cursorBody: HTMLDivElement, menuBody: HTMLUListElement, menuItems: Array<MenuItem>) {
            this._cursor = new Cursor(cursorBody);
            this._menuItems = menuItems;
            this._menuBody = menuBody;

            this._debugWindow = <HTMLDivElement>(document.createElement('div'));
            this._debugWindow.id = "debug-window";
            this._menuBody.appendChild(this._debugWindow);
        }
        public UpdateCursorPosition(progress: IProgress) {
            let indexParagraph = this._menuItems.findIndex(i=>i.Id == progress.id)
            let height = this._menuItems
                .filter((item, index) => {
                    if (index < indexParagraph + 1) {
                        return item.Height;
                    }
                })
                .map((item) => item.Height)
                .reduce((sum, curent) => sum + curent);
            let currentItemHeight = this._menuItems[indexParagraph].Height
            let curentCursorPosition = (height - currentItemHeight + this._cursor.Height) + (currentItemHeight * progress.percent / 100);

            this._cursor.Move(curentCursorPosition);
        }
        public UpdateDebudWindow(params: Array<INameValue>) {
            var rows = params.map((param) => {
                return `${param.name}: ${param.value}<br/>`;
            });
            this._debugWindow.innerHTML = rows.join("");
        }
    }
}