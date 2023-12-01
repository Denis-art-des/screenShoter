const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('node:path')
const electron = require("electron");
const fs = require("fs")

//  здесь происхоит всё что нужно для создания скрина
function createWindow() {
    // здесь создаёться окно программы
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // тут мы обьявляем переменные необходимые для программы
    let {screen} = electron; // переменная содержит елемент екрана
    let primaryDisplay = screen.getPrimaryDisplay() // тут мы получаем главный экран устройства
    let {width, height} = primaryDisplay.workAreaSize // параметры для области скриншота
    let primaryScreenId = primaryDisplay.id; // это необходимо немного далее
    const captureOptions = {
        width: width,
        height: height,
    };
    // в строке ниже происходит сам скриншот , мы получаем информацию о текущем состоянии екрана и записываем его в переменную sources
    // важно , это операция всегда должна выполнятся ассинхронно.
    // Так как в ином случае source просто не заполниться из-за невозможности зделать это пока работает основной процесс
    electron.desktopCapturer.getSources({types: ["screen"], thumbnailSize: captureOptions}).then(async sources => {
        for (let source of sources) { // тут мы проходимся по содержимому sources
            if (source.display_id === `${primaryScreenId}`) { // и в случае совпадения ID елемента и главного екрана мы производим запись в файл
                let filePath = path.join(app.getAppPath(), "\\pictures", `screenshot${""/*тут*/}.png`); // инициализируем путь к папке с фото
                let base64Data = await source.thumbnail.toPNG(); // переводим информацию об изборжаении из массима в формат фото
                console.log(base64Data)
                fs.writeFile(filePath, base64Data, {encoding: 'base64'}, err => {// производим запись в файл.
                    throw err
                })
                // код записи в файл всегда должен иметь callback ообработки ошибки , в противном случае просто не работает
            }
        }
    })
    mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})