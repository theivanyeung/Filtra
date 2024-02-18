const {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  shell,
  desktopCapturer,
} = require("electron");
const path = require("path");

let win;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const size = 500;

  win = new BrowserWindow({
    width: Math.round(size),
    height: Math.round(size),
    icon: path.join(__dirname, "/build/icon.ico"),
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, "electron_modules/preload.js"),
    },
  });

  win.setPosition(width / 2 - size / 2, height / 2 - size / 2);

  // Dev Window

  // win.webContents.openDevTools();

  win.loadURL("http://localhost:3000/");
}

app.disableHardwareAcceleration();

app.enableSandbox();

app.on("ready", createWindow);

{
  /**
   * DEVICE CONNECTION MODULE
   */
}

// let cachedProcesses = null;
// let cachedActiveWindow = null;

// processWindows.getProcesses((err, processes) => {
//   if (err) {
//     console.error("Error", err);
//     return;
//   }
//   cachedProcesses = processes;
// });

// processWindows.getActiveWindow((err, processInfo) => {
//   if (err) {
//     console.error("Error", err);
//     return;
//   }
//   cachedActiveWindow = processInfo;
// });

// ipcMain.on("request-processes", (event) => {
//   event.reply("provide-processes", cachedProcesses);
// });

// ipcMain.on("request-active-window", (event) => {
//   event.reply("provide-active-window", cachedActiveWindow);
// });
