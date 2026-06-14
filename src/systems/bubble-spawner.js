import { BubbleGroup } from "../entities/bubbles.js";
import { getCurrentWorldHalfSize } from "../utils.js";

export class BubbleSpawner {

    constructor() {
        
        /**
         * @type {number}
         */
        this.bubbleSpawnInterval = 1.0;

        /**
         * @type {BubbleGroup[]} obj 
         */
        this.bubbleGroups = [];

        /**
         * @type {Timer} 
         */
        this.bubbleTimer = null;
    }

    init(game) {
        this.game = game;
    }

    update() {

        this.bubbleGroups = this.bubbleGroups.filter(g => !g.destroyed);

        if (!this.bubbleTimer) {
            this.bubbleTimer = new Timer(this.bubbleSpawnInterval);
        }

        if (this.bubbleTimer.elapsed()) {            
            this.spawnBubbleGroup();
            this.bubbleTimer.set(this.bubbleSpawnInterval);
        }

    }
        
    spawnBubbleGroup() {

        const halfWorldSize = getCurrentWorldHalfSize();
        const bubbleGroup = new BubbleGroup({
            sprite: this.game.sprites.bubbles.colored.SIZE_16,
            bubbleCount: rand(5, 10),
        });
        bubbleGroup.pos.x = rand(-halfWorldSize.x, halfWorldSize.x);
        bubbleGroup.pos.y = -halfWorldSize.y - bubbleGroup.size.y;

        this.bubbleGroups.push(bubbleGroup);
    }

    destroy() {
        this.bubbleGroups.forEach(x => x.destroy());
    }

}