import { BaseEntity } from "./base-entity.js";

export class EffectEntity extends BaseEntity
{
    constructor({
        lifetime = 1,
        ...baseOptions
    } = {})
    {
        super(baseOptions);

        this.lifetime = lifetime;
    }

    update()
    {
        super.update();

        this.lifetime -= timeDelta;

        if (this.lifetime <= 0)
        {
            this.destroy();
        }
    }
}