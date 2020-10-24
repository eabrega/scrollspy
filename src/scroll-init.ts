///<reference path="page.ts"/>
namespace ScrollProgress {
    export type ProgressHendler = (progress: IProgress) => void;
    export type StateHendler = (state: string) => void;

    export class Init {
        private readonly _page: Page;
        constructor(
            cursorSelector: string,
            menuSelector: string,
            onScrolled?: ProgressHendler,
            onChanged?: StateHendler
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
                menu,
                cursor,
                onScrolled,
                onChanged
            );
        }

        private GetElementOrThrowError(selector: string | null): Element | null {
            if (selector == null) return null;

            let element = document.querySelector(selector);

            if (!element) throw new Error(`Element with selector '${selector}' not found!`);

            return element;
        }
    }
}