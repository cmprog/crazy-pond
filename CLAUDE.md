# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Crazy Pond** is a browser-based fish-eat-fish game built with [LittleJS](https://github.com/KilledByAPixel/LittleJS). The player grows by eating smaller fish and earns money to spend in the shop on hats, weapons, and bullets.

## Running the Game

The game is a static web app with no build step for game code. To run it locally you need an HTTP server (ES modules require HTTP, not `file://`):

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Then open `http://localhost:8080` in a browser.

The only pre-built artifact is `dist/littlejs.js` (the LittleJS engine bundle) — this is committed and does not need to be rebuilt.

## Architecture

### Entry Point & Engine Wiring

`index.html` loads `dist/littlejs.js` first (exposes LittleJS globals), then `src/main.js` as an ES module. `main.js` creates a singleton `GAME` and passes its lifecycle methods to LittleJS's `engineInit`:

```
engineInit(init, update, updatePost, render, renderPost, imageList)
```

### Screen System

`Game` (`src/systems/game.js`) manages a single active `GameScreen`. Transitioning screens calls `currentScreen.onHiding()` then `newScreen.onShowing(game)`.

Screen flow:
```
MainMenuScreen → GameplayScreen (Play / New Game)
MainMenuScreen → ShopScreen (Shop)
GameplayScreen → MainMenuScreen (win/death)
ShopScreen → MainMenuScreen (Back)
```

All screens extend `GameScreen` (`src/screens/game-screen.js`) and receive the `Game` instance via `onShowing(game)`, storing it as `this.game`.

### Entity Hierarchy

```
EngineObject (LittleJS)
└── BaseEntity          src/entities/base-entity.js       tag system, hitbox as 70% of drawSize
    └── FishEntity      src/entities/fish-entity.js       moveSpeed, GrowthComponent, mirroring
        ├── PlayerFish  src/entities/player-fish.js       keyboard input, HealthComponent, equipment children
        └── AIFish      src/entities/ai-fish.js           AIComponent for roaming behavior
```

Equipment rendered as LittleJS child objects attached to `PlayerFish`:
- `HatEntity` → child of PlayerFish
- `WeaponEntity` → child of PlayerFish
- `BulletEntity` → child of WeaponEntity

Position of equipment children is calculated in `PlayerFish._updateEquipmentLocalPos()` using `alignmentPos` (pixel offset within the sprite) and an anchor ratio on the parent.

### Components

Plain JS classes (not `EngineObject`s), updated manually each frame:

- `HealthComponent` — lives, invulnerability timer after taking damage
- `GrowthComponent` — current/max size, `grow()` / `canEat()` logic

### Equipment Data

Equipment is defined as static data objects in `src/equipment/`:

| File | Class | Registry |
|------|-------|----------|
| `hats.js` | `HatInfo` | `HATS` object + `HAT_NAMES` / `HAT_INFOS` arrays |
| `weapons.js` | `WeaponInfo` | `WEAPONS` object + `WEAPON_NAMES` / `WEAPON_INFOS` arrays |
| `bullets.js` | `BulletInfo` | `BULLETS` object + `BULLET_NAMES` / `BULLET_INFOS` arrays |

All extend `Equipment` (`src/equipment/equipment.js`). `WeaponInfo` includes `pos`, `size`, and `muzzlePos` (pixel coordinates into the sprite sheet). `BulletInfo` includes `pos` and `size`.

### Sprite Atlas

`SpriteAtlas` (`src/systems/sprites.js`) builds the image list that LittleJS preloads, then in `init()` maps each texture to a `TileInfo`. After init, sprites are accessed via `GAME.sprites.hats[name]`, `GAME.sprites.weapons[name]`, `GAME.sprites.bullets[name]`, etc. Adding a new equipment type requires registering its image here.

### Shop

`ShopScreen` uses a `UIPagedLayout` (paged grid) populated with `HatButton`, `WeaponButton`, and `BulletButton`. Purchase state (owned items, equipped item) is stored on the `Game` singleton (`purchasedHats`, `currentHatName`, etc.) and persists across screen transitions within a session (not saved to disk).

### LittleJS Globals

LittleJS exposes many globals without imports: `vec2`, `rgb`, `hsl`, `BLACK`, `WHITE`, `EngineObject`, `TileInfo`, `Timer`, `UIButton`, `UIText`, `UILayout`, `UISystemPlugin`, `uiSystem`, `textureInfos`, `canvasFixedSize`, `keyDirection`, `keyWasPressed`, `isOverlapping`, `rand`, `randInt`, `oscillate`, `drawTextScreen`, `setCanvasClearColor`, `setCanvasFixedSize`, `getPaused`, `setPaused`, `engineInit`, etc. These are available in all source files without importing.

### Constants

`src/constants.js` defines `FishSizes` (tag values for small/medium/large AI fish), `RenderLayers` (z-order), and `GameTheme` (colors, sizes used across UI).
