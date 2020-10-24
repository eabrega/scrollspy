///<reference path="menuItem.ts"/>
///<reference path="cursor.ts"/>
namespace ScrollProgress {
    /**
     * Текущий прогресс прокрутки
     * @param Id id текущего параграфа
     * @param Percent состояние прокрутки в % текущего параграфа
     */
    export interface IProgress {
        Id: string;
        Percent: number;
    }
    export class Menu {
        private readonly _menuHtmlElements: Array<Element>;
        private _menuItems: Array<MenuItem>;
        private readonly _cursor: Cursor | null = null;

        constructor(elements: Array<Element>, cursorBody?: HTMLDivElement | null) {
            this._menuHtmlElements = elements;
            if (cursorBody != null) this._cursor = new Cursor(cursorBody);
            this._menuItems = this.MapToMenuItems(elements);
        }

        public get Items(): Array<MenuItem> {
            return this._menuItems;
        }

        public UpdateCursorPosition(progress: IProgress): void {
            if (this._cursor == null) return;

            let indexParagraph = this._menuItems.findIndex(i => i.Id == progress.Id)
            let height = this._menuItems
                .filter((item, index) => {
                    if (index < indexParagraph + 1) {
                        return item.Height;
                    }
                })
                .map((item) => item.Height)
                .reduce((sum, curent) => sum + curent);
            let currentItemHeight = this._menuItems[indexParagraph].Height
            let curentCursorPosition = (height - currentItemHeight + (this?._cursor?.Height ?? 0)) + (currentItemHeight * progress.Percent / 100);

            this?._cursor?.Move(curentCursorPosition);
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
