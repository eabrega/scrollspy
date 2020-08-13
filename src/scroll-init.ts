///<reference path="page.ts"/>
namespace DualSideScroll {
    export type ProgressHendler = (progress: IProgress) => void;
    export class Init {
        private readonly _page: Page;
        constructor(
            cursorSelector: string,
            menuSelector: string,
            isDebug?: boolean,
            callBack?: ProgressHendler
        ) {
            let height = Math.max(
                document.body.scrollHeight, document.documentElement.scrollHeight,
                document.body.offsetHeight, document.documentElement.offsetHeight,
                document.body.clientHeight, document.documentElement.clientHeight
            );

            let cursor = this.GetElementOrThrowError(cursorSelector) as HTMLDivElement;
            let menu = this.GetElementOrThrowError(menuSelector) as HTMLUListElement;

            this._page = new Page(
                height,
                cursor,
                menu,
                isDebug,
                callBack,
            );
        }

        private GetElementOrThrowError(selector: string): Element {
            let element = document.querySelector(selector);

            if (!element) throw new Error(`Element with selector '${selector}' not found!`);

            return element;
        }
    }
}