import { RenderLayers } from "../constants.js";
import { generateId } from "../utils.js";

const HIT_BOX_RATIO = 0.7;

export class BaseEntity extends EngineObject
{
    constructor({
        position = vec2(0, 0),
        velocity = vec2(0, 0),
        rotation = 0,
        scale = 1,
        sprite = null,
        color = WHITE,
    } = {})
    {
        super(position, vec2(scale, scale).scale(HIT_BOX_RATIO), null, rotation);

        this.drawSize = vec2(scale, scale);

        this.renderOrder = RenderLayers.BACKGROUND;

        this.id = generateId();

        this.velocity = velocity;
        this.sprite = sprite;
        this.color = color;
        
        this.setCollision();

        this.tags = new Set();        
    }

    update() {
        super.update();

        if (this.drawSize) {
            this.size = this.drawSize.scale(HIT_BOX_RATIO);
        }
    }

    collideWithObject() {
        return false;
    }

    addTag(tag)
    {
        this.tags.add(tag);
    }

    hasTag(tag)
    {
        return this.tags.has(tag);
    }
}