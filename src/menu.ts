///<reference path="menuItem.ts"/>
///<reference path="cursor.ts"/>
namespace DualSideScroll {
    export interface INameValue {
        name: string;
        value: string;
    }
    export interface IProgress {
        id: string;
        percent: number;
    }
    export class Menu {
        private readonly _menuBody: HTMLElement;
        private readonly _menuItems: Array<MenuItem>;
        private readonly _cursor: Cursor;

        constructor(cursorBody: HTMLDivElement, menuBody: HTMLElement, menuItems: Array<MenuItem>) {
            this._cursor = new Cursor(cursorBody);
            this._menuItems = menuItems;
            this._menuBody = menuBody;
        }
        public UpdateCursorPosition(progress: IProgress) {
            let indexParagraph = this._menuItems.findIndex(i => i.Id == progress.id)
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

        public get Items(): Array<MenuItem> {
            return this._menuItems;
        }
    }
}
