export const directions = {
    UP: [-1, 0], // up
    RIGHT: [0, 1], // right
    DOWN: [1, 0], // down
    LEFT: [0, -1], // left
    TOPRIGHT: [-1, 1], // up-right
    BOTTOMRRIGHT: [1, 1], // down-right
    BOTTOMLEFT: [1, -1], // down-left
    TOPLEFT: [-1, -1] // up-left
} as const;
