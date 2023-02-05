import { useState } from "react";

import { initalValues, Options } from "../Options/Options";
import { Results } from "../Results/Results";
interface Props {

}
export const SideThing: React.FC<Props> = () => {
    const [hasSubmited, setSubmited] = useState(false);
    const onSubmit = (e: initalValues) => {
        console.log("hi", e);
    };
    return hasSubmited ? <Results /> : <Options onSubmit={onSubmit} />;
};
