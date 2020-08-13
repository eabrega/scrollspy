///<reference path="paragraph.ts"/>
///<reference path="menu.ts"/>
///<reference path="menuItem.ts"/>
namespace DualSideScroll {
    export class Page {
        private _height: number;
        private readonly _offsetY: number = 0;
        private _curentPosition: number = 0;
        private _paragraphs: Array<Paragraph>;
        private readonly _menu: Menu;
        private readonly _callBack?: ProgressHendler = () => null;

        constructor(
            height: number,
            cursorBody: HTMLDivElement,
            menuBody: HTMLElement,
            callBack?: ProgressHendler,
        ) {
            this._height = height;
            this._callBack = callBack;

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
            window.addEventListener('resize', () => this.ReinitHeight());
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

        private MapToMenuItems(Elements: Array<Element>): Array<MenuItem> {
            if (Elements.length < 1) throw new Error('Menu can not be empty!');
            let menuItems = Elements
                .map(element => {
                    let id = element.tagName === 'A' ?
                        element.getAttribute("href")?.replace('#', '') as string :
                        element.querySelector('a')?.getAttribute("href")?.replace('#', '') as string;

                    if (!id) throw new Error(`Menu item '${element.textContent?.trim()}' has not link to paragraph.`);

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

        private ReinitHeight() {           
            this._height = Math.max(
                document.body.scrollHeight, document.documentElement.scrollHeight,
                document.body.offsetHeight, document.documentElement.offsetHeight,
                document.body.clientHeight, document.documentElement.clientHeight
            );

            this._paragraphs = this.MapToParagraphs(this._menu.Items);
            this._menu.UpdateCursorPosition(this.Progress);
            this._callBack?.(this.Progress);
        }
    }
}
