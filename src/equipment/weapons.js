import { Equipment } from "./equipment.js";

export class WeaponInfo extends Equipment {

    constructor(name, imgSrc, pos, size, price, alignmentPos, muzzlePos, rotation) {
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
        
        /**
         * @type {Vector2}
         */
        this.muzzlePos = muzzlePos;
    }

}

/**
 *  @type {Object.<string, WeaponInfo>}
 */
export const WEAPONS = {
    'flamethrower': new WeaponInfo('flamethrower', 'blasters', vec2(64, 85), vec2(32, 11), 3500, vec2(9, 5), vec2(34, 5), 0),
}

/**
 *  @type {WeaponInfo[]}
 */
export const WEAPON_INFOS = Object.values(WEAPONS);

/**
 *  @type {string[]}
 */
export const WEAPON_NAMES = Object.keys(WEAPONS);