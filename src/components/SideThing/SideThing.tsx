import { useState } from "react";

import { Options } from "../Options/Options";
import { Results } from "../Results/Results";
interface Props {

}
export const SideThing: React.FC<Props> = () => {
    const [hasSubmited, setSubmited] = useState(false);
    return hasSubmited ? <Results /> : <Options />;
};
