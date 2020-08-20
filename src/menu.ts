///<reference path="menuItem.ts"/>
///<reference path="cursor.ts"/>
namespace ScrollProgress {
    export interface IProgress {
        id: string;
        percent: number;
    }
    export class Menu {
        private readonly _menuHtmlElements: Array<Element>;
        private _menuItems: Array<MenuItem>;
        private readonly _cursor: Cursor;

        constructor(cursorBody: HTMLDivElement, elements: Array<Element>) {
            this._menuHtmlElements = elements;
            this._cursor = new Cursor(cursorBody);
            this._menuItems = this.MapToMenuItems(elements);
        }

        public get Items(): Array<MenuItem> {
            return this._menuItems;
        }

        public UpdateCursorPosition(progress: IProgress): void {
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

        public ReInit(): void {
            this._menuItems = this.MapToMenuItems(this._menuHtmlElements);
        }

        private MapToMenuItems(Elements: Array<Element>): Array<MenuItem> {
            if (Elements.length < 1) throw new Error('Menu can not be empty!');
            let menuItems = Elements
                .map(element => {
                    let id = element.getAttribute("href")?.replace('#', '') as string;
                    if (!id) throw new Error(`Menu item '${element.textContent?.trim()}' has not link to paragraph.`);

                    return new MenuItem(
                        id,
                        element.getBoundingClientRect().height
                    )
                });
            return menuItems;
        }
    }
}
