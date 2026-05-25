import { BaseEntity } from "./base-entity";

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

    update(deltaTime)
    {
        super.update(deltaTime);

        this.lifetime -= deltaTime;

        if (this.lifetime <= 0)
        {
            this.destroy();
        }
    }
}