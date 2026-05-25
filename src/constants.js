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
    DefaultButtonTextColor: WHITE,
    DefaultButtonTextHeight: 32,

    ShopButtonSize: vec2(120, 100),

    ShopButtonEquippedColor: rgb255(22, 74, 30),
    ShopButtonEquippedTextColor: WHITE,
}