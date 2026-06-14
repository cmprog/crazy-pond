import { FishSizes } from "../constants.js";
import { BULLET_INFOS } from "../equipment/bullets.js";
import { HAT_NAMES } from "../equipment/hats.js";
import { WEAPON_INFOS, WEAPON_NAMES, WEAPONS } from "../equipment/weapons.js";

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

        for (const weapon of WEAPON_INFOS) {
            
            const imagePath = `img/weapons/${weapon.imgSrc}.png`

            if (!this.images.includes(imagePath)) {
                this.images.push(imagePath);
            }            
        }

        for (const bullet of BULLET_INFOS) {
            
            const imagePath = `img/weapons/${bullet.imgSrc}.png`

            if (!this.images.includes(imagePath)) {
                this.images.push(imagePath);
            }            
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

        this.hats = {};
        for (const hatName of HAT_NAMES) {
            const textureInfo = textureInfos.find(v => v.image.src.includes(`hats/${hatName}.png`));
            this.hats[hatName] = new TileInfo(vec2(0), vec2(128), textureInfo);
        }

        this.weapons = {};
        for (const weaponInfo of WEAPON_INFOS) {
            const textureInfo = textureInfos.find(v => v.image.src.includes(`weapons/${weaponInfo.imgSrc}.png`));
            this.weapons[weaponInfo.name] = new TileInfo(weaponInfo.pos, weaponInfo.size, textureInfo);
        }

        this.bullets = {};
        for (const bulletInfo of BULLET_INFOS) {
            const textureInfo = textureInfos.find(v => v.image.src.includes(`weapons/${bulletInfo.imgSrc}.png`));
            this.bullets[bulletInfo.name] = new TileInfo(bulletInfo.pos, bulletInfo.size, textureInfo);
        }
    }
}