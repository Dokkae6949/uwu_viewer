use waifu_pics_api::{Error, get_image_url, get_image_urls, Type};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn get_waifu_image_url(config: &Type) -> Result<String, Error> {
    Ok(get_image_url(config).await?)
}

#[tauri::command]
async fn get_waifu_image_urls(config: &Type, excluded_urls: Vec<String>) -> Result<Vec<String>, Error> {
    Ok(get_image_urls(config, excluded_urls).await?)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, get_image_url, get_image_urls])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
