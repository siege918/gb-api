import { writeFileSync, copyFileSync, stat, existsSync, mkdirSync } from "fs";
import { PNG } from "pngjs";
import express from 'express';

import { ArgumentParser } from 'argparse';

import init from './init.js';
import runCommand from "./runCommand.js";
import getImageDataFromFrame from "./getImageDataFromFrame.js";
import { saveState } from "./state.js";

const parser = new ArgumentParser({
  prog: 'npm run start -- --',
  description: 'A web application that runs a Gameboy game based on API commands.',
});

parser.add_argument('-r', '--rom-path', {
  help: 'The path to the rom to boot',
  default: 'in/rom.gb',
  dest: 'rom',
  type: 'str'
});

parser.add_argument('-s', '--save-path', {
  help: 'The path to create the save state at',
  default: 'out/save.json',
  dest: 'save',
  type: 'str'
});

parser.add_argument('-ns', '--no-saving', {
  help: 'Disable saving',
  dest: 'isSavingDisabled',
  action: 'store_true'
});

parser.add_argument('-nl', '--no-loading', {
  help: 'Disable loading save state on startup',
  dest: 'isLoadingDisabled',
  action: 'store_true'
});

parser.add_argument('-si', '--save-interval', {
  help: 'How often to save the emulator state. Will save every N commands received',
  default: 1,
  dest: 'saveInterval',
  type: 'int'
});

parser.add_argument('-fr', '--first-run', {
  help: 'Path to a JSON file that specifies commands to run the first time the emulator is loaded. Does not run if a save state is loaded.',
  default: 'in/firstRun.json',
  dest: 'firstRun',
  type: 'str'
});

parser.add_argument('-er', '--every-run', {
  help: 'Path to a JSON file that specifies commands to run each time the emulator is loaded. Runs even if a save state is loaded.',
  default: 'in/everyRun.json',
  dest: 'everyRun',
  type: 'str'
});

parser.add_argument('-p', '--port', {
  help: 'The port to listen on',
  dest: 'port',
  default: 8888,
  type: 'int'
});

const args = parser.parse_args();

let requestCount = 0;

if (!existsSync('out')) {
  mkdirSync('out');
}

await init(args);

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {

  const imageData = await getImageDataFromFrame();

  //write to PNG (using pngjs)
  var png = new PNG({ width: 160, height: 144 });
  png.data = imageData;

  var buffer = PNG.sync.write(png, { colorType: 0 });

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': buffer.length
  });
  res.end(buffer);
});

app.post('/tick', async (req, res) => {
  requestCount++;
  const { frames, keys } = req.body;

  await runCommand({
    note: 'Running a command',
    keys,
    frames
  });

  const imageData = await getImageDataFromFrame();

  //write to PNG (using pngjs)
  var png = new PNG({ width: 160, height: 144 });
  png.data = imageData;

  var buffer = PNG.sync.write(png, { colorType: 0 });

  backupSave();

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': buffer.length
  });
  res.end(buffer);
})

app.listen(args.port, () => {
  console.log(`listening on port ${args.port}`);
});

const backupSave = async () => {
  if (requestCount % args.saveInterval === 0 && !args.isSavingDisabled) {
    if (existsSync(args.save)) {
      copyFileSync(args.save, args.save + '.bak');
    }
    saveState(args);
  }
}
