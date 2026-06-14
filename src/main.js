import { Game } from './systems/game.js';
import { DebugEquipmentScreen } from './screens/debug-equipment-screen.js';

export const GAME = new Game();

window.DEV = {
    addMoney: (amount = 1000) => GAME.earnMoney(amount),
    openEquipmentDebug: () => GAME.loadScreen(new DebugEquipmentScreen()),
};

engineInit(
    GAME.init.bind(GAME),
    GAME.update.bind(GAME), 
    GAME.updatePost.bind(GAME), 
    GAME.render.bind(GAME), 
    GAME.renderPost.bind(GAME), 
    GAME.sprites.images);