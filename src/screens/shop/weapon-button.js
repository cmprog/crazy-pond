import { WeaponInfo } from "../../equipment/weapons.js";
import { ShopButton } from "./shop-button.js";

export class WeaponButton extends ShopButton {

    constructor(weapon, tileInfo, price) {

        super(tileInfo, price);

        /**
         * @type {WeaponInfo}
         */
        this.weapon = weapon;
    }

}