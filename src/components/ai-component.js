import { FishAIState } from "../constants.js";
import { BaseEntity } from "../entities/base-entity.js";
import { getWorldSize, randItem } from "../utils.js";

export class AIComponent
{
    constructor({
        state = FishAIState.IDLE,
    } = {})
    {
        this.state = state;
        this.isStateInitialized = false;

        /**
         * @type {EngineObject}
         */
        this.target = null;

        this.stateTimer = null;
    }

    /**
     * @param {EngineObject} entity 
     */
    update(entity) {

        switch (this.state)
        {
            case FishAIState.IDLE:
                this.handleIdle(entity);
                break;

            case FishAIState.ROAM:
                this.handleRoam(entity);
                break;
        } 
    }

    /**
     * @param {BaseEntity} entity 
     */
    handleIdle(entity) {

        if (!this.stateTimer) {
            this.stateTimer = new Timer(1 + rand(0, 2));
        }

        if (!this.isStateInitialized) {
            
            this.savedVelocity = entity.velocity.copy();
            this.savedPosition = entity.pos.copy();
            this.idleStartTime = time;
            
            entity.velocity = vec2(0);

            this.isStateInitialized = true;
        }

        entity.pos.y = this.savedPosition.y + oscillate(0.8, 0.7, time - this.idleStartTime);

        if (this.stateTimer.elapsed()) {   
            this.randomStateChange();
            this.stateTimer = null;

            // Restore the entity's state
            entity.velocity = this.savedVelocity;
        } 
    }
        
    /**
     * @param {BaseEntity} entity 
     */
    handleRoam(entity) {

        if (!this.stateTimer) {
            this.stateTimer = new Timer(2 + rand(0, 5));            
        }

        const halfWorldSize = getWorldSize().scale(0.5);

        if (entity.pos.x > halfWorldSize.x + entity.size.x + 1) {
            entity.velocity.x = -entity.velocity.x;
            entity.pos.x = halfWorldSize.x + entity.size.x;

        } else if (entity.pos.x < -halfWorldSize.x - entity.size.x - 1) {
            entity.velocity.x = -entity.velocity.x;
            entity.pos.x = -halfWorldSize.x - entity.size.x;
        }     

        if (this.stateTimer.elapsed()) {   
            this.randomStateChange();
            this.stateTimer = null;
        }  
    }

    randomStateChange() {
        const allStateKeys = Object.keys(FishAIState);
        this.state = FishAIState[randItem(allStateKeys)];
        this.isStateInitialized = false;
    }
}