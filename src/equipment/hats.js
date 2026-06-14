import { Equipment } from "./equipment.js";

export class HatInfo extends Equipment {
    
    constructor(name, price, alignmentPos, rotation) {
        super(name, price, alignmentPos, rotation);
    }
}

/**
 *  @type {Object.<string, HatInfo>}
 */
// alignmentPos formula: vec2(128 - 2*brimX, 2*brimY - 128)
// where (brimX, brimY) is the mount-point pixel in the 128x128 sprite (image-space, Y=0 at top)
export const HATS = {
    'antlers':    new HatInfo('antlers',    500,  vec2(  0, 108), 0),  // trunk base (64,118)
    'army':       new HatInfo('army',       750,  vec2( -4,  48), 0),  // rim bottom (66,88)
    'baseballCap':new HatInfo('baseballCap',1000, vec2( 28,  36), 0),  // cap underside (50,82)
    'bicorn':     new HatInfo('bicorn',     1500, vec2( 12,  60), 0),  // brim bottom (58,94)
    'birthday':   new HatInfo('birthday',   1500, vec2(  4,  72), 0),  // pompom base (62,100)
    'bowlerHat':  new HatInfo('bowlerHat',  1900, vec2( -2,  52), 0),  // brim bottom (65,90)
    'bunny':      new HatInfo('bunny',      2300, vec2(  2, 112), 0),  // stem base (63,120)
    'captains':   new HatInfo('captains',   2500, vec2( -4,  48), 0),  // brim bottom (66,88)
    'catEars':    new HatInfo('catEars',    2500, vec2(  2, 104), 0),  // stem base (63,116)
    'crown':      new HatInfo('crown',      2750, vec2(  0,  52), 0),  // flat base (64,90)
    'hotdog':     new HatInfo('hotdog',     2750, vec2( -2,  52), 0),  // bun bottom (65,90)
    'horseHead':  new HatInfo('horseHead',  2950, vec2(-12,  92), 0),  // neck base (70,110)
    'shark':      new HatInfo('shark',      2950, vec2( -4,  72), 0),  // jaw bottom (66,100)
    'viking':     new HatInfo('viking',     3000, vec2(  0,  60), 0),  // rim bottom (64,94)
};

/**
 *  @type {HatInfo[]}
 */
export const HAT_INFOS = Object.values(HATS);

/**
 *  @type {string[]}
 */
export const HAT_NAMES = Object.keys(HATS);