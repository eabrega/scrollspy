namespace ScrollProgress {
    export class Paragraph {
        private readonly _id: string;
        private readonly _top: number;
        private readonly _height: number;
        private readonly _name: string | null;

        constructor(id: string, top: number, height: number, name?: string | null) {
            this._id = id;
            this._top = top;
            this._name = name ?? null;
            this._height = height;
        }

        get Id() {
            return this._id;
        }
        get Top() {
            return this._top;
        }
        get Name() {
            return this._name;
        }
        get Height() {
            return this._height;
        }
    }
}