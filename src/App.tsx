import { appWindow } from '@tauri-apps/api/window'

function App() {

  return (
    <div className="App">
      <div data-tauri-drag-region className="titlebar">
        <div onClick={() => appWindow.minimize()} className="titlebar-button" id="titlebar-minimize">
          <img src="https://api.iconify.design/mdi:window-minimize.svg" alt="minimize" />
        </div>
        <div onClick={() => appWindow.toggleMaximize()} className="titlebar-button" id="titlebar-maximize">
          <img src="https://api.iconify.design/mdi:window-maximize.svg" alt="maximize" />
        </div>
        <div onClick={() => appWindow.close()} className="titlebar-button" id="titlebar-close">
          <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
        </div>
      </div>
    </div>
  );
}

export default App;
