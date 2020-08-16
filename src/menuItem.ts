namespace ScrollProgress {
    export class MenuItem {
        private _id: string;
        private _height: number;
        constructor(id: string, height: number) {
            this._id = id;
            this._height = height;
        }
        get Id(): string {
            return this._id;
        }
        get Height(): number {
            return this._height;
        }
    }
}