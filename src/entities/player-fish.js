import { HealthComponent } from "../components/health-component.js";
import { HATS } from "../equipment/hats.js";
import { WEAPONS } from "../equipment/weapons.js";
import { GAME } from "../main.js";
import { getWorldSize } from "../utils.js";
import { BaseEntity } from "./base-entity.js";
import { FishEntity } from "./fish-entity.js";
import { HatEntity } from "./hat-entity.js";
import { WeaponEntity } from "./weapon-entity.js";

const WEAPON_ANCHOR_POS_RATIO = vec2(0.5, -0.5);
const WEAPON_SIZE_SCALE = 0.8;

const HAT_ANCHOR_POS_RATIO = vec2(0.25, 0.50)
const HAT_SIZE_SCALE = 1.0;

export class PlayerFish extends FishEntity
{
    constructor(options = {})
    {
        super({
            fishType: 'player_fish',
            ...options,
        });

        this.healthComponent = new HealthComponent({
            lives: 3,
        });

        this.score = 0;
        this.experience = 0;

        this.spawnPosition = this.pos.copy();
        this.healthComponent.update();

        /**
         * @type {HatEntity}
         */
        this.hat = null;

        if (GAME.currentHatName) {
            this.hat = new HatEntity(GAME.currentHatName);
            this.addChild(this.hat, vec2(0, 1));
        }
        
        /**
         * @type {WeaponEntity}
         */
        this.weapon = null;

        if (GAME.currentWeaponName) {
            this.weapon = new WeaponEntity(WEAPONS[GAME.currentWeaponName]);
            this.addChild(this.weapon, this.size.multiply(WEAPON_ANCHOR_POS_RATIO));
        }
    }

    update() {
        super.update();

        this.healthComponent.update();

        this.drawSize = vec2(this.growthComponent.currentSize, this.growthComponent.currentSize);
        this.velocity = keyDirection().scale(this.moveSpeed);

        this.color = rgb(1, 1, 1, this.healthComponent.isInvulnerable ? 0.5 : 1);

        // bound the player fish to the bounds of the world
        const halfWorldSize = getWorldSize().scale(0.5);
        this.pos.x = min(halfWorldSize.x, this.pos.x);
        this.pos.x = max(-halfWorldSize.x, this.pos.x);
        this.pos.y = min(halfWorldSize.y, this.pos.y);
        this.pos.y = max(-halfWorldSize.y, this.pos.y);

        if (this.hat) {
            
            this.hat.mirror = this.mirror;
            
            this.hat.drawSize = vec2(this.drawSize.y * HAT_SIZE_SCALE);

            const hatInfo = HATS[this.hat.hatName];

            this._updateEquipmentLocalPos(
                this, HAT_ANCHOR_POS_RATIO,
                this.hat, hatInfo.alignmentPos
            )

            this.hat.localPos = this.drawSize.multiply(HAT_ANCHOR_POS_RATIO);
        }

        if (this.weapon) {

            this.weapon.mirror = this.mirror;

            this.weapon.drawSize = this.weapon.tileInfo.size.normalize(this.drawSize.y * WEAPON_SIZE_SCALE);
                        
            this._updateEquipmentLocalPos(
                this, WEAPON_ANCHOR_POS_RATIO, 
                this.weapon, this.weapon.weaponInfo.alignmentPos);
        }
    }

    /**
     * 
     * @param {BaseEntity} parent 
     * @param {BaseEntity} child 
     */
    _updateEquipmentLocalPos(parent, parentAnchorPosRatio, child, childAlignmentPos) {
            
            const childAlignmentPosRatio = childAlignmentPos.divide(child.tileInfo.size);
            const childAlignmentPosScaled = child.drawSize.multiply(childAlignmentPosRatio).scale(0.5);

            const parentAnchorPos = parent.drawSize.multiply(parentAnchorPosRatio).scale(0.5);

            child.localPos = parentAnchorPos.add(childAlignmentPosScaled);
    }

    /**
     * @param {BaseEntity} other
     * @returns 
     */
    collideWithObject(other) {

        super.collideWithObject(other);

        if (!this.healthComponent.isInvulnerable) {

            if (other.growthComponent) {
                
                if (this.growthComponent.currentSize >= other.growthComponent.currentSize) {

                    const score = max(1, floor(other.growthComponent.currentSize * 10));

                    this.addScore(score);
                    
                    this.growthComponent.grow();

                } else {

                    this.takeDamage();

                }

                other.destroy();
            }

        }

        return false;
    }

    addScore(amount) {
        this.score += amount;
    }

    takeDamage() {

        this.healthComponent.loseLife();

        if (this.healthComponent.isDead())
        {
            this.onDeath();
            return;
        }

        this.respawn();
    }

    respawn() {
        this.pos = this.spawnPosition.copy();
        this.velocity = vec2(0, 0);
    }

    onDeath() {
        this.destroy();
    }
}