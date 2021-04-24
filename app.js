const electron = require('electron');
const path = require('path');
const url = require('url');
const childProcess = require('child_process');
const openApp = require('open');

process.env.NODE_ENV = 'production';
let pwnvNE=true;
if(process.env.NODE_ENV=='production') pwnvNE=false;
const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

let predefinedAppsN=['explorer', 'notepad', 'cmd', 'chrome', 'edge', 'firefox', 'opera', 'vlc', 'paint', 'wordpad', 'word', 'powerpoint', 'excel'];

app.on('ready', function(){
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    icon: path.join(__dirname,'v/images/v2.png'),
    title: 'Varnan',
    webPreferences: {
      devTools: pwnvNE,
      preload: path.join(__dirname,'preload.js')
    }
  });
  mainWindow.maximize();
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  })
  mainWindow.loadFile(path.join(__dirname,'v/index.html'));
  mainWindow.on('closed', function(){
    app.quit();
  });

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('data', async function(e, item){
  if(item==''){
    mainWindow.webContents.send('response', 'Empty Value');
  }
  else{
    let jsonitem=JSON.parse(item);
    if(jsonitem.command=='openlink'){
      if (jsonitem.browser=='chrome' && jsonitem.incognito==true) {
        jsonitem.incognito='--incognito';
      }
      else if (jsonitem.browser!='chrome' && jsonitem.incognito==true){
        jsonitem.incognito='--private';
      }
      else{
        jsonitem.incognito='';
      }
      await openApp(jsonitem.link, {app: {name: jsonitem.browser, arguments: [jsonitem.incognito]}});
      mainWindow.webContents.send('response', jsonitem.link);
    }
    else if(jsonitem.command=='openapp'){
      if(jsonitem.app=='word')
        await openApp('winword');
      else if(jsonitem.app=='powerpoint')
        await openApp('powerpnt');
      else if(jsonitem.app=='paint')
        await openApp('mspaint');
      else if(jsonitem.app=='edge')
        await openApp('microsoftedge');
      else
        await openApp(jsonitem.app);
      mainWindow.webContents.send('response', jsonitem.app);
    }
  }
});

const mainMenuTemplate =  [
  {
    role: 'reload'
  },
  {
    label: 'Quit',
    accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
    click(){
      app.quit();
    }
  }
];

if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Inspect',
    accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
    click(item, focusedWindow){
      focusedWindow.toggleDevTools();
    }
  });
}