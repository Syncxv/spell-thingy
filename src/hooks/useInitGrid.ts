import { useEffect, useRef, useState } from "react";

import { Letter } from "../types";
import { directions } from "../utils/constants";
import { getValue } from "../utils/getValue";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

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
            const selectedLetterz = this.selectedLetters.current;
            if (selectedLetterz.length > 0 && !this.isAdjecent(letter, selectedLetterz[selectedLetterz.length - 1])) {
                grid.flat().forEach(m => m.ref?.classList.remove("selected"));
                selectedLetters.current = [];
            }
            if (letter.ref && letter.ref.classList.contains("selected")) {
                const currentLetterIndex = selectedLetterz.findIndex(e => e === letter);
                selectedLetterz.splice(currentLetterIndex, 1);
                letter.ref.classList.remove("selected");
            } else {
                letter.ref?.classList.add("selected");
                selectedLetterz.push(letter);
            }
        },


        getNeighbours(letter: Letter) {
            const neighbors: Letter[] = [];
            for (const [dx, dy] of directions) {
                const x2 = letter.row + dx;
                const y2 = letter.column + dy;

                if (x2 >= 0 && x2 < grid.length && y2 >= 0 && y2 < grid[0].length) {
                    neighbors.push(grid[x2][y2]);
                }

            }
            return neighbors;

        },


        isAdjecent(a: Letter, b: Letter) {
            return Math.abs(a.column - b.column) <= 1 && Math.abs(a.row - b.row) <= 1;
        }
    };
};
