import { GameTheme } from "../constants.js";
import { GameScreen } from "../screens/game-screen.js";
import { MainMenuScreen } from "../screens/main-menu-screen.js";
import { getWorldSize, setCurrentWorldSize } from "../utils.js";
import { SpriteAtlas } from "./sprites.js";

export class Game
{
    constructor()
    {
        this.sprites = new SpriteAtlas();

        /**
         * @type {GameScreen}
         */
        this.currentScreen = null;
    }

    init() {

        this.sprites.init();

        /**
         * @type {string>}
         */
        this.money = 100000;

        /**
         * @type {string>}
         */
        this.currentHatName = null;

        /**
         * @type {Object<string, boolean>}
         */
        this.purchasedHats = {};

        /**
         * @type {string>}
         */
        this.currentWeaponName = null;

        /**
         * @type {Object<string, boolean>}
         */
        this.purchasedWeapons = {};

        /**
         * @type {string>}
         */
        this.currentBulletName = null;

        /**
         * @type {Object<string, boolean>}
         */
        this.purchasedBullets = {};

        new UISystemPlugin();
        uiSystem.defaultCornerRadius = 8;
        uiSystem.defaultShadowColor = BLACK;
        uiSystem.defaultButtonColor = GameTheme.DefaultButtonColor;
        uiSystem.defaultTextColor = WHITE;
        uiSystem.defaultHoverColor = GameTheme.DefaultButtonColor.add(rgb(0.2, 0.2, 0.2)).clamp();
        
        // use a 720p fixed size canvas
        setCanvasFixedSize(vec2(1280, 720));
        
        setCurrentWorldSize(getWorldSize());

        this.loadScreen(new MainMenuScreen())
    }  

    update() {

        setCurrentWorldSize(getWorldSize());

        if (this.currentScreen) {
            this.currentScreen.update();
        }

    }

    render() {
        if (this.currentScreen) {
            this.currentScreen.render();
        }
    }

    updatePost() {

        if (this.currentScreen) {
            this.currentScreen.updatePost();
        }
    }

    /**
     * @param {Screen} screen 
     */
    loadScreen(screen) {

        if (this.currentScreen) {
            this.currentScreen.onHiding();            
        }

        this.currentScreen = screen;

        if (this.currentScreen) {
            this.currentScreen.onShowing(this);
        }
    }

    renderPost() {

        if (this.currentScreen) {
            this.currentScreen.renderPost();            
        }
    }

    hasMoney(amount) {
        return this.money >= amount;
    }

    earnMoney(amount) {
        this.money += amount;
    }

    spendMoney(amount) {
        this.money -= amount;
    }

    reset() {
        this.money = 0;
        this.currentHatName = null;
    }
}