export const directions = {
    UP: [-1, 0], // up
    RIGHT: [0, 1], // right
    DOWN: [1, 0], // down
    LEFT: [0, -1], // left
    "TOP-RIGHT": [-1, 1], // up-right
    "BOTTOM-RIGHT": [1, 1], // down-right
    "BOTTOM-LEFT": [1, -1], // down-left
    "TOP-LEFT": [-1, -1] // up-left
} as const;
