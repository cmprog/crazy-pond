import { RenderLayers } from "../constants.js";
import { BaseEntity } from "./base-entity.js";

export class HatEntity extends BaseEntity {

    constructor(hatName, tileInfo) {

        super();

        this.hatName = hatName;

        this.renderOrder = RenderLayers.ACCESSORIES;

        this.tileInfo = tileInfo;
    }

}