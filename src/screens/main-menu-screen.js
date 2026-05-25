import { GameTheme } from "../constants.js";
import { Bubble } from "../entities/bubbles.js";
import { formatMoney, randWorldPos, rgb255 } from "../utils.js";
import { GameScreen } from "./game-screen.js";
import { GameplayScreen } from "./gameplay-screen.js";
import { ShopScreen } from "./shop-screen.js";

let bubblePositions = null;
let bubbleSizes = null;

export class MainMenuScreen extends GameScreen {

    constructor() {

        super();
                
        /**
         * @type {Bubble[]}
         */
        this.bubbles = [];

        /**
         * @type {UIText[]}
         */
        this.titleTexts = [];

        /**
         * @type {UIObject[]}
         */
        this.rootUIObjects = [];
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

        setCanvasClearColor(rgb255(113, 91, 227));

        this.buttonLayout = new UILayout(vec2(canvasFixedSize.x * 0.75, canvasFixedSize.y * 0.5), 1, 20, 30, true);        
        this.rootUIObjects.push(this.buttonLayout);

        const shopButton = new UIButton(vec2(0), vec2(200, 80));
        shopButton.color = GameTheme.DefaultButtonColor;
        shopButton.onClick = () => this.loadShop();
        this.buttonLayout.addChild(shopButton);

        const shopButtonLayout = new UILayout(vec2(0), 1, 1, 0, true);
        shopButtonLayout.canBeHover = false;
        shopButton.addChild(shopButtonLayout);

        const shopButtonText = new UIText(vec2(0), vec2(shopButton.size.x, GameTheme.DefaultButtonTextHeight), 'Shop');
        shopButtonText.canBeHover = false;
        shopButtonText.textColor = WHITE;
        shopButtonText.textHeight = shopButtonText.size.y;
        shopButtonLayout.addChild(shopButtonText);

        if (this.game.money) {
            const SHOP_BUTTON_MONEY_TEXT_SCALE = 0.4;
            const shopButtonMoneyText = new UIText(vec2(0), vec2(shopButton.size.x, GameTheme.DefaultButtonTextHeight * SHOP_BUTTON_MONEY_TEXT_SCALE), formatMoney(this.game.money));
            shopButtonMoneyText.canBeHover = false;
            shopButtonMoneyText.textColor = WHITE;
            shopButtonMoneyText.textHeight = shopButtonMoneyText.size.y;
            shopButtonLayout.addChild(shopButtonMoneyText);
        }

        const playButton = new UIButton(vec2(0), vec2(200, 80), 'Play');
        playButton.color = GameTheme.DefaultButtonColor;
        playButton.textColor = WHITE;
        playButton.textHeight = GameTheme.DefaultButtonTextHeight;        
        playButton.onClick = () => this.continuePlaying();
        this.buttonLayout.addChild(playButton);

        const newGameButton = new UIButton(vec2(0), vec2(200, 80), 'New Game');
        newGameButton.color = GameTheme.DefaultButtonColor;
        newGameButton.textColor = WHITE;
        newGameButton.textHeight = GameTheme.DefaultButtonTextHeight;
        newGameButton.disabled = true;
        newGameButton.onClick = () => this.newGame();
        this.buttonLayout.addChild(newGameButton);

        this.titalTextLayout = new UILayout(vec2(canvasFixedSize.x * 0.30, canvasFixedSize.y * 0.5), 1, 20, 30, true);
        this.rootUIObjects.push(this.titalTextLayout);

        const TITLE_TEXT_HEIGHT = 200;
        const TITLE_TEXT_FONT = 'Henny Penny';
        const TITLE_TEXT_SIZE = vec2(800, 250);
        const TITLE_TEXT_ALIGN = 'center';

        const crazyText = new UIText(vec2(0), TITLE_TEXT_SIZE, 'Crazy', TITLE_TEXT_ALIGN, TITLE_TEXT_FONT);
        crazyText.textHeight = TITLE_TEXT_HEIGHT;
        this.titleTexts.push(crazyText);        
        this.titalTextLayout.addChild(crazyText);

        const pondText = new UIText(vec2(0), TITLE_TEXT_SIZE, 'Pond', TITLE_TEXT_ALIGN, TITLE_TEXT_FONT);
        pondText.textHeight = TITLE_TEXT_HEIGHT;
        this.titleTexts.push(pondText);
        this.titalTextLayout.addChild(pondText);
        
    }

    update() {

        for (const text of this.titleTexts) {            
            text.textColor = hsl(oscillate(1 / 5, 1), 0.3, 0.3);
        }
    }

    onHiding() {        
        this.rootUIObjects.forEach(x => x.destroy());                
        this.bubbles.forEach(x => x.destroy());
    }

    loadShop() {
        this.game.loadScreen(new ShopScreen());
    }

    continuePlaying() {
        this.game.loadScreen(new GameplayScreen());
    }

    newGame() {
        this.game.loadScreen(new GameplayScreen());
    }

}