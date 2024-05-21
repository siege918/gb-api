import KEYMAP from "./keymap.js";
import setJoypadState from "./setJoypadState.js";

import { WasmBoy } from 'wasmboy';

export default async function runCommand(command) {
    if (command.note) {
        console.log('');
        process.stdout.write(command.note);
    }

    [].reduce((acc, val) => {
        acc
    }, {})

    const keyConfig = (command.keys || [])
        .filter(key => Object.keys(KEYMAP).includes(key))
        .reduce((acc, val) => {
            return {
                ...acc,
                [val.toLowerCase()]: true
            };
        }, {});

    await setJoypadState(keyConfig);

    
    for (var j = 0; j < command.frames; j++) {
        if (j % 10 === 0) {
          process.stdout.write('.');
        }
        await WasmBoy._runWasmExport('hasCoreStarted', []);
        await WasmBoy._runWasmExport('executeFrame', []);
        await setJoypadState({});
    }
}