// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::blocking::get;
use serde::Deserialize;
use tauri::api::process::Command;

#[derive(Deserialize, Debug)]
struct App {
    version: String,
    image: String,
    digest: String,
}

#[derive(Deserialize, Debug)]
struct Prem {
    daemon: App,
}

#[derive(Deserialize, Debug)]
struct Config {
    prem: Prem,
}

#[tauri::command]
fn run_container() {
    //pull versions.json from GitHub repository prem-box
    let url = "https://raw.githubusercontent.com/premAI-io/prem-box/main/versions.json";
    let response = get(url).expect("Request failed");
    let config: Config = response.json().expect("Failed to parse JSON");

    let image = format!(
        "{}:{}@{}",
        config.prem.daemon.image, config.prem.daemon.version, config.prem.daemon.digest
    );

    println!("Using image: {}", image);

    Command::new("/usr/local/bin/docker")
        .args(&[
            "run",
            "-d",
            "-v",
            "/var/run/docker.sock:/var/run/docker.sock",
            "-p",
            "54321:8000",
            "--name",
            "premd",
            "-e",
            "PREM_REGISTRY_URL=https://raw.githubusercontent.com/premAI-io/prem-daemon/main/resources/mocks/manifests.json",
            "--rm",
            image.as_str(),
        ])
        .output()
        .expect("Failed to execute docker run");
}

#[tauri::command]
fn is_docker_running() -> Result<bool, String> {
    let docker_running = Command::new("/usr/local/bin/docker").args(&["info"]).output();
    match docker_running {
        Ok(output) => Ok(output.status.success()),
        Err(e) => {
            Err(format!("Error: {}", e))
        },
    }
}

#[tauri::command]
fn is_container_running() -> bool {
    let container_name = "premd";
    let output = Command::new("/usr/local/bin/docker")
        .args(&["ps", "-q", "-f", &format!("name={}", container_name)])
        .output()
        .expect("Failed to execute command");

    output.status.success() && !output.stdout.is_empty()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            run_container,
            is_container_running,
            is_docker_running
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
