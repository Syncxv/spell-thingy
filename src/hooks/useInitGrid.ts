import { useEffect, useRef, useState } from "react";

import { Letter } from "../types";
import { getValue } from "../utils/getValue";
import { uuidv4 } from "../utils/uuidv4";

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
                tempGrid[row][col] = { id: uuidv4(), key: randomLetter, value: getValue(randomLetter), row, column: col };
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
            for (var selectionType = -1, o = 0; o < selectedLetterz.length; o++)
                if (selectedLetterz[o].id === letter.id) {
                    selectionType = o;
                    break;
                }
            console.log(selectionType);
            // -1 means select letter XD
            if (selectionType === -1) {
                letter.ref?.classList.add("selected");
                selectedLetterz.push(letter);

            }
            // deselect layer XD
            else if (selectionType === selectedLetterz.length - 2) {
                console.log(":O");
                var letterToDeSelect = selectedLetterz[selectedLetterz.length - 1];
                selectedLetters.current.pop();
                letterToDeSelect?.ref?.classList.remove("selected");
            }
        },

        isAdjecent(a: Letter, b: Letter) {
            return Math.abs(a.column - b.column) <= 1 && Math.abs(a.row - b.row) <= 1;
        }
    };
};
