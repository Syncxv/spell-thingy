import { useEffect, useRef, useState } from "react";

import { Letter } from "../types";
import { getValue } from "../utils/getValue";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const moveUp = (grid: Letter[][], selectedLettersRef: React.MutableRefObject<Letter[]>) => (from: Letter, distnace = 1) => {

};

const pushSelectedLayers = (selectedLetters: React.MutableRefObject<Letter[]>) => (letter: Letter) => {

};

export const useInitGrid = (size = 5) => {
    const [grid, setGrid] = useState<Letter[][]>([]);
    const selectedLetters = useRef<Letter[]>([]);
    useEffect(() => {
        const tempGrid: Letter[][] = [];
        for (let row = 0; row < size; row++) {
            tempGrid[row] = [];
            for (let col = 0; col < size; col++) {
                const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
                tempGrid[row][col] = { key: randomLetter, value: getValue(randomLetter), row, column: col };
            }
        }

        setGrid(tempGrid);
    }, []);

    return {
        grid,
        selectedLetters,
        size,
        moveUp(from: Letter, distance = 1) {
            for (let i = 0; i > -distance; i -= 1) {

                const row = grid[from.row + i];
                if (!row) return;
                const letter = row[from.column];
                if (letter)
                    this.pushToSelectedLetters(letter);
            }
        },

        pushToSelectedLetters(letter: Letter) {
            if (letter.ref && letter.ref.classList.contains("selected")) {
                const currentLetterIndex = selectedLetters.current.findIndex(e => e === letter);
                selectedLetters.current.splice(currentLetterIndex - 1, 2);
                selectedLetters.current[currentLetterIndex - 1]?.ref?.classList.remove("selected");
                letter.ref.classList.remove("selected");
            } else {
                letter.ref?.classList.add("selected");
                selectedLetters.current.push(letter);
            }
        }
    };
};
