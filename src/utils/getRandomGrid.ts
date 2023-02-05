import { Letter } from "../types";
import { getValue } from "./getValue";
import { uuidv4 } from "./uuidv4";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const getRandomGrid = (size: number) => {
    const tempGrid: Letter[][] = [];
    for (let row = 0; row < size; row++) {
        tempGrid[row] = [];
        for (let col = 0; col < size; col++) {
            const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
            tempGrid[row][col] = { id: uuidv4(), key: randomLetter, value: getValue(randomLetter), row, column: col };
        }
    }
    return tempGrid;
};
