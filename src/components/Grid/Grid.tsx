import { MouseEvent, useContext, useEffect, useRef, useState } from "react";

import { GridManagerContext } from "../../context/GridContext";
import { getLetterByRowCol } from "../../utils/getLetterByRowCol";
import { SideThing } from "../SideThing/SideThing";

export const SIZE = 5;

export const Grid: React.FC<{}> = () => {
    const { GridManager } = useContext(GridManagerContext);
    const [currentWord, setCurrentWord] = useState<string>("");
    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);
    }, []);
    (window as any).GridManager = GridManager;
    const isMouseDownRef = useRef(false);

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        isMouseDownRef.current = true;
        handleMouseOver(e);
        // this is probably bad but eh
        const target = e.target as HTMLDivElement;
        target.classList.add("selected");
    };

    const handleMouseUp = () => {
        isMouseDownRef.current = false;
        console.log(GridManager.getCurrentWordString());
        GridManager.resetSelectedWords();
    };

    const handleMouseOver = (e: MouseEvent) => {
        if (!isMouseDownRef.current) return;
        const target = e.target as HTMLDivElement;
        const letterKeys = target.dataset.letter;
        if (!letterKeys) return;

        const [row, col] = letterKeys.split(",");
        const letter = getLetterByRowCol(GridManager.grid, parseInt(row), parseInt(col));

        if (letter) {
            GridManager.pushToSelectedLetters(letter);
            setCurrentWord(GridManager.getCurrentWordString());
        }
    };
    return (
        <>
            <div className="grid-wrapper p-11 pb-0 flex flex-col items-center justify-center">
                <h1 className="text-green-500 text-5xl mb-8">{currentWord || "hi"}</h1>
                <div
                    style={{ gridTemplateColumns: `repeat(${SIZE}, auto)` }}
                    className="grid gap-4 w-full"
                >
                    {GridManager.grid.flat().map((letter, i) => (
                        <div
                            key={`${letter.row},${letter.column}`}
                            ref={e => letter.ref = e}
                            className="flex items-center justify-center text-center text-3xl bg-slate-200 h-full w-full aspect-square text-slate-900 rounded-md select-none"
                            onMouseDown={handleMouseDown}
                            onMouseOver={e => handleMouseOver(e)}
                            data-letter={`${letter.row},${letter.column}`}
                        >
                            {letter.key}
                        </div>
                    ))}
                </div>
            </div>
            {GridManager.grid.length && <SideThing />}
        </>
    );
};
