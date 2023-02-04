import { MouseEvent, useRef } from "react";

import { useInitGrid } from "../../hooks/useInitGrid";
import { Letter } from "../../types";
import { getLetterByRowCol } from "../../utils/getLetterByRowCol";

export const SIZE = 5;

export const Grid: React.FC<{}> = () => {
    const grid = useInitGrid(SIZE);
    const isMouseDownRef = useRef(false);
    const selectedLetters = useRef<Letter[]>([]);

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        isMouseDownRef.current = true;
        handleMouseOver(e);
        // this is probably bad but eh
        const target = e.target as HTMLDivElement;
        target.classList.add("selected");
    };

    const handleMouseUp = (e: MouseEvent) => {
        isMouseDownRef.current = false;


        const word = selectedLetters.current.map(l => l.key).join("");
        console.log(word);

        selectedLetters.current = [];
        grid.flat().forEach(l => l.ref?.classList?.remove("selected"));
    };

    const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
        if (!isMouseDownRef.current) return;
        const target = e.target as HTMLDivElement;
        const letterKeys = target.dataset.letter;
        if (!letterKeys) return;

        const [row, col] = letterKeys.split(",");
        const letter = getLetterByRowCol(grid, parseInt(row), parseInt(col));

        console.log(letter);
        if (letter) {
            if (letter.ref && letter.ref.classList.contains("selected")) {
                const currentLetterIndex = selectedLetters.current.findIndex(e => e === letter);
                selectedLetters.current.splice(currentLetterIndex - 1, 2);
                selectedLetters.current[currentLetterIndex - 1]?.ref?.classList.remove("selected");
                letter.ref.classList.remove("selected");
            } else {

                letter.ref?.classList.add("selected");
                selectedLetters.current.push(letter);
            }
        }
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
