import { useContext, useEffect, useState } from "react";

import { GridManagerContext } from "../../context/GridContext";
interface Props {
    onNewBoard: () => void,
}
export const Results: React.FC<Props> = ({ onNewBoard }) => {
    const [results, setResults] = useState<string[][]>([]);
    const [tab, setTab] = useState(-1);
    const GridManager = useContext(GridManagerContext);
    useEffect(() => {
        async function doIt() {
            const res = [];
            for (let i = 1; i < GridManager.maxLetters + 1; ++i) {

                console.time("hi" + i);
                res.push(GridManager.getWords(i));
                console.timeEnd("hi" + i);
            }

            setResults(res);
            setTab(0);
        }
        doIt();
    }, []);
    return (
        <div className="input-wrapper w-full h-full flex flex-col justify-between items-start pt-[7.75rem] px-8">
            <div className="hey w-full">
                <div className="res">
                    {tab === -1 ? <div>Loading</div> : results.map(words => {
                        return words.map((word, i) => <div key={i}>{word}</div>);
                    })}
                </div>
            </div>

            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md" onClick={onNewBoard}>New Board</button>
        </div>
    );
};
