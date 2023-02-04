import { Letter } from "../types";
export const getLetterByRowCol = (grid: Letter[][], row: number, col: number) =>
    grid.flat().find(l => l.row === row && l.column === col);
