use waifu_pics_api::{get_image_url, get_image_urls, Type};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn get_waifu_image_url(config: String) -> String {
    let image_url = get_image_url(&serde_json::from_str::<Type>(&config).unwrap()).await;

    if let Ok(url) = image_url {
        url
    } else {
        String::new()
    }
}

#[tauri::command]
async fn get_waifu_image_urls(config: String, excluded: Vec<String>) -> Vec<String> {
    let image_urls = get_image_urls(
        &serde_json::from_str::<Type>(&config).unwrap(),
        excluded,
    ).await;

    if let Ok(urls) = image_urls {
        urls
    } else {
        vec![]
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, get_waifu_image_url, get_waifu_image_urls])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
