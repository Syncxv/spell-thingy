import { useEffect, useRef, useState } from "react";

import { Letter } from "../types";
import { directions } from "../utils/constants";
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
        checkIfIsStart(letter: Letter) {
            if (selectedLetters.current.length === 0) {
                selectedLetters.current.push(letter);
                letter.ref?.classList.add("selected");
            }
        },
        // TODO: make it happen
        makeMoveFunctions() {
            for (const [key, value] of Object.entries(directions)) {
                this[`move${key}`] = () => { };

            }
        },
        moveUp(from: Letter, distance = 1) {
            this.checkIfIsStart(from);
            const [dx, dy] = directions.UP;
            for (let i = 0; i < distance; ++i) {
                const x2 = from.row + dx - i;
                const y2 = from.column + dy;
                if (x2 >= 0 && x2 < grid.length && y2 >= 0 && y2 < grid[0].length) {
                    this.pushToSelectedLetters(grid[x2][y2]);
                }
            }
        },

        moveDown(from: Letter, distance = 1) {
            this.checkIfIsStart(from);
            const [dx, dy] = directions.DOWN;
            for (let i = 0; i < distance; ++i) {
                const x2 = from.row + dx + i;
                const y2 = from.column + dy;
                if (x2 >= 0 && x2 < grid.length && y2 >= 0 && y2 < grid[0].length) {
                    this.pushToSelectedLetters(grid[x2][y2]);
                }
            }
        },
        moveLeft(from: Letter, distance = 1) {
            this.checkIfIsStart(from);
            const [dx, dy] = directions.LEFT;
            for (let i = 0; i < distance; ++i) {
                const x2 = from.row + dx;
                const y2 = from.column + dy + i;
                if (x2 >= 0 && x2 < grid.length && y2 >= 0 && y2 < grid[0].length) {
                    this.pushToSelectedLetters(grid[x2][y2]);
                }
            }
        },

        moveRight(from: Letter, distance = 1) {
            this.checkIfIsStart(from);
            const [dx, dy] = directions.RIGHT;
            for (let i = 0; i < distance; ++i) {
                const x2 = from.row + dx;
                const y2 = from.column + dy + i;
                if (x2 >= 0 && x2 < grid.length && y2 >= 0 && y2 < grid[0].length) {
                    this.pushToSelectedLetters(grid[x2][y2]);
                }
            }
        },

        moveTopRight(from: Letter, distance = 1) {
            this.checkIfIsStart(from);
            const [dx, dy] = directions.TOPRIGHT;
            for (let i = 0; i < distance; ++i) {
                const x2 = from.row + dx + i;
                const y2 = from.column + dy - i;
                if (x2 >= 0 && x2 < grid.length && y2 >= 0 && y2 < grid[0].length) {
                    this.pushToSelectedLetters(grid[x2][y2]);
                }
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
        },

        getCurrentWordString: () => selectedLetters.current.map(l => l.key).join("")
    };
};
