import { WasmBoy } from 'wasmboy';

export default async function getMemoryRange(start, end) {
    const WORK_RAM_LOCATION = await WasmBoy._getWasmConstant(
        'WORK_RAM_LOCATION',
      );

    const data = await WasmBoy._getWasmMemorySection(WORK_RAM_LOCATION + start - 0xC000, WORK_RAM_LOCATION + 1 + end - 0xC000);
    return Array.from(data);
}