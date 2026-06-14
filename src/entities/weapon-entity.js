import { RenderLayers } from "../constants.js";
import { WeaponInfo } from "../equipment/weapons.js";
import { BaseEntity } from "./base-entity.js";

export class WeaponEntity extends BaseEntity {

    constructor(weaponInfo, tileInfo) {

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
        this.tileInfo = tileInfo;
    }

}