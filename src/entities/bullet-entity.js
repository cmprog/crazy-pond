import { RenderLayers } from "../constants.js";
import { BulletInfo } from "../equipment/bullets.js";
import { GAME } from "../main.js";
import { BaseEntity } from "./base-entity.js";

export class BulletEntity extends BaseEntity {

    constructor(bulletInfo) {

        super();
        
        /**
         * @type {BulletInfo}
         */
        this.bulletInfo = bulletInfo;

        /**
         * @type {number}
         */
        this.renderOrder = RenderLayers.ACCESSORIES;

        /**
         * @type {TileInfo}
         */
        this.tileInfo = GAME.sprites.bullets[this.bulletInfo.name];
    }

}