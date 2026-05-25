import { RenderLayers } from "../constants.js";
import { GAME } from "../main.js";
import { BaseEntity } from "./base-entity.js";

export class HatEntity extends BaseEntity {

    constructor(hatName) {

        super();
        
        this.hatName = hatName;

        this.renderOrder = RenderLayers.ACCESSORIES;

        this.tileInfo = GAME.sprites.hats[hatName];
    }

}