import { useContext, useEffect, useState } from "react";

import { GridManagerContext } from "../../context/GridContext";
import { Letter } from "../../types";
interface Props {
    onNewBoard: () => void,
}
export const Results: React.FC<Props> = ({ onNewBoard }) => {
    const [results, setResults] = useState<Letter[][][]>([]);
    const [tab, setTab] = useState(-1);
    const GridManager = useContext(GridManagerContext);
    useEffect(() => {
        async function doIt() {
            const res = [];
            for (let i = 1; i < GridManager.maxLetters + 1; ++i) {

                console.time("hi" + i);
                res.push(GridManager.getCombinations(i));
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
                <div className="res flex flex-col">
                    <div className="tabs flex flex-wrap">
                        {tab === -1 ? <div>Loading</div> : results.map((words, i) =>
                            <div key={i} className="">
                                <button onClick={() => setTab(i)} className={"bg-slate-300 hover:bg-slate-400 text-gray-900 font-medium py-2 px-4"}>
                                    {i + 1} Letter{i >= 1 ? "s" : ""}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="word-wrapper flex gap-4 flex-wrap overflow-auto py-4 max-h-[30rem]">
                        {results.length && results[tab].length ? results[tab].map((word, i) => <div key={i} className="p-2 bg-gray-200 text-gray-900 rounded-md">{word.map(m => m.key).join("")}</div>) : <p>No words eh</p>}
                    </div>
                </div>
            </div>

            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md" onClick={onNewBoard}>New Board</button>
        </div>
    );
};

