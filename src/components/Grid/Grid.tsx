import { MouseEvent, useRef } from "react";

import { useInitGrid } from "../../hooks/useInitGrid";
import { getLetterByRowCol } from "../../utils/getLetterByRowCol";

export const SIZE = 5;

export const Grid: React.FC<{}> = () => {
    const grid = useInitGrid(SIZE);
    const isMouseDownRef = useRef(false);

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        isMouseDownRef.current = true;
        handleMouseOver(e);
    };

    const handleMouseUp = () => {
        isMouseDownRef.current = false;
    };

    const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
        if (!isMouseDownRef.current) return;
        const target = e.target as HTMLDivElement;
        const letterKeys = target.dataset.letter;
        if (!letterKeys) return;

        const [row, col] = letterKeys.split(",");
        const letter = getLetterByRowCol(grid, parseInt(row), parseInt(col));

        console.log(letter);
    };
    return (
        <>
            <div
                style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
                className="grid-wrapper grid gap-4 w-[80vw] h-[80vh]"
            >
                {grid.flat().map((letter, i) => (
                    <div
                        key={`${letter.row},${letter.column}`}
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
