import { FishSizes } from "../constants.js";

const HAT_NAMES = [    
    'antlers',
    'army',
    'baseballCap',
    'bicorn',
    'birthday',
    'bowlerHat',
    'bunny',
    'captains',
    'catEars',
    'crown',
    'hotdog',
    'horseHead',
    'shark',
    'viking',
];

export class SpriteAtlas {

    constructor() {
        
        /**
         * @type {string[]}
         */
        this.images = [
            'img/Bubbles/Coloured/16x16/bubble_3.png',
            'img/fish/fresh/Angelfish.png',
            'img/fish/salt/Anchovy.png',
            'img/fish/salt/Crab - Dungeness.png',
            'img/fish/salt/Surgeonfish.png',
            'img/weapons/blasters.png',
            'img/weapons/bullets.png',
        ];

        for (const hatName of HAT_NAMES) {            
            this.images.push(`img/hats/${hatName}.png`);
        }
    }

    init() {

        

        this.bubbles = {
            colored: {
                SIZE_16: new TileInfo(vec2(0), vec2(16), textureInfos[0])
            }
        }

        this.player = new TileInfo(vec2(0), vec2(16), textureInfos[1]);

        this.fish = {}
        this.fish[FishSizes.SMALL] = new TileInfo(vec2(0), vec2(16), textureInfos[2]);
        this.fish[FishSizes.MEDIUM] = new TileInfo(vec2(0), vec2(16), textureInfos[3]);
        this.fish[FishSizes.LARGE] = new TileInfo(vec2(0), vec2(16), textureInfos[4]);

        this.weapons = {
            blasters: {
                flameThrower: new TileInfo(vec2(0), vec2(16), textureInfos[5]),
            },
            ammo: {
                flame: new TileInfo(vec2(0), vec2(16), textureInfos[6]),
            }
        };

        this.hats = {};
        for (const hatName of HAT_NAMES) {
            const textureInfo = textureInfos.find(v => v.image.src.includes(`hats/${hatName}.png`));
            this.hats[hatName] = new TileInfo(vec2(0), vec2(128), textureInfo)
        }
    }
}