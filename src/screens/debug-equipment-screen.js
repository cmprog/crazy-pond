import { BULLET_NAMES } from "../equipment/bullets.js";
import { HATS, HAT_NAMES } from "../equipment/hats.js";
import { WEAPON_NAMES } from "../equipment/weapons.js";
import { HAT_ANCHOR_POS_RATIO, PlayerFish } from "../entities/player-fish.js";
import { rgb255 } from "../utils.js";
import { GameScreen } from "./game-screen.js";
import { MainMenuScreen } from "./main-menu-screen.js";

const CATEGORIES     = ['hat', 'weapon', 'bullet'];
const OVERLAY_LEVELS = ['none', 'names', 'anchors', 'boxes'];

const FISH_SIZE_MIN  = 0.5;
const FISH_SIZE_MAX  = 5.0;
const FISH_SIZE_STEP = 0.25;

const FISH_COLOR   = rgb(1, 1, 1);
const HAT_COLOR    = rgb(0, 1, 1);
const WEAPON_COLOR = rgb(1, 0.5, 0);
const BULLET_COLOR = rgb(0, 1, 0);

export class DebugEquipmentScreen extends GameScreen {

    onShowing(game) {
        super.onShowing(game);
        setCanvasClearColor(rgb255(17, 175, 242));

        this._hatIndex      = -1;
        this._weaponIndex   = -1;
        this._bulletIndex   = -1;
        this._categoryIndex = 0;
        this._overlayLevel  = 1;
        this._mirrored      = false;
        this._fishSize      = 1.0;

        this._fish = null;
        this._rebuildPreview();
    }

    // --- active-category helpers ---

    _activeIndex() {
        switch (CATEGORIES[this._categoryIndex]) {
            case 'hat':    return this._hatIndex;
            case 'weapon': return this._weaponIndex;
            default:       return this._bulletIndex;
        }
    }

    _activeCount() {
        switch (CATEGORIES[this._categoryIndex]) {
            case 'hat':    return HAT_NAMES.length;
            case 'weapon': return WEAPON_NAMES.length;
            default:       return BULLET_NAMES.length;
        }
    }

    _setActiveIndex(val) {
        switch (CATEGORIES[this._categoryIndex]) {
            case 'hat':    this._hatIndex    = val; break;
            case 'weapon': this._weaponIndex = val; break;
            default:       this._bulletIndex = val;
        }
    }

    _activeName() {
        const idx = this._activeIndex();
        if (idx < 0) return 'none';
        switch (CATEGORIES[this._categoryIndex]) {
            case 'hat':    return HAT_NAMES[idx];
            case 'weapon': return WEAPON_NAMES[idx];
            default:       return BULLET_NAMES[idx];
        }
    }

    // --- preview management ---

    _destroyFish() {
        if (!this._fish) return;
        if (this._fish.hat)    this._fish.hat.destroy();
        if (this._fish.weapon) this._fish.weapon.destroy();
        if (this._fish.bullet) this._fish.bullet.destroy();
        this._fish.destroy();
        this._fish = null;
    }

    _rebuildPreview() {
        this._destroyFish();

        const previewGame = {
            ...this.game,
            currentHatName:    this._hatIndex    >= 0 ? HAT_NAMES[this._hatIndex]       : null,
            currentWeaponName: this._weaponIndex >= 0 ? WEAPON_NAMES[this._weaponIndex] : null,
            currentBulletName: this._bulletIndex >= 0 ? BULLET_NAMES[this._bulletIndex] : null,
        };

        this._fish = new PlayerFish({
            position: vec2(0, 0),
            moveSpeed: 0,
            game: previewGame,
        });
        this._fish.tileInfo = this.game.sprites.player;
        this._fish.mirror   = this._mirrored;
        this._fish.growthComponent.currentSize = this._fishSize;
    }

    // --- lifecycle ---

    update() {
        if (!this._fish) return;

        // PlayerFish.update() runs before this; re-enforce static state for rendering
        this._fish.velocity = vec2(0, 0);
        this._fish.growthComponent.currentSize = this._fishSize;
        this._fish.drawSize = vec2(this._fishSize);

        if (keyWasPressed('Escape')) {
            this.game.loadScreen(new MainMenuScreen());
            return;
        }

        if (keyWasPressed('Tab')) {
            this._categoryIndex = (this._categoryIndex + 1) % CATEGORIES.length;
        }

        if (keyWasPressed('ArrowRight')) {
            const next = this._activeIndex() + 1;
            this._setActiveIndex(next >= this._activeCount() ? -1 : next);
            this._rebuildPreview();
        }

        if (keyWasPressed('ArrowLeft')) {
            const prev = this._activeIndex() - 1;
            this._setActiveIndex(prev < -1 ? this._activeCount() - 1 : prev);
            this._rebuildPreview();
        }

        if (keyWasPressed('ArrowUp')) {
            this._fishSize = min(FISH_SIZE_MAX, this._fishSize + FISH_SIZE_STEP);
        }

        if (keyWasPressed('ArrowDown')) {
            this._fishSize = max(FISH_SIZE_MIN, this._fishSize - FISH_SIZE_STEP);
        }

        if (keyWasPressed('KeyM')) {
            this._mirrored = !this._mirrored;
            this._fish.mirror = this._mirrored;
        }

        if (keyWasPressed('KeyD')) {
            this._overlayLevel = (this._overlayLevel + 1) % OVERLAY_LEVELS.length;
        }
    }

    renderPost() {
        super.renderPost();
        if (!this._fish) return;

        if (this._overlayLevel >= 1) this._drawNames();
        if (this._overlayLevel >= 2) this._drawAnchors();
        if (this._overlayLevel >= 3) this._drawBoundingBoxes();

        this._drawHUD();
    }

    onHiding() {
        this._destroyFish();
    }

    // --- HUD ---

    _drawHUD() {
        const catLabel = CATEGORIES
            .map((c, i) => i === this._categoryIndex ? `[${c.toUpperCase()}]` : c)
            .join('  ');

        const activeIdx    = this._activeIndex();
        const itemProgress = activeIdx < 0
            ? 'none'
            : `${this._activeName()}  (${activeIdx + 1} / ${this._activeCount()})`;

        const hatName    = this._hatIndex    >= 0 ? HAT_NAMES[this._hatIndex]       : 'none';
        const weaponName = this._weaponIndex >= 0 ? WEAPON_NAMES[this._weaponIndex] : 'none';
        const bulletName = this._bulletIndex >= 0 ? BULLET_NAMES[this._bulletIndex] : 'none';

        const cx = canvasFixedSize.x * 0.5;

        drawTextScreen(`[TAB]  ${catLabel}`,     vec2(cx, 24), 20, WHITE);
        drawTextScreen(`[◄ ►]  ${itemProgress}`, vec2(cx, 50), 20, WHITE);
        drawTextScreen(
            `[▲ ▼] size: ${this._fishSize.toFixed(2)}   [M] mirror: ${this._mirrored ? 'on' : 'off'}   [D] overlay: ${OVERLAY_LEVELS[this._overlayLevel]}   [ESC] exit`,
            vec2(cx, 76), 18, WHITE
        );
        drawTextScreen(
            `hat: ${hatName}   weapon: ${weaponName}   bullet: ${bulletName}`,
            vec2(cx, canvasFixedSize.y - 24), 18, WHITE
        );
    }

    // --- overlay layers ---

    _drawNames() {
        const label = (entity, text, color) => {
            const s = this._toScreen(entity.pos);
            drawTextScreen(text, vec2(s.x, s.y - 28), 16, color);
        };

        label(this._fish, 'player', FISH_COLOR);
        if (this._fish.hat)    label(this._fish.hat,    `hat: ${this._fish.hat.hatName}`,               HAT_COLOR);
        if (this._fish.weapon) label(this._fish.weapon, `weapon: ${this._fish.weapon.weaponInfo.name}`, WEAPON_COLOR);
        if (this._fish.bullet) label(this._fish.bullet, `bullet: ${this._fish.bullet.bulletInfo.name}`, BULLET_COLOR);
    }

    _drawAnchors() {
        const cross = (pos, size, color) => {
            drawRect(pos, vec2(size, 0.02), color);
            drawRect(pos, vec2(0.02, size), color);
        };

        // Fish center — small reference crosshair
        cross(this._fish.pos, 0.08, rgb(0.6, 0.6, 0.6));

        // Fish hat anchor — the point the hat brim should land on
        const fishHatAnchor = this._fish.pos.add(
            this._fish.drawSize.multiply(HAT_ANCHOR_POS_RATIO).scale(0.5)
        );
        cross(fishHatAnchor, 0.18, FISH_COLOR);

        if (this._fish.hat) {
            const hat    = this._fish.hat;
            const hatInfo = HATS[hat.hatName];
            // Hat brim in world: hat center minus the alignment offset
            // (by construction, this equals fishHatAnchor when the values are correct)
            const alignScaled = hat.drawSize.multiply(hatInfo.alignmentPos.divide(hat.tileInfo.size)).scale(0.5);
            const hatBrim = hat.pos.subtract(alignScaled);
            cross(hatBrim, 0.18, HAT_COLOR);
        }

        if (this._fish.weapon) cross(this._fish.weapon.pos, 0.15, WEAPON_COLOR);
        if (this._fish.bullet) cross(this._fish.bullet.pos, 0.15, BULLET_COLOR);
    }

    _drawBoundingBoxes() {
        const box = (entity, color) => {
            const p  = entity.pos;
            const hs = entity.size.scale(0.5);
            const T  = 0.02;
            drawRect(vec2(p.x,       p.y + hs.y), vec2(hs.x * 2 + T, T), color);  // top
            drawRect(vec2(p.x,       p.y - hs.y), vec2(hs.x * 2 + T, T), color);  // bottom
            drawRect(vec2(p.x - hs.x, p.y),       vec2(T, hs.y * 2),     color);  // left
            drawRect(vec2(p.x + hs.x, p.y),       vec2(T, hs.y * 2),     color);  // right
        };

        box(this._fish, FISH_COLOR);
        if (this._fish.hat)    box(this._fish.hat,    HAT_COLOR);
        if (this._fish.weapon) box(this._fish.weapon, WEAPON_COLOR);
        if (this._fish.bullet) box(this._fish.bullet, BULLET_COLOR);
    }

    // Converts a world-space position to canvas screen-space coordinates.
    _toScreen(worldPos) {
        return vec2(
            (worldPos.x - cameraPos.x) * cameraScale + canvasFixedSize.x * 0.5,
            canvasFixedSize.y * 0.5 - (worldPos.y - cameraPos.y) * cameraScale
        );
    }
}
