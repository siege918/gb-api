import { WasmBoy } from "wasmboy";

export default async function setJoypadState(state) {
    WasmBoy._runWasmExport('setJoypadState', [
        state.up ? 1 : 0,
        state.right ? 1 : 0,
        state.down ? 1 : 0,
        state.left ? 1 : 0,
        state.a ? 1 : 0,
        state.b ? 1 : 0,
        state.select ? 1 : 0,
        state.start ? 1 : 0,
    ]);
}