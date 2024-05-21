import { readFileSync, writeFileSync } from 'fs';
import { WasmBoy } from "wasmboy";

export const saveState = async (args) => {
    await WasmBoy.play();
    await WasmBoy.pause();
    const state = await WasmBoy.saveState();
    let nwIS = Array.from(state.wasmboyMemory.wasmBoyInternalState || []);
    state.wasmboyMemory.wasmBoyInternalState = nwIS;
    let nwPM = Array.from(state.wasmboyMemory.wasmBoyPaletteMemory || []);
    state.wasmboyMemory.wasmBoyPaletteMemory = nwPM;
    let ngBM = Array.from(state.wasmboyMemory.gameBoyMemory || []);
    state.wasmboyMemory.gameBoyMemory = ngBM;
    let ncR = Array.from(state.wasmboyMemory.cartridgeRam || []);
    state.wasmboyMemory.cartridgeRam = ncR;

    writeFileSync(args.save, JSON.stringify(state));
}

export async function loadState(args) {
    try {
        let state = JSON.parse(readFileSync(args.save));

        let nwIS = Uint8Array.from(state.wasmboyMemory.wasmBoyInternalState);
        state.wasmboyMemory.wasmBoyInternalState = nwIS;
        let nwPM = Uint8Array.from(state.wasmboyMemory.wasmBoyPaletteMemory);
        state.wasmboyMemory.wasmBoyPaletteMemory = nwPM;
        let ngBM = Uint8Array.from(state.wasmboyMemory.gameBoyMemory);
        state.wasmboyMemory.gameBoyMemory = ngBM;
        let ncR = Uint8Array.from(state.wasmboyMemory.cartridgeRam);
        state.wasmboyMemory.cartridgeRam = ncR;

        await WasmBoy.loadState(state);
    } catch(e) {
        console.error(e);
    }
}