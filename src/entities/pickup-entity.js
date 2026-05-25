import { BaseEntity } from "./base-entity";

export class PickupEntity extends BaseEntity
{
    constructor({
        pickupType = 'food',
        value = 10,
        collisionRadius = 12,
        ...baseOptions
    } = {})
    {
        super(baseOptions);

        this.pickupType = pickupType;
        this.value = value;
    }

    collect(entity)
    {
        // STUB:
        // Apply effects later.

        this.destroy();
    }
}