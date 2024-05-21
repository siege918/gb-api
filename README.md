# gb-api
## A gameboy emulator as a web service

```
usage: npm run start -- -- [-h] [-r ROM] [-s SAVE] [-ns] [-nl] [-si SAVEINTERVAL] [-fr FIRSTRUN] [-er EVERYRUN] [-p PORT]

A web application that runs a Gameboy game based on API commands.

optional arguments:
  -h, --help            show this help message and exit
  -r ROM, --rom-path ROM
                        The path to the rom to boot
  -s SAVE, --save-path SAVE
                        The path to create the save state at
  -ns, --no-saving      Disable saving
  -nl, --no-loading     Disable loading save state on startup
  -si SAVEINTERVAL, --save-interval SAVEINTERVAL
                        How often to save the emulator state. Will save every N commands received
  -fr FIRSTRUN, --first-run FIRSTRUN
                        Path to a JSON file that specifies commands to run the first time the emulator is loaded. Does not run if a save state is loaded.
  -er EVERYRUN, --every-run EVERYRUN
                        Path to a JSON file that specifies commands to run each time the emulator is loaded. Runs even if a save state is loaded.
  -p PORT, --port PORT  The port to listen on
```

### Quickstart guide

1. Create a folder named `in`
2. Put a Gameboy ROM in the `in` folder, name it `rom.gb`
3. (Optional) Copy the `firstRun.json` from the examples folder to the `in` folder, and modify it with the inputs needed to get the ROM into gameplay
4. `npm install`
5. `npm run start`

This will host the service on port `8888`. You can then send a POST request to `https://localhost:8888/tick` with a body that specifies what input you'd like to press and how many frames to wait after pressing the key.

Here's an example payload:

```
{
  "keys": ["A"],
  "frames": 480
}
```

This will press the A button, wait 480 frames, and then return an image of what the screen looks like. The Gameboy runs at 120 frames per second (I think!), so this would run approximately 4 seconds of gameplay.

You can also press multiple keys at once:

```
{
  "keys": ["A", "UP"],
  "frames": 480
}
```

Available buttons: A, B, Start, Select, Up, Down, Left, Right

The app will also save states after every command, ensuring that state is kept between shutdowns

### Why would you do this?

I got an e-ink display to tinker with, and I wanted to make a wall clock that puts a random input into a game every minute when it updates.

As of this commit, I haven't gotten the e-ink display in yet! But this will be an important part of getting this working.

What can you use this for? I don't know! Good luck!

### Acknowledgements

This wouldn't be possible without the wonderful project [WasmBoy](https://github.com/torch2424/wasmboy), which is used in this project.