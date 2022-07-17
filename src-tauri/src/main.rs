use tauri::Manager;
use tauri_plugin_store::PluginBuilder;
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

#[tauri::command]
fn launch_file(path: String) {
  opener::open(path).expect("Failed to launch file");
}

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let win = app.get_window("main").unwrap();

      #[cfg(target_os = "macos")]
      apply_vibrancy(&win, NSVisualEffectMaterial::AppearanceBased)
        .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

      #[cfg(target_os = "windows")]
      apply_blur(&win, Some((2, 2, 2, 180)))
        .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![launch_file])
    .plugin(PluginBuilder::default().build())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
