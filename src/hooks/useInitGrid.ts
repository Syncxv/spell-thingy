import { useEffect, useRef, useState } from "react";

import { Letter } from "../types";
import { directions } from "../utils/constants";
import { getValue } from "../utils/getValue";
import { uuidv4 } from "../utils/uuidv4";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const shuffleGrid = (size: number) => {
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

export const useInitGrid = (size = 5) => {
    const [grid, setGrid] = useState<Letter[][]>([]);
    const [validWords, setValidWords] = useState<string[]>([] as string[]);
    const selectedLetters = useRef<Letter[]>([]);
    useEffect(() => {

        const tempGrid = shuffleGrid(size);
        setGrid(tempGrid);

        async function initWords() {
            const rawText = await (await fetch("https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt")).text();
            const words = rawText.split("\n").map(l => l.replace(/[\r]/g, ""));
            setValidWords(words);
        }
        initWords();
    }, []);
    return {
        grid,
        selectedLetters,
        size,
        validWords,
        shuffle() {
            const newGrid = shuffleGrid(size);
            setGrid(newGrid);
        },

        setNewGrid(str: string) {
            const rows: Letter[][] = [];
            const columns = 5;

            for (let i = 0; i < str.length; i += columns) {
                rows.push(str.slice(i, i + columns).split("").map((s, j) => ({ id: uuidv4(), row: i, column: j, key: s.toUpperCase(), value: getValue(s.toUpperCase()) })));
            }

            setGrid(rows);
        },
        move(direction: keyof typeof directions, from: Letter, distance = 1) {
            this.checkIfIsStart(from);
            const [dx, dy] = directions[direction];
            for (let i = 0; i < distance; ++i) {
                let x2 = from.row + dx;
                let y2 = from.column + dy;

                dx === 0 ? null : dx < 0 ? x2 -= i : x2 += i;
                dy === 0 ? null : dy < 0 ? y2 -= i : y2 += i;
                if (x2 >= 0 && x2 < grid.length && y2 >= 0 && y2 < grid[0].length)
                    this.pushToSelectedLetters(grid[x2][y2]);
            }
        },
        checkIfIsStart(letter: Letter) {
            if (selectedLetters.current.length === 0) {
                selectedLetters.current.push(letter);
                letter.ref?.classList.add("selected");
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

        getCurrentWordString: () => selectedLetters.current.map(l => l.key).join(""),
        getNeighbours(letter: Letter) {
            const neighbors: Letter[] = [];
            for (const [dx, dy] of Object.values(directions)) {
                const x2 = letter.row + dx;
                const y2 = letter.column + dy;

                if (x2 >= 0 && x2 < grid.length && y2 >= 0 && y2 < grid[0].length) {
                    neighbors.push(grid[x2][y2]);
                }

            }
            return neighbors;
        },

        getCombinations(len = 4) {
            const N = grid.length;
            const allCombinations = new Set<string>();
            const visited = Array.from(Array(N), () => Array(N).fill(false));
            const frequencyMap = new Map<string, number>();

            // Populate the frequency map
            for (let row = 0; row < N; row++) {
                for (let col = 0; col < N; col++) {
                    const letter = grid[row][col];
                    if (frequencyMap.has(letter.key.toLowerCase())) {
                        frequencyMap.set(letter.key.toLowerCase(), frequencyMap.get(letter.key.toLowerCase())! + 1);
                    } else {
                        frequencyMap.set(letter.key.toLowerCase(), 1);
                    }
                }
            }

            const getAllCombinations = (
                row: number,
                col: number,
                visited: boolean[][],
                combination: string,
                allCombinations: Set<string>,
                remaining: Map<string, number>,
                length: number
            ) => {
                if (combination.length === length) {
                    allCombinations.add(combination);
                    return;
                }

                visited[row][col] = true;


                for (const [rowDelta, colDelta] of Object.values(directions)) {
                    const newRow = row + rowDelta;
                    const newCol = col + colDelta;
                    if (
                        newRow >= 0 &&
                        newRow < N &&
                        newCol >= 0 &&
                        newCol < N &&
                        !visited[newRow][newCol]
                    ) {
                        const letter = grid[newRow][newCol];
                        if (remaining.get(letter.id) === frequencyMap.get(letter.id)) {
                            continue;
                        }
                        remaining.set(letter.id, remaining.get(letter.id)! + 1);
                        getAllCombinations(
                            newRow,
                            newCol,
                            visited,
                            combination + letter.key.toLowerCase(),
                            allCombinations,
                            remaining,
                            length
                        );
                        remaining.set(letter.id, remaining.get(letter.id)! - 1);
                    }
                }
                visited[row][col] = false;
            };

            for (let length = 2; length <= N; length++) {
                for (let row = 0; row < N; row++) {
                    for (let col = 0; col < N; col++) {
                        getAllCombinations(
                            row,
                            col,
                            visited,
                            grid[row][col].key.toLowerCase(),
                            allCombinations,
                            new Map(frequencyMap),
                            length
                        );
                    }
                }
            }

            return Array.from(allCombinations);
        },


        getWords(n = 4) {
            return this.getCombinations(n);
        }


    };


};

