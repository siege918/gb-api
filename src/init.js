import { readFileSync, existsSync } from "fs";
import { WasmBoy } from 'wasmboy'
import runCommand from "./runCommand.js";
import { loadState } from "./state.js";

export default async function InitializeGameboy(args) {
  await WasmBoy.config({
    headless: true,
    useGbcWhenOptional: false,
    isAudioEnabled: false,
  });

  let saveData;

  var rom = readFileSync(args.rom);

  await WasmBoy.loadROM(Uint8Array.from(rom));

  console.log('Loaded ROM.');

  console.log(args);

  if (!args.isLoadingDisabled && existsSync(args.save)) {
    saveData = JSON.parse(readFileSync(args.save).toString());
  }

  if (saveData) {
    await loadState(args);
  }

  console.log('Loaded save file.');

  await WasmBoy.play();
  await WasmBoy.pause();

  console.log('Starting the game');

  if (!saveData && args.firstRun) {
    if (existsSync(args.firstRun)) {
      const firstRun = readFileSync(args.firstRun);
      const firstRunSteps = JSON.parse(firstRun);

      for (let i = 0; i < firstRunSteps.length; i++) {
        await runCommand(firstRunSteps[i]);
      }
    }
  }

  console.log('');

  if (args.everyRun) {
    if (existsSync(args.everyRun)) {
      const everyRun = readFileSync(args.everyRun);
      const everyRunSteps = JSON.parse(everyRun);

      for (let i = 0; i < everyRunSteps.length; i++) {
        await runCommand(everyRunSteps[i]);
      }
    }
  }

  console.log('');
}
