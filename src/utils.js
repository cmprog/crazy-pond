export function generateId()
{
    return crypto.randomUUID();
}

export function getWorldSize() {
    return canvasFixedSize.scale(1 / cameraScale);
}


let currentWorldSize = getWorldSize();
let currentHalfWorldSize = currentWorldSize.scale(0.5);

export function getCurrentWorldSize() {
    return currentWorldSize;
}

export function setCurrentWorldSize(value) {
    currentWorldSize = value;
    currentHalfWorldSize = value.scale(0.5);
}

export function getCurrentWorldHalfSize() {
    return currentHalfWorldSize;
}

export function randWorldPos() {
    return vec2(
        rand(-currentHalfWorldSize.x, currentHalfWorldSize.x),
        rand(-currentHalfWorldSize.y, currentHalfWorldSize.y)
    );
}

export function rgb255(r, g, b, a = 255) {
    return rgb(r / 255, g / 255, b / 255, a / 255)
}

const FORMAT_MONEY_OPTIONS = {
    maximumFractionDigits: 0,
}

/**
 * 
 * @param {number} value 
 * @returns {string}
 */
export function formatMoney(value) {    
    return `${value.toLocaleString('en-US', FORMAT_MONEY_OPTIONS)} c`;
}

/**
 * Returns a random item from the array.
 * @param {[]} items 
 */
export function randItem(items) {
    
    if (!items.length) {
        return undefined;
    }

    const index = randInt(0, items.length);
    return items[index];
}

/**
 * Checks if the given object is far outside of the world boundary.
 * @param {EngineObject} obj 
 */
export function isWellOutsideWorldBoundary(obj) {
    
    // This gets the bottom right - but to get a positive size
    // we just flip the y-sign
    const worldSize = screenToWorld(mainCanvasSize);
    worldSize.y = -worldSize.y;

    const scaledWorldSize = worldSize.scale(3);

    return (Math.abs(obj.pos.x) > Math.abs(scaledWorldSize.x)) || (Math.abs(obj.pos.y) > Math.abs(scaledWorldSize.y));
}