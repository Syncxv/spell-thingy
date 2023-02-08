import { Letter } from "../types";
import { directions } from "../utils/constants";
import { getRandomGrid } from "../utils/getRandomGrid";
import { getValue } from "../utils/getValue";
import { uuidv4 } from "../utils/uuidv4";
import { calculateRotation, getMagnitude, normalizeVector, subtractVectors } from "../utils/vectorSheet";
import { IGridManagerContext } from "./GridContext";

export class GridManager {
    grid: Letter[][];
    setGrid: React.Dispatch<React.SetStateAction<Letter[][]>>;
    selectedLetters: React.MutableRefObject<Letter[]>;
    size: number;
    maxLetters: number;
    setMaxLetters: React.Dispatch<React.SetStateAction<number>>;
    validWordsSet: Set<string>;


    constructor({ grid, maxLetters, selectedLetters, setMaxLetters, size, validWordsSet, setGrid }: Omit<IGridManagerContext, "GridManager">) {
        this.grid = grid;
        this.setGrid = setGrid;
        this.size = size;
        this.maxLetters = maxLetters;
        this.selectedLetters = selectedLetters;
        this.setMaxLetters = setMaxLetters;
        this.validWordsSet = validWordsSet;

    }

    shuffle() {
        this.setGrid(getRandomGrid(this.size));
    }

    setNewGrid(str: string) {
        const array2d: Letter[][] = [];
        for (let row = 0; row < 5; row++) {
            array2d[row] = [];
            for (let col = 0; col < 5; col++) {
                array2d[row][col] = { id: uuidv4(), key: str[row * 5 + col], value: getValue(str[row * 5 + col]), row, column: col };
            }
        }


        this.setGrid(array2d);
    }

    move(direction: keyof typeof directions, from: Letter, distance = 1) {
        this.checkIfIsStart(from);
        const [dx, dy] = directions[direction];
        for (let i = 0; i < distance; ++i) {
            let x2 = from.row + dx;
            let y2 = from.column + dy;

            dx === 0 ? null : dx < 0 ? x2 -= i : x2 += i;
            dy === 0 ? null : dy < 0 ? y2 -= i : y2 += i;
            if (x2 >= 0 && x2 < this.grid.length && y2 >= 0 && y2 < this.grid[0].length)
                this.pushToSelectedLetters(this.grid[x2][y2]);
        }
    }
    moveFrom(from: Letter, to: Letter) {
        this.pushToSelectedLetters(from);
        this.pushToSelectedLetters(to);
    }
    checkIfIsStart(letter: Letter) {
        if (this.selectedLetters.current.length === 0) {
            this.selectedLetters.current.push(letter);
            letter.ref?.classList.add("selected");
        }
    }
    pushToSelectedLetters(letter: Letter) {
        if (this.selectedLetters.current.length > 0 && !this.isAdjecent(letter, this.selectedLetters.current[this.selectedLetters.current.length - 1])) {
            console.log("is not adjacent so removing all selected layers ong");
            this.grid.flat().forEach(m => m.ref?.classList.remove("selected"));
            this.selectedLetters.current = ([]);
        }
        for (var selectionType = -1, o = 0; o < this.selectedLetters.current.length; o++)
            if (this.selectedLetters.current[o].id === letter.id) {
                selectionType = o;
                break;
            }
        console.log(selectionType);
        // -1 means select letter XD
        if (selectionType === -1) {
            letter.ref?.classList.add("selected");
            this.selectedLetters.current.length > 0 && this.connectLetters(this.selectedLetters.current[this.selectedLetters.current.length - 1], letter, "red");
            this.selectedLetters.current.push(letter);
        }
        // deselect layer XD
        else if (selectionType === this.selectedLetters.current.length - 2) {
            console.log("deselecting latter", letter);
            var letterToDeSelect = this.selectedLetters.current[this.selectedLetters.current.length - 1];
            this.selectedLetters.current.pop();
            letterToDeSelect?.ref?.classList.remove("selected");
        }
    }

    isAdjecent(a: Letter, b: Letter) {
        return Math.abs(a.column - b.column) <= 1 && Math.abs(a.row - b.row) <= 1;
    }

    connectLetters(startLetter: Letter, endLetter: Letter, linkColor: string) {

        const startLetterPosition = { x: startLetter.ref!.offsetLeft + startLetter.ref!.offsetWidth / 2, y: startLetter.ref!.offsetTop + startLetter.ref!.offsetHeight / 2 };
        const endLetterPosition = { x: endLetter.ref!.offsetLeft + endLetter.ref!.offsetWidth / 2, y: endLetter.ref!.offsetTop + endLetter.ref!.offsetHeight / 2 };

        const directionVector = subtractVectors(startLetterPosition, endLetterPosition);
        const unitDirectionVector = normalizeVector(directionVector);
        const rotation = calculateRotation(unitDirectionVector);

        const linkDiv = document.createElement("div");
        linkDiv.style.position = "absolute";
        linkDiv.style.width = `${getMagnitude(startLetterPosition, endLetterPosition)}px`;
        linkDiv.style.height = "2px";
        linkDiv.style.transformOrigin = "0% 50%";
        linkDiv.style.transform = `rotate(${rotation}rad)`;
        linkDiv.style.left = `${startLetterPosition.x}px`;
        linkDiv.style.top = `${startLetterPosition.y}px`;
        linkDiv.style.background = linkColor;
        linkDiv.style.zIndex = "-2";
        linkDiv.id = "bruh-link";
        document.body.appendChild(linkDiv);
    }

    getGridAsString() {
        return this.grid.flat().map(m => m.key).join("");
    }
    getCurrentWordString() {
        return this.selectedLetters.current.map(l => l.key).join("");
    }
    resetSelectedWords() {
        this.selectedLetters.current = [];
        this.grid.flat().forEach(m => m?.ref?.classList.remove("selected"));
        Array.from(document.querySelectorAll("#bruh-link")).forEach(el => el.remove());
    }
    getNeighbours(letter: Letter) {
        const neighbors: Letter[] = [];
        // for (const [dx, dy] of Object.values(directions)) {
        //     const x2 = letter.row + dx;
        //     const y2 = letter.column + dy;

        //     if (x2 >= 0 && x2 < grid.length && y2 >= 0 && y2 < grid[0].length) {
        //         neighbors.push(grid[x2][y2]);
        //     }

        // }
        return neighbors;
    }
    getAllCombinations(row: number, col: number, visited: boolean[][], combination: Letter[], allCombinations: Letter[][], desired: number) {
        if (row < 0 || row >= this.size || col < 0 || col >= this.size || visited[row][col]) {
            return;
        }

        visited[row][col] = true;

        // add the letter at this cell to the combination
        combination.push(this.grid[row][col]);
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
    }

    getCombinations(n = 4) {
        const allCombinations: Letter[][] = [];
        const combination: Letter[] = [];
        const visited = Array(this.size).fill(false).map(() => Array(this.size).fill(false));

        // start the recursive process from each cell in the grid
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                this.getAllCombinations(row, col, visited, combination, allCombinations, n);
            }
        }

        return allCombinations.filter(m => this.validWordsSet.has(m.map(s => s.key).join("").toLowerCase()));
    }


    getWords(arr: Letter[][]) {
        return arr.map(l => l.map(s => s)).map(l => l.join("").toLowerCase()).filter(m => this.validWordsSet.has(m));
    }
}
