import { HealthComponent } from "../components/health-component.js";
import { GAME } from "../main.js";
import { getWorldSize } from "../utils.js";
import { BaseEntity } from "./base-entity.js";
import { FishEntity } from "./fish-entity.js";
import { HatEntity } from "./hat-entity.js";

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

        if (GAME.currentHatName) {
            this.hat = new HatEntity(GAME.currentHatName);
            this.addChild(this.hat, vec2(0, 1));
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

            const HAT_SIZE_SCALE = 1;
            
            this.hat.drawSize = vec2(this.drawSize.y * HAT_SIZE_SCALE);

            const HAT_OFFSET_RATIO_X = 0.25;
            const HAT_OFFSET_RATIO_Y = 0.50;

            this.hat.localPos = vec2(
                this.drawSize.x * HAT_OFFSET_RATIO_X,
                this.drawSize.y * HAT_OFFSET_RATIO_Y
            );
        }
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