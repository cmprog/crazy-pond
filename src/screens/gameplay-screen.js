import { FishSizes } from "../constants.js";
import { AIFish } from "../entities/ai-fish.js";
import { PlayerFish } from "../entities/player-fish.js";
import { BubbleSpawner } from "../systems/bubble-spawner.js";
import { formatMoney, getCurrentWorldHalfSize, rgb255 } from "../utils.js";
import { GameScreen } from "./game-screen.js";
import { MainMenuScreen } from "./main-menu-screen.js";

export class GameplayScreen extends GameScreen {

    constructor() {

        super();
        
        /**
         * @type {PlayerFish} obj 
         */
        this.playerFish = null;
        
        /**
         * @type {AIFish[]} obj 
         */
        this.aiFish = [];

        /**
         * @type {Timer} 
         */
        this.spawnTimer = null;
        
        /**
         * @type {BubbleSpawner} 
         */
        this.bubbleSpawner = new BubbleSpawner();

        /**
         * @type {UIText}
         */
        this.scoreText = new UIText(vec2(canvasFixedSize.x * 0.75, 10), vec2(100, 20), formatMoney(0));

        this.fishCountsBySize = {};
        for (const key of Object.keys(FishSizes)) {
            this.fishCountsBySize[FishSizes[key]] = 0;
        }

    }

    onShowing(game) {

        super.onShowing(game);

        this.bubbleSpawner.init(game);

        setCanvasClearColor(rgb255(17, 175, 242));
        
        this.playerFish = new PlayerFish({            
            position: vec2(0, 0),
            moveSpeed: 0.15,
        });

        this.playerFish.tileInfo = game.sprites.player;

    }

    update() {

        super.update();
        
        const SPAWN_TIMER_DURATION = 0.5;

        if (!this.spawnTimer) {
            this.spawnTimer = new Timer(SPAWN_TIMER_DURATION);
        }

        if (this.spawnTimer.elapsed()) {
            this.spawnAiFish();
            this.spawnTimer.set(SPAWN_TIMER_DURATION);
        }

        this.bubbleSpawner.update();
        
        if (this.playerFish.growthComponent.currentSize >= this.playerFish.growthComponent.maxSize) {            
            this.game.loadScreen(new MainMenuScreen());
        }

        if (this.playerFish.healthComponent.isDead()) {
            this.game.loadScreen(new MainMenuScreen());
        }

        this.scoreText.text = formatMoney(this.playerFish.score);
    }

    /**
     * 
     * @param {Vector2} size 
     * @returns 
     */
    getAiFishSpawnPosition(size) {

        const worldHalfSize = getCurrentWorldHalfSize();
        
        let y = rand(-worldHalfSize.y * 0.9, worldHalfSize.y * 0.9);
        let x = worldHalfSize.x * rand(1.0, 1.2);

        // Chace for it to spawn from the other side
        if (rand() > 0.5) {
            x = -1 * x;
        }

        const pos = vec2(x, y);

        // Make sure we spawn in a location which is not occupied by another
        // fish. We do this by moving it further to the left or right until it
        // it no longer overlapping anything.
        let isValidLocation = false;
        while (!isValidLocation) {

            let foundCollision = false;
            for (const other of this.aiFish) {
                if (isOverlapping(pos, size, other.pos, other.size)) {
                    foundCollision = true;
                    break;
                }
            }

            if (foundCollision) {                
                pos.x += size.x * (pos.x > 0 ? 1 : -1);
            } else {
                isValidLocation = true;
            }
        }

        return pos;
    }

    spawnAiFish() {

        const FISH_TEMPLATES = {};

        FISH_TEMPLATES[FishSizes.SMALL] = {
            moveSpeed: 0.10,
            scale: 0.5,
            size: FishSizes.SMALL,
        };

        FISH_TEMPLATES[FishSizes.MEDIUM] = {
            moveSpeed: 0.08,
            scale: 1.8,
            size: FishSizes.MEDIUM,
        };

        FISH_TEMPLATES[FishSizes.LARGE] = {
            moveSpeed: 0.06,
            scale: 2.5,
            size: FishSizes.LARGE,
        };

        const destroyedFish = [];
        for (const fish of this.aiFish) {
            if (fish.destroyed) {
                destroyedFish.push(fish);
                
                for (const key of Object.keys(this.fishCountsBySize)) {
                    if (fish.hasTag(key)) {
                        this.fishCountsBySize[key] = this.fishCountsBySize[key] - 1;
                    }
                }
            }
        }

        // Remove the destroyed fish
        for (const fish of destroyedFish) {
            const index = this.aiFish.indexOf(fish);
            this.aiFish.splice(index, 1);
        }

        // Ensure we have a minimum number of fish for each type
        const MIN_FISH_PER_TYPE = 2;
        for (const key of Object.keys(this.fishCountsBySize)) {
            if (this.fishCountsBySize[key] < MIN_FISH_PER_TYPE) {
                
                const fishTemplate = FISH_TEMPLATES[key];

                const fish = new AIFish({    
                    position: this.getAiFishSpawnPosition(vec2(fishTemplate.scale)),
                    moveSpeed: fishTemplate.moveSpeed,                    
                    scale: fishTemplate.scale,
                });

                fish.tileInfo = this.game.sprites.fish[key];

                fish.addTag(fishTemplate.size);

                if (fish.pos.x < 0) {
                    fish.velocity = vec2(1, 0).scale(fish.moveSpeed);
                } else {
                    fish.velocity = vec2(-1, 0).scale(fish.moveSpeed);
                }
                
                this.aiFish.push(fish);
                                
                this.fishCountsBySize[key] = this.fishCountsBySize[key] + 1;
            }
        }

        // Spawn another fish if we have any more room for a fish
        const MAX_FISH_COUNT = 20;
        if (this.aiFish.length < MAX_FISH_COUNT) {

            const templateKeys = Object.keys(FISH_TEMPLATES);
            const templateIndex = randInt(0, templateKeys.length);
            const fishTemplate = FISH_TEMPLATES[templateKeys[templateIndex]];

            const fish = new AIFish({    
                position: this.getAiFishSpawnPosition(vec2(fishTemplate.scale)),
                moveSpeed: fishTemplate.moveSpeed,                
                scale: fishTemplate.scale,
            });
            
            fish.tileInfo = this.game.sprites.fish[fishTemplate.size];

            fish.addTag(fishTemplate.size);

            if (fish.pos.x < 0) {
                fish.velocity = vec2(1, 0).scale(fish.moveSpeed);
            } else {
                fish.velocity = vec2(-1, 0).scale(fish.moveSpeed);
            }
            
            this.fishCountsBySize[fishTemplate.size] = this.fishCountsBySize[fishTemplate.size] + 1;
            
            this.aiFish.push(fish);
        }
    }

    updatePost() {        

        super.updatePost();

        if (keyWasPressed('Space')) {
            setPaused(!getPaused());
        }
    }

    renderPost() {

        super.renderPost();
        
        if (this.playerFish) {
            drawTextScreen(this.playerFish.healthComponent.lives.toFixed(0), vec2(20, 20), 40, BLACK);
        }
    }

    onHiding() {

        this.aiFish.forEach(x => x.destroy());
        this.playerFish.destroy();

        this.bubbleSpawner.destroy();

        this.scoreText.destroy();

        this.game.earnMoney(this.playerFish.score);

    }

}