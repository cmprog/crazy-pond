import { RenderLayers } from "../constants.js";
import { getWorldSize } from "../utils.js";
import { BaseEntity } from "./base-entity.js";

export class Bubble extends BaseEntity {

    constructor({
        sprite,
        size,
        ...baseOptions
    } = {}) {

        super(baseOptions);

        this.renderOrder = RenderLayers.BACKGROUND;
        this.drawSize = size;

        this.tileInfo = sprite;
    }
}

const WAVE_FREQUENCY = 0.5;
const WAVE_MAGNITUDE = 2;

export class BubbleGroup extends BaseEntity{

    constructor({
        sprite,
        bubbleCount = 5,        
        ...baseOptions
    } = {}) {

        super(baseOptions);

        this.setCollision(false, false, false);
        this.renderOrder = RenderLayers.BACKGROUND;
        this.velocity = vec2(0, 0.05);
        
        // We use this offset to prevent all the bubbles from having
        // the same wave pattern.
        this.waveOffset = rand(0, WAVE_MAGNITUDE);

        for (let i = 0; i < bubbleCount; i += 1) {

            const size = vec2(rand(0.5, 1.5));
            const pos = vec2(rand(-1, 1), rand(-2, 2));
            
            const bubble = new Bubble({
                sprite: sprite,
                size: size,
            });

            bubble.velocity = this.velocity.scale(rand(0.9, 1.1));

            this.addChild(bubble, pos);
        }
    }

    update() {
        super.update();

        const halfWorldSize = getWorldSize().scale(0.5);
        if (this.pos.y > halfWorldSize.y + this.size.y + 1) {
            this.destroy();
        }

        // child items don't move their local pos unless we do it ourself
        for (var bubble of this.children) {
            bubble.localPos = bubble.localPos.add(bubble.velocity);
        }

        if (!this.initialPos) {
            this.initialPos = this.pos.copy();            
        }

        this.pos.x = this.initialPos.x + oscillate(WAVE_FREQUENCY, WAVE_MAGNITUDE, time + this.waveOffset) - 1;
    }

    render() {
        // disable default rendering
    }
}