import { RenderLayers } from "../constants.js";
import { WeaponInfo } from "../equipment/weapons.js";
import { GAME } from "../main.js";
import { BaseEntity } from "./base-entity.js";

export class WeaponEntity extends BaseEntity {

    constructor(weaponInfo) {

        super();
        
        /**
         * @type {WeaponInfo}
         */
        this.weaponInfo = weaponInfo;

        /**
         * @type {number}
         */
        this.renderOrder = RenderLayers.ACCESSORIES;

        /**
         * @type {TileInfo}
         */
        this.tileInfo = GAME.sprites.weapons[this.weaponInfo.name];
    }

}