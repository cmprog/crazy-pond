export class GrowthComponent
{
    constructor({
        currentSize = 1,
        growthRate = 0.1,
        maxSize = 5,
    } = {})
    {
        this.currentSize = currentSize;
        this.growthRate = growthRate;
        this.maxSize = maxSize;
    }

    grow(amount = 1)
    {
        this.currentSize += amount * this.growthRate;

        if (this.currentSize > this.maxSize)
        {
            this.currentSize = this.maxSize;
        }
    }

    canEat(targetGrowth)
    {
        return this.currentSize > targetGrowth.currentSize;
    }
}