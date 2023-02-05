import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import wasmPack from "vite-plugin-wasm-pack";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), wasmPack(["./rust"])],
});
