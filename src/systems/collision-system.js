export class CollisionSystem
{
    static checkCollisions(entities)
    {
        for (let i = 0; i < entities.length; i++)
        {
            for (let j = i + 1; j < entities.length; j++)
            {
                const entityA = entities[i];
                const entityB = entities[j];

                if (!entityA.collisionComponent || !entityB.collisionComponent)
                    continue;

                const collided = entityA.collisionComponent.intersects(
                    entityB.collisionComponent,
                    entityA.position,
                    entityB.position
                );

                if (collided)
                {
                    this.handleCollision(entityA, entityB);
                }
            }
        }
    }

    static handleCollision(entityA, entityB)
    {
        // STUB:
        // Future collision rules:
        // - player eats fish
        // - predator damages player
        // - pickup collection
        // - obstacle collision
    }
}