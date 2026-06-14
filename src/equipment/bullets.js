import { Equipment } from "./equipment.js";

export class BulletInfo extends Equipment {

    constructor(name, imgSrc, pos, size, price, alignmentPos, rotation) {
        super(name, price, alignmentPos, rotation);

        /**
         * @type {string}
         */
        this.imgSrc = imgSrc;
        
        /**
         * @type {Vector2}
         */
        this.pos = pos;

        /**
         * @type {Vector2}
         */
        this.size = size;
    }

}

/**
 *  @type {Object.<string, BulletInfo>}
 */
export const BULLETS = {
    'bullet1': new BulletInfo('bullet1', 'bullets', vec2(156, 170), vec2(50, 60), 100, vec2(0, 32), 0),
}

/**
 *  @type {BulletInfo[]}
 */
export const BULLET_INFOS = Object.values(BULLETS);

/**
 *  @type {string[]}
 */
export const BULLET_NAMES = Object.keys(BULLETS);