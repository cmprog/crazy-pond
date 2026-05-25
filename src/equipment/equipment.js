export class Equipment {

    constructor(name, price, alignmentPos, rotation) {

        /**
         * @type {string}
         */
        this.name = name;
        
        /**
         * @type {number}
         */
        this.price = price;
        
        /**
         * @type {Vector2}
         */
        this.alignmentPos = alignmentPos;
        
        /**
         * @type {number}
         */
        this.rotation = rotation;
    }
}