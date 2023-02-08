import { createContext, useEffect, useRef, useState } from "react";

import wordlist from "../assets/wordlist.txt?raw";
import { Letter } from "../types";
import { DEFAULT_MAX_LETTERS } from "../utils/constants";
import { getRandomGrid } from "../utils/getRandomGrid";
import { GridManager } from "./GridManager";
export interface IGridManagerContext {
    grid: Letter[][];
    setGrid: React.Dispatch<React.SetStateAction<Letter[][]>>
    selectedLetters: React.MutableRefObject<Letter[]>
    size: number;
    maxLetters: number,
    setMaxLetters: React.Dispatch<React.SetStateAction<number>>,
    validWordsSet: Set<string>;
    GridManager: GridManager

}

const initalValues: IGridManagerContext = {
    grid: [],
    setGrid: () => { },
    selectedLetters: null as any,
    size: 5,
    maxLetters: 0,
    setMaxLetters: () => { },
    validWordsSet: new Set(),
    GridManager: null as any
};

export const GridManagerContext = createContext<IGridManagerContext>(initalValues);

export interface Props {
    size: number,
    children: React.ReactNode
}

export const GridManagerProvider: React.FC<Props> = ({ size, children }) => {
    const [grid, setGrid] = useState<Letter[][]>([]);
    const selectedLetters = useRef<Letter[]>([]);
    const [validWordsSet, setValidWords] = useState<Set<string>>(new Set([]));
    const [maxLetters, setMaxLetters] = useState(DEFAULT_MAX_LETTERS);
    useEffect(() => {

        setGrid(getRandomGrid(size));
        const words = wordlist.split("\n").map(l => l.replace(/[\r]/g, "").toLowerCase());

        setValidWords(new Set(words));
    }, []);
    const val = {
        grid,
        setGrid,
        selectedLetters,
        size,
        validWordsSet,
        maxLetters,
        setMaxLetters,
        GridManager: new GridManager({ grid, setGrid, maxLetters, selectedLetters, setMaxLetters, size, validWordsSet })
    };
    return (
        <GridManagerContext.Provider value={val}>
            {children}
        </GridManagerContext.Provider>
    );

};
