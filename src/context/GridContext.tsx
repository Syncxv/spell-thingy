import { createContext, useEffect, useRef, useState } from "react";

import wordlist from "../assets/wordlist.txt?raw";
import { Letter } from "../types";
import { DEFAULT_MAX_LETTERS, directions } from "../utils/constants";
import { getRandomGrid } from "../utils/getRandomGrid";
import { getValue } from "../utils/getValue";
import { memoize } from "../utils/memoize";
import { uuidv4 } from "../utils/uuidv4";
export interface IGridManagerContext {
    grid: Letter[][];
    selectedLetters: React.MutableRefObject<Letter[]>;
    size: number;
    maxLetters: number,
    setMaxLetters: React.Dispatch<React.SetStateAction<number>>,
    validWordsSet: Set<string>;
    shuffle(): void;
    setNewGrid(str: string): void;
    move(direction: keyof typeof directions, from: Letter, distance?: number): void;
    checkIfIsStart(letter: Letter): void;
    pushToSelectedLetters(letter: Letter): void;
    isAdjecent(a: Letter, b: Letter): boolean;
    getGridAsString: () => string,
    getCurrentWordString: () => string;
    getNeighbours(letter: Letter): Letter[];
    getAllCombinations(row: number, col: number, visited: boolean[][], combination: Letter[], allCombinations: Letter[][], desired: number): void;
    getCombinations(n?: number): Letter[][];
    getWords(arr: Letter[][]): string[];
}

const initalValues: IGridManagerContext = {
    grid: [],
    selectedLetters: null as any,
    size: 5,
    maxLetters: 0,
    setMaxLetters: () => { },
    validWordsSet: new Set(),
    checkIfIsStart: () => { },
    move: () => { },
    pushToSelectedLetters: () => { },
    setNewGrid: () => { },
    shuffle: () => { },
    getGridAsString: () => "",
    getAllCombinations: () => { },
    getCurrentWordString: () => "",
    getNeighbours: () => [],
    isAdjecent: () => false,
    getCombinations: () => [],
    getWords: () => []
};

export const GridManagerContext = createContext<IGridManagerContext>(initalValues);

export interface Props {
    size: number,
    children: React.ReactNode
}

export const GridManagerProvider: React.FC<Props> = ({ size, children }) => {
    const [grid, setGrid] = useState<Letter[][]>([]);
    const [validWordsSet, setValidWords] = useState<Set<string>>(new Set([]));
    const [maxLetters, setMaxLetters] = useState(DEFAULT_MAX_LETTERS);
    const selectedLetters = useRef<Letter[]>([]);
    const getWordsMemo = useRef(() => { });
    useEffect(() => {

        setGrid(getRandomGrid(size));
        const words = wordlist.split("\n").map(l => l.replace(/[\r]/g, "").toLowerCase());

        setValidWords(new Set(words));
    }, []);
    const val = {
        grid,
        selectedLetters,
        size,
        validWordsSet,
        maxLetters,
        setMaxLetters,
        shuffle() {
            setGrid(getRandomGrid(size));
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
        getGridAsString: () => grid.flat().map(m => m.key).join(""),
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
        getAllCombinations(row: number, col: number, visited: boolean[][], combination: Letter[], allCombinations: Letter[][], desired: number) {
            if (row < 0 || row >= size || col < 0 || col >= size || visited[row][col]) {
                return;
            }

            visited[row][col] = true;

            // add the letter at this cell to the combination
            combination.push(grid[row][col]);
            // if the combination is of the desired length, add it to the allCombinations list
            if (combination.length === desired) {
                allCombinations.push([...combination]);
            } else {
                for (const [dx, dy] of Object.values(directions)) {
                    this.getAllCombinations(row + dx, col + dy, visited, combination, allCombinations, desired);
                }
            }


            combination.pop();
            visited[row][col] = false;
        },

        getCombinations(n = 4) {
            const allCombinations: Letter[][] = [];
            const combination: Letter[] = [];
            const visited = Array(size).fill(false).map(() => Array(size).fill(false));

            // start the recursive process from each cell in the grid
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    this.getAllCombinations(row, col, visited, combination, allCombinations, n);
                }
            }

            return allCombinations.filter(m => validWordsSet.has(m.map(s => s.key).join("").toLowerCase()));
        },


        getWords(arr: Letter[][]) {
            return arr.map(l => l.map(s => s)).map(l => l.join("").toLowerCase()).filter(m => this.validWordsSet.has(m));
        },


    };
    val.getWords = memoize(val.getWords);
    return <GridManagerContext.Provider value={val}>
        {children}
    </GridManagerContext.Provider>;


};
