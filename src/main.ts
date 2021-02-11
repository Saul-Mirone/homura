// organize-imports-ignore
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { app, BrowserWindow, shell } from 'electron';
import { ChannelMain } from './channel/main';
import { MenuBuilder } from './menu';
import { Model } from './model';

if (require('electron-squirrel-startup')) app.quit();

if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();
}

const installExtensions = async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

    return Promise.all(extensions.map((name) => installer.default(installer[name], forceDownload)));
};

const createWindow = async () => {
    if (process.env.NODE_ENV === 'development') {
        await installExtensions();
    }

    const connectWithDB = () => {
        const db = new Model();
        const rssParser = new ChannelMain(db);
        rssParser.listen();
    };
    connectWithDB();

    const mainWindow = new BrowserWindow({
        show: false,
        width: 1024,
        height: 728,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.webContents.on('will-navigate', (e, url) => {
        if (url !== mainWindow?.webContents.getURL()) {
            e.preventDefault();
            shell.openExternal(url);
        }
    });

    mainWindow.webContents.on('new-window', (e, url) => {
        if (url !== mainWindow?.webContents.getURL()) {
            e.preventDefault();
            shell.openExternal(url);
        }
    });

    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
