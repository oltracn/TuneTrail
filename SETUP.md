# TuneTrail 开发环境设置指南

本文档旨在指导开发者在不同操作系统上设置运行 TuneTrail (React Native Android) 项目所需的本地开发环境。

## 先决条件

*   **代码编辑器:** 推荐使用 Visual Studio Code。
*   **Git:** 用于版本控制。
*   **GitHub 账户:** 用于代码同步。

## 统一工具版本

*   **Node.js:** **最新 LTS 版本 (当前为 20.x)**。请确保安装此版本或更高 LTS 版本。建议使用 `nvm` (Node Version Manager) 或 `nvm-windows` 来管理 Node.js 版本。
*   **npm:** 使用 Node.js LTS 版本自带的 npm。
*   **JDK:** **OpenJDK 17**。React Native 需要特定版本的 JDK。

## 核心依赖安装

请遵循 React Native 官方文档的 **"React Native CLI Quickstart"** -> **"Development OS"** -> **"Target OS: Android"** 部分进行详细设置。以下是关键步骤摘要和链接：

**官方文档链接:** [https://reactnative.dev/docs/environment-setup?os=windows&platform=android](https://reactnative.dev/docs/environment-setup?os=windows&platform=android) (请根据你的开发操作系统选择对应的标签页 Windows/macOS/Linux)

### 1. 安装 Node.js (LTS) 和 JDK 17

*   **所有平台:**
    *   **Node.js:** 从 [Node.js 官网](https://nodejs.org/) 下载并安装最新的 LTS 版本 (20.x)。或使用 `nvm`/`nvm-windows` 安装: `nvm install --lts` && `nvm use --lts`.
    *   **JDK:** 安装 OpenJDK 17。
        *   **Windows:** 可以使用 [Chocolatey](https://chocolatey.org/): `choco install -y microsoft-openjdk17`
        *   **macOS:** 可以使用 [Homebrew](https://brew.sh/): `brew install openjdk@17` (可能需要额外步骤链接它或设置 JAVA_HOME)。
        *   **Linux:** 使用你的包管理器安装，例如 `sudo apt install openjdk-17-jdk` (Debian/Ubuntu)。
    *   验证安装: `node -v`, `npm -v`, `java -version`

### 2. 安装 Android Studio

*   **所有平台:** 从 [Android 开发者官网](https://developer.android.com/studio) 下载并安装 Android Studio。
*   **安装组件:**
    *   启动 Android Studio，在 "Welcome" 屏幕选择 "More Actions" -> "SDK Manager"。
    *   在 "SDK Platforms" 标签页，确保至少勾选一个 Android SDK Platform 版本（例如 Android 13 "Tiramisu"）。
    *   在 "SDK Tools" 标签页，确保勾选以下项目：
        *   `Android SDK Build-Tools` (选择一个版本，通常最新即可)
        *   `Android Emulator`
        *   `Android SDK Platform-Tools`
        *   `Android SDK Command-line Tools (latest)`
        *   (如果使用 Intel CPU) `Intel x86 Emulator Accelerator (HAXM installer)`
        *   (如果使用 AMD CPU 或 macOS) `Android Emulator hypervisor driver for AMD processors` 或 macOS 上的 Hypervisor.framework (通常默认启用)
    *   点击 "Apply" 下载并安装所选组件。

### 3. 配置 Android 环境变量

*   **所有平台:** 设置以下环境变量：
    *   `ANDROID_HOME`: 指向你的 Android SDK 安装路径。
        *   默认路径通常是:
            *   Windows: `%LOCALAPPDATA%\Android\Sdk`
            *   macOS: `$HOME/Library/Android/sdk`
            *   Linux: `$HOME/Android/Sdk`
    *   将以下路径添加到系统的 `PATH` 环境变量中：
        *   `%ANDROID_HOME%\platform-tools` (Windows) 或 `$ANDROID_HOME/platform-tools` (macOS/Linux)
        *   `%ANDROID_HOME%\emulator` (Windows) 或 `$ANDROID_HOME/emulator` (macOS/Linux)
        *   `%ANDROID_HOME%\cmdline-tools\latest\bin` (Windows) 或 `$ANDROID_HOME/cmdline-tools/latest/bin` (macOS/Linux) - *注意: 确保路径中的 `latest` 文件夹存在，如果不存在，可能是 `cmdline-tools` 下的版本号文件夹，如 `8.0`*
*   **验证:** 打开新的终端/命令提示符窗口，运行 `adb devices`。如果 SDK 配置正确，应该能看到命令执行（即使没有设备连接）。

### 4. 安装 Watchman (macOS 和 Linux)

*   **macOS:** `brew install watchman`
*   **Linux:** 遵循 [Watchman 安装指南](https://facebook.github.io/watchman/docs/install#installing-from-source)。

### 5. 安装 React Native CLI

*   **所有平台:** 在终端运行：
    ```bash
    npm install -g react-native-cli
    ```
    *(注意: 虽然官方文档有时推荐使用 `npx react-native <command>` 而非全局安装，但全局安装 CLI 在某些情况下仍有帮助。我们将主要使用 `npx` 来执行命令以确保使用项目本地版本。)*

## 验证设置

在项目根目录 (`f:/Code/TuneTrail`) 打开终端，运行：

```bash
npx react-native doctor
```

此命令会检查你的开发环境是否满足运行 React Native Android 项目的所有要求。根据提示修复任何报告的问题。

## 启动开发服务器和应用

1.  **启动 Metro Bundler:** 在项目根目录运行 `npm start` 或 `npx react-native start`。
2.  **运行 Android 应用:** 打开另一个终端，在项目根目录运行 `npm run android` 或 `npx react-native run-android`。这会自动构建应用并尝试在连接的模拟器或物理设备上启动它。

---

请根据你的具体操作系统仔细遵循官方文档和以上步骤。如果在设置过程中遇到问题，请查阅官方文档的故障排除部分或寻求帮助。
