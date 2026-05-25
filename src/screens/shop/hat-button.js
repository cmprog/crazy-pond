import { HatInfo } from "../../equipment/hats.js";
import { ShopButton } from "./shop-button.js";

export class HatButton extends ShopButton {

    constructor(hat, tileInfo, price) {

        super(tileInfo, price);

        /**
         * @type {HatInfo}
         */
        this.hat = hat;
    }

}