import { rgb255 } from "./utils.js";

export const FishAIState = {
    IDLE: 'idle',
    ROAM: 'roam'
};

export const FishSizes = {
    SMALL: 'small-fish',
    MEDIUM: 'medium-fish',
    LARGE: 'large-fish',
};

export const RenderLayers = {
    BACKGROUND: 0,
    FISH: 10,
    ACCESSORIES: 20,
};

export const GameTheme = {

    DefaultButtonColor: rgb255(15, 7, 245),
    DefaultButtonTextHeight: 32,

}