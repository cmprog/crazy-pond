import { GameTheme } from "../../constants.js";
import { formatMoney } from "../../utils.js";

const SHOP_BUTTON_TILE_RATIO = 0.6;

export class ShopButton extends UIButton {

    constructor(tileInfo, price) {
        super();

        this.size = GameTheme.ShopButtonSize;

        /**
         * @type {number}
         */
        this._originalPrice = price;

        /**
         * @type {number}
         */
        this.price = price;

        /**
         * @type {boolean}
         */
        this._isEquipped = false;

        this.layout = new UILayout(vec2(), 1, 0, 5, true);
        this.layout.canBeHover = false;
        this.addChild(this.layout);

        this.priceText = new UIText(vec2(0), vec2(this.size.x, 20), formatMoney(this.price));
        this.priceText.canBeHover = false;
        this.layout.addChild(this.priceText);

        const targetTileSize = vec2(min(this.size.x, this.size.y)).scale(SHOP_BUTTON_TILE_RATIO);

        this.tile = new UITile(vec2(0), targetTileSize, tileInfo);
        this.tile.canBeHover = false;
        this.layout.addChild(this.tile);
    }

    setHasBeenPurchased(isPurchased, isEquipped) {

        if (isPurchased) {

            this.price = 0;
            
            if (isEquipped) {

                this.priceText.text = 'equipped';
                this.color = GameTheme.ShopButtonEquippedColor;
                this.textColor = GameTheme.ShopButtonEquippedTextColor;
                
            } else {

                this.priceText.text = 'purchased';
                this.color = GameTheme.DefaultButtonColor;
                this.textColor = GameTheme.DefaultButtonTextColor;
            }
            
        } else {

            this.price = this._originalPrice;

            this.priceText.text = formatMoney(this.price);
            this.color = GameTheme.DefaultButtonColor;
            this.textColor = GameTheme.DefaultButtonTextColor;

        }   
    }

    update() {
        super.update();
    }
}