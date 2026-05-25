import { AIComponent } from "../components/ai-component.js";
import { FishAIState } from "../constants.js";
import { FishEntity } from "./fish-entity.js";

export class AIFish extends FishEntity
{
    constructor(options = {}) {
        super({
            fishType: 'ai_fish',
            ...options,
        });

        this.aiComponent = new AIComponent({
            state: FishAIState.ROAM,
        });
    }

    update() {
        super.update();
        this.aiComponent.update(this);
    }
}