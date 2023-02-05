import { Grid } from "./components/Grid/Grid";
import { GridManagerProvider } from "./context/GridContext";
function App() {
    return (
        <div className="grid grid-cols-2 place-content-center items-center justify-around h-screen w-screen p-[10rem]">
            <GridManagerProvider size={5}>
                <Grid />
            </GridManagerProvider>
        </div>
    );
}

export default App;
