import { BaseEntity } from "./base-entity.js";

export class ObstacleEntity extends BaseEntity
{
    constructor({
        obstacleType = 'rock',
        collisionRadius = 32,
        ...baseOptions
    } = {})
    {
        super(baseOptions);

        this.obstacleType = obstacleType;
    }

    onCollision(entity)
    {
        // STUB:
        // Hazard or blocking logic later.
    }
}