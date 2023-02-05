import { Grid } from "./components/Grid/Grid";
function App() {
    return (
        <div className="grid grid-cols-2 place-content-center items-center justify-around h-screen w-screen p-8">
            <Grid />
        </div>
    );
}

export default App;
