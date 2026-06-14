import { BulletInfo } from "../../equipment/bullets.js";
import { ShopButton } from "./shop-button.js";

export class BulletButton extends ShopButton {

    constructor(bulletInfo, tileInfo, price) {

        super(tileInfo, price);

        /**
         * @type {BulletInfo}
         */
        this.bulletInfo = bulletInfo;
    }

}