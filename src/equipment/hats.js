import { Equipment } from "./equipment.js";

export class HatInfo extends Equipment {
    
    constructor(name, price, alignmentPos, rotation) {
        super(name, price, alignmentPos, rotation);
    }
}

/**
 *  @type {Object.<string, HatInfo>}
 */
export const HATS = {
    'antlers': new HatInfo('antlers', 500, vec2(64), 0),
    'army': new HatInfo('army', 750, vec2(64), 0),
    'baseballCap': new HatInfo('baseballCap', 1000, vec2(64), 0),
    'bicorn': new HatInfo('bicorn', 1500, vec2(64), 0),
    'birthday': new HatInfo('birthday', 1500, vec2(64), 0),
    'bowlerHat': new HatInfo('bowlerHat', 1900, vec2(64), 0),
    'bunny': new HatInfo('bunny', 2300, vec2(64), 0),
    'captains': new HatInfo('captains', 2500, vec2(64), 0),
    'catEars': new HatInfo('catEars', 2500, vec2(64), 0),
    'crown': new HatInfo('crown', 2750, vec2(64), 0),
    'hotdog': new HatInfo('hotdog', 2750, vec2(64), 0),
    'horseHead': new HatInfo('horseHead', 2950, vec2(64), 0),
    'shark': new HatInfo('shark', 2950, vec2(64), 0),
    'viking': new HatInfo('viking', 3000, vec2(64), 0),
};

/**
 *  @type {HatInfo[]}
 */
export const HAT_INFOS = Object.values(HATS);

/**
 *  @type {string[]}
 */
export const HAT_NAMES = Object.keys(HATS);