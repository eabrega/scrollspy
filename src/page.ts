///<reference path="paragraph.ts"/>
///<reference path="menu.ts"/>
///<reference path="menuItem.ts"/>
namespace ScrollAwesome {
    export class Page {
        private readonly _height: number;
        private readonly _offsetY: number;
        private _curentPosition: number = 0;
        private readonly _paragraphs: Array<Paragraph>;
        private readonly _menu: Menu;
        private readonly _callBack?: ProgressHendler = () => null;
        private readonly _isDebug?: boolean = false;

        constructor(
            height: number,
            offsetY: number,
            cursorBody: HTMLDivElement,
            menuBody: HTMLUListElement,
            isDedug?: boolean,
            callBack?: ProgressHendler,
        ) {
            this._height = height;
            this._offsetY = offsetY;
            this._callBack = callBack;
            this._isDebug = isDedug;

            let menuItems = this.MapToMenuItems(Array.from(menuBody.children));

            this._paragraphs = this.MapToParagraphs(menuItems);
            this._menu = new Menu(
                cursorBody,
                menuBody,
                menuItems
            );
            this._menu.UpdateCursorPosition(this.Progress);
            this._callBack?.(this.Progress);
            window.addEventListener('scroll', () => this.Scrolling());
        }

        private MapToParagraphs(menyItems: Array<MenuItem>): Array<Paragraph> {
            let queryString = menyItems
                .map(link => `#${link.Id}`)
                .join(', ');

            let paragraphs = Array
                .from(document.querySelectorAll(queryString))
                .map((element, index, array) => {
                    let currentElementHeight = Math.round(element.getBoundingClientRect().top + window.pageYOffset - this._offsetY) - 3;
                    let nextElementHeight = Math.round(array[index + 1]?.getBoundingClientRect()?.top + window.pageYOffset - this._offsetY) - 3;
                    if (!nextElementHeight) nextElementHeight = this._height;

                    return new Paragraph(
                        element.getAttribute("id") as string,
                        currentElementHeight,
                        nextElementHeight - currentElementHeight,
                        element.textContent
                    );
                });
            return paragraphs;
        }

        private MapToMenuItems(liElements: Array<Element>): Array<MenuItem> {
            if (liElements.length < 1) throw new Error('Menu can not be empty!');
            let menuItems = liElements
                .map(element => {
                    let id = element.querySelector('a')?.getAttribute("href")?.replace('#', '') as string;
                    if (!id) throw new Error(`Menu item '${element.textContent}' has not link to paragraph.`);
                    return new MenuItem(
                        id,
                        element.getBoundingClientRect().height
                    )
                });
            return menuItems;
        }

        private Scrolling() {
            this._curentPosition = window.pageYOffset;
            this._menu.UpdateCursorPosition(this.Progress);
            this._callBack?.(this.Progress);

            if (this._isDebug) {
                this._menu.UpdateDebudWindow(<Array<INameValue>>[
                    { name: "pageY", value: window.pageYOffset.toString() },
                    { name: "pageSize", value: this._height.toString() },
                    { name: "partProgress", value: `${this.Progress.percent} %` },
                    { name: "partName", value: this.CurrentParagraph?.Name ?? "-" },
                    { name: "partHeight", value: (this.CurrentParagraph.Height).toString() },
                ]);
            }
        }

        private get CurrentParagraph(): Paragraph {
            let curentPart = this._paragraphs.find(paragraph => {
                if (this._curentPosition >= paragraph.Top &&
                    this._curentPosition <= paragraph.Top + paragraph.Height) return paragraph;
            });
            return curentPart ?? this._paragraphs[0];
        }

        private get Progress(): IProgress {
            let curentParagraph = this.CurrentParagraph;
            let progress = Math.round(((this._curentPosition - curentParagraph.Top) / curentParagraph.Height) * 100);
            return <IProgress>{
                id: curentParagraph.Id,
                percent: progress
            }
        }
    }
}
