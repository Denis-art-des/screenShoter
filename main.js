const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('node:path')
const electron = require("electron");
const fs = require("fs")

async function createScreenshots() {
    const mainWindow = new BrowserWindow({ show: false });

    const { screen } = electron;
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.size;
    const primaryScreenId = primaryDisplay.id;
    const captureOptions = {
        width: width,
        height: height,
    };

    const maxScreenshots = 2; // количество скринов

    for (let counter = 1; counter <= maxScreenshots; counter++) {
        try {
            const sources = await electron.desktopCapturer.getSources({
                types: ['screen'],
                thumbnailSize: captureOptions,
            });

            for (let source of sources) {
                if (source.display_id === `${primaryScreenId}`) {
                    const filePath = path.join(app.getAppPath(), 'pictures', `screenshot${counter}.png`);
                    const base64Data = await source.thumbnail.toPNG();
                    await fs.promises.writeFile(filePath, base64Data, { encoding: 'base64' });
                    break;
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
    app.quit();
}

app.whenReady().then(createScreenshots);

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        createScreenshots();
    }
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
