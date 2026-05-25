import { GrowthComponent } from "../components/growth-component.js";
import { RenderLayers } from "../constants.js";
import { BaseEntity } from "./base-entity.js";

export class FishEntity extends BaseEntity
{
    constructor({
        fishType = 'generic_fish',
        moveSpeed = 100,
        turnSpeed = 5,
        scoreValue = 10,
        collisionRadius = 16,
        ...baseOptions
    } = {})
    {
        super(baseOptions);
        
        this.renderOrder = RenderLayers.FISH;

        this.fishType = fishType;
        
        this.moveSpeed = moveSpeed;
        this.turnSpeed = turnSpeed;

        this.scoreValue = scoreValue;

        this.velocity = vec2(1, 0).scale(moveSpeed);

        this.growthComponent = new GrowthComponent({
            currentSize: this.size.x,
        });
    }

    update() {
        super.update();

        // Make the fish face the right direction. This is done in a way to 'keep'
        // the mirror state until the fish actually changes velocity. This means the
        // idle state doesn't cause a fish to turn around.
        if (this.velocity.x < 0 && !this.mirror) {
            this.mirror = true;
        }
        else if (this.velocity.x > 0 && this.mirror) {
            this.mirror = false;
        }
    }

    canEat(targetFish)
    {
        return this.growthComponent.canEat(targetFish.growthComponent);
    }

    eat(targetFish)
    {
        if (!this.canEat(targetFish))
            return false;

        this.growthComponent.grow(1);

        targetFish.destroy();

        return true;
    }

    onEaten()
    {
        this.destroy();
    }
}