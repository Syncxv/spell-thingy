import { MouseEvent, useRef, useState } from "react";

import { useInitGrid } from "../../hooks/useInitGrid";
import { getLetterByRowCol } from "../../utils/getLetterByRowCol";

export const SIZE = 5;

export const Grid: React.FC<{}> = () => {
    const GridManager = useInitGrid(SIZE);
    const [currentWord, setCurrentWord] = useState<string>("");
    (window as any).GridManager = GridManager;
    const isMouseDownRef = useRef(false);

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        isMouseDownRef.current = true;
        handleMouseOver(e);
        // this is probably bad but eh
        const target = e.target as HTMLDivElement;
        target.classList.add("selected");
    };

    const handleMouseUp = (e: MouseEvent) => {
        isMouseDownRef.current = false;
        console.log(GridManager.getCurrentWordString());

        GridManager.selectedLetters.current = [];
        GridManager.grid.flat().forEach(l => l.ref?.classList?.remove("selected"));
    };

    const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
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
            <h1 className="text-green-500 text-5xl mb-8">{currentWord || "hi"}</h1>
            <div
                style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
                className="grid-wrapper grid gap-8 w-[80vw] h-[80vh]"
            >
                {GridManager.grid.flat().map((letter, i) => (
                    <div
                        key={`${letter.row},${letter.column}`}
                        ref={e => letter.ref = e}
                        className="flex items-center justify-center text-center text-3xl bg-slate-200 p-8 text-slate-900 rounded-md select-none"
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseOver={e => handleMouseOver(e)}
                        data-letter={`${letter.row},${letter.column}`}
                    >
                        {letter.key}
                    </div>
                ))}
            </div>
        </>
    );
};
