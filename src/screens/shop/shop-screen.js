import { GameTheme } from "../../constants.js";
import { Bubble } from "../../entities/bubbles.js";
import { BULLET_INFOS } from "../../equipment/bullets.js";
import { HAT_INFOS } from "../../equipment/hats.js";
import { WEAPON_INFOS } from "../../equipment/weapons.js";
import { randWorldPos } from "../../utils.js";
import { GameScreen } from "../game-screen.js";
import { MainMenuScreen } from "../main-menu-screen.js";
import { BulletButton } from "./bullet-button.js";
import { HatButton } from "./hat-button.js";
import { UIPagedLayout } from "./paged-layout.js";
import { WeaponButton } from "./weapon-button.js";

let bubblePositions = null;
let bubbleSizes = null;

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

        this.shopLayout = new UILayout(canvasFixedSize.scale(0.5), 1, 10, 10);

        const textTitle = new UIText(vec2(), vec2(100, 50), 'Shop');
        textTitle.textHeight = 50;        
        textTitle.textColor = BLACK;
        this.shopLayout.addChild(textTitle);

        const itemLayout = new UIPagedLayout(vec2(0), canvasFixedSize.scale(0.5), 3, 3, 10, 10, true);
        this.shopLayout.addChild(itemLayout);

        this._hatButtons = [];
        this._weaponButtons = [];
        this._bulletButtons = [];

        for (const hat of HAT_INFOS) {

            const tileInfo = this.game.sprites.hats[hat.name];

            const button = new HatButton(hat, tileInfo, hat.price);
            button.setHasBeenPurchased(this.game.purchasedHats[hat.name], hat.name == this.game.currentHatName);
            button.onClick = () => this._buyHat(button);
            itemLayout.addChild(button);
            this._hatButtons.push(button);
        }

        for (const weapon of WEAPON_INFOS) {

            const tileInfo = this.game.sprites.weapons[weapon.name];

            const button = new WeaponButton(weapon, tileInfo, weapon.price);
            button.setHasBeenPurchased(this.game.purchasedWeapons[weapon.name], weapon.name == this.game.currentWeaponName);
            button.onClick = () => this._buyWeapon(button);
            itemLayout.addChild(button);
            this._weaponButtons.push(button);
        }

        for (const bullet of BULLET_INFOS) {

            const tileInfo = this.game.sprites.bullets[bullet.name];

            const button = new BulletButton(bullet, tileInfo, bullet.price);
            button.setHasBeenPurchased(this.game.purchasedBullets[bullet.name], bullet.name == this.game.currentBulletName);
            button.onClick = () => this._buyBullet(button);
            itemLayout.addChild(button);
            this._bulletButtons.push(button);
        }
        
        this.backButton = new UIButton(vec2(100, 40), vec2(200, 80), 'Back');
        this.backButton.color = GameTheme.DefaultButtonColor;
        this.backButton.textColor = WHITE;
        this.backButton.textHeight = GameTheme.DefaultButtonTextHeight;
        this.backButton.onClick = () => this._returnToMenu();
    }

    onHiding() {     
        this.backButton.destroy();           
        this.shopLayout.destroy();
        this.bubbles.forEach(x => x.destroy());
    }

    /**
     * @param {HatButton} hatButton
     */
    _buyHat(hatButton) {

        if (this.game.hasMoney(hatButton.price)) {

            this.game.spendMoney(hatButton.price);
            this.game.currentHatName = hatButton.hat.name;
            this.game.purchasedHats[hatButton.hat.name] = true;

            for (const btn of this._hatButtons) {
                btn.setHasBeenPurchased(!!this.game.purchasedHats[btn.hat.name], btn.hat.name === this.game.currentHatName);
            }
        }

    }

    /**
     * @param {WeaponButton} button
     */
    _buyWeapon(button) {

        if (this.game.hasMoney(button.price)) {

            this.game.spendMoney(button.price);
            this.game.currentWeaponName = button.weapon.name;
            this.game.purchasedWeapons[button.weapon.name] = true;

            for (const btn of this._weaponButtons) {
                btn.setHasBeenPurchased(!!this.game.purchasedWeapons[btn.weapon.name], btn.weapon.name === this.game.currentWeaponName);
            }
        }

    }

    /**
     * @param {BulletButton} button
     */
    _buyBullet(button) {

        if (this.game.hasMoney(button.price)) {

            this.game.spendMoney(button.price);
            this.game.currentBulletName = button.bulletInfo.name;
            this.game.purchasedBullets[button.bulletInfo.name] = true;

            for (const btn of this._bulletButtons) {
                btn.setHasBeenPurchased(!!this.game.purchasedBullets[btn.bulletInfo.name], btn.bulletInfo.name === this.game.currentBulletName);
            }
        }

    }

    _returnToMenu() {
        this.game.loadScreen(new MainMenuScreen());
    }

}