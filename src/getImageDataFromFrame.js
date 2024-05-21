//Source: https://gist.github.com/alex-red/1221a55e79eeea9762695d0639c7493b

import { WasmBoy } from 'wasmboy';

const GAMEBOY_CAMERA_WIDTH = 160;
const GAMEBOY_CAMERA_HEIGHT = 144;

const getImageDataFromFrame = async () => {
    // Get our output frame
    const frameInProgressVideoOutputLocation = await WasmBoy._getWasmConstant(
      'FRAME_LOCATION',
    );
    const frameInProgressMemory = await WasmBoy._getWasmMemorySection(
      frameInProgressVideoOutputLocation,
      frameInProgressVideoOutputLocation +
        GAMEBOY_CAMERA_HEIGHT * GAMEBOY_CAMERA_WIDTH * 3 +
        1,
    );
  
    // Going to compare pixel values from the VRAM to confirm tests
    const imageDataArray = [];
    const rgbColor = [];
  
    for (let y = 0; y < GAMEBOY_CAMERA_HEIGHT; y++) {
      for (let x = 0; x < GAMEBOY_CAMERA_WIDTH; x++) {
        // Each color has an R G B component
        const pixelStart = (y * GAMEBOY_CAMERA_WIDTH + x) * 3;
  
        for (let color = 0; color < 3; color++) {
          rgbColor[color] = frameInProgressMemory[pixelStart + color];
        }
  
        // Doing graphics using second answer on:
        // https://stackoverflow.com/questions/4899799/whats-the-best-way-to-set-a-single-pixel-in-an-html5-canvas
        // Image Data mapping
        const imageDataIndex = (x + y * GAMEBOY_CAMERA_WIDTH) * 4;
  
        imageDataArray[imageDataIndex] = rgbColor[0];
        imageDataArray[imageDataIndex + 1] = rgbColor[1];
        imageDataArray[imageDataIndex + 2] = rgbColor[2];
        // Alpha, no transparency
        imageDataArray[imageDataIndex + 3] = 255;
      }
    }
  
    return imageDataArray;
  };

  export default getImageDataFromFrame;