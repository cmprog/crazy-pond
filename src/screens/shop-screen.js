import { GameTheme } from "../constants.js";
import { Bubble } from "../entities/bubbles.js";
import { formatMoney, randWorldPos } from "../utils.js";
import { GameScreen } from "./game-screen.js";
import { MainMenuScreen } from "./main-menu-screen.js";

let bubblePositions = null;
let bubbleSizes = null;

const SHOP_BUTTON_SIZE = vec2(120, 100);

const SHOP_BUTTON_TILE_RATIO = 0.6;

class ShopButton extends UIButton {

    constructor(tileInfo, price) {
        super();

        this.size = SHOP_BUTTON_SIZE;

        this.price = price;

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
}

class HatButton extends ShopButton {

    constructor(hatName, tileInfo, price) {

        super(tileInfo, price);

        /**
         * @type {string}
         */
        this.hatName = hatName;
    }

}

export class ShopScreen extends GameScreen {

    constructor() {

        super();
                
        /**
         * @type {Bubble[]}
         */
        this.bubbles = [];

        /**
         * @type {UIButton}
         */
        this.backButton = null;
    }

    onShowing(game) {
    
        super.onShowing(game);

        const BUBBLE_COUNT = 30;

        if (!bubblePositions) {

            bubbleSizes = [];
            bubblePositions = [];

            for (let i = 0; i < BUBBLE_COUNT; i += 1) {                

                bubbleSizes.push(vec2(rand(0.5, 2.0)));
                bubblePositions.push(randWorldPos());
            }
        }

        for (let i = 0; i < BUBBLE_COUNT; i += 1) {

            const bubble = new Bubble({
                sprite: this.game.sprites.bubbles.colored.SIZE_16,
                size: bubbleSizes[i],
            });

            bubble.pos = bubblePositions[i];

            this.bubbles.push(bubble);
        }

        this.shopLayout = new UILayout(canvasFixedSize.scale(0.5), 1, 20, 80);

        this.shopLayout.addChild(new UIText(vec2(), vec2(100, 20), 'Shop'));

        const shopGrid = new UILayout(vec2(), 4, 70, 0, true);

        for (const hatName of Object.keys(this.game.sprites.hats)) {
            
            const tileInfo = this.game.sprites.hats[hatName];

            const button = new HatButton(hatName, tileInfo, 500);
            button.onClick = () => this.buyHat(button);
            shopGrid.addChild(button);
        }

        this.shopLayout.addChild(shopGrid);
        
        this.backButton = new UIButton(vec2(100, 40), vec2(200, 80), 'Back');
        this.backButton.color = GameTheme.DefaultButtonColor;
        this.backButton.textColor = WHITE;
        this.backButton.textHeight = GameTheme.DefaultButtonTextHeight;
        this.backButton.onClick = () => this.returnToMenu();
    }

    /**
     * @param {HatButton} hatButton 
     */
    buyHat(hatButton) {

        if (this.game.hasMoney(hatButton.price)) {
            this.game.spendMoney(hatButton.price);
            this.game.currentHatName = hatButton.hatName;
        }

    }

    onHiding() {     
        this.backButton.destroy();           
        this.shopLayout.destroy();
        this.bubbles.forEach(x => x.destroy());
    }

    returnToMenu() {
        this.game.loadScreen(new MainMenuScreen());
    }

}