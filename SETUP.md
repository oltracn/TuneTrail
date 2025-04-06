# TuneTrail 开发环境设置指南

本文档旨在指导开发者在不同操作系统上设置运行 TuneTrail (React Native Android) 项目所需的本地开发环境。

## 初始项目获取与依赖安装

1.  **克隆仓库:**
    ```bash
    git clone https://github.com/oltracn/TuneTrail.git
    cd TuneTrail
    ```
2.  **安装应用依赖:**
    进入 `app` 目录并安装 Node.js 依赖项。
    ```bash
    cd app
    npm install
    cd .. 
    ```
    *(注意: 后续所有 `npm` 或 `npx react-native` 命令都应在 `app/` 目录下执行，除非特别说明)*

---

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

---

## 跨设备开发与同步注意事项

本项目可能在不同操作系统（如 macOS 和 Windows）之间进行开发。为确保顺利同步和构建，请注意以下几点：

1.  **代码同步:**
    *   **提交与推送:** 在切换开发设备前，务必将所有本地代码更改（包括记忆库 `memory-bank/` 目录以及任何其他修改过的文件）通过 `git add .`, `git commit -m "描述性提交信息"` 和 `git push` 推送到 GitHub 仓库。
    *   **拉取更新:** 在新设备上开始工作前，务必运行 `git pull` 拉取远程仓库的最新代码。

2.  **Gradle 代理配置 (重要):**
    *   Gradle 在下载依赖项时可能会遇到网络问题，尤其是在访问 `mavenCentral()` 和 `google()` 等官方仓库时。这在不同网络环境下表现可能不同。
    *   **推荐方法 (全局配置):** 在 Gradle 用户主目录 (`$HOME/.gradle/` on macOS/Linux 或 `%USERPROFILE%\.gradle\` on Windows) 下创建或编辑 `gradle.properties` 文件。添加以下配置（请根据你的实际代理服务器地址和端口修改）：
        ```properties
        # Gradle Proxy Settings (全局配置，推荐)
        # --- Windows 示例路径: C:\Users\<YourUsername>\.gradle\gradle.properties ---
        # --- macOS/Linux 示例路径: /Users/<YourUsername>/.gradle/gradle.properties ---
        systemProp.http.proxyHost=127.0.0.1
        systemProp.http.proxyPort=7890  # 替换为你的 HTTP 代理端口
        systemProp.https.proxyHost=127.0.0.1
        systemProp.https.proxyPort=7890 # 替换为你的 HTTPS 代理端口
        # 如果代理需要认证 (可选):
        # systemProp.http.proxyUser=your_username
        # systemProp.http.proxyPassword=your_password
        # systemProp.https.proxyUser=your_username
        # systemProp.https.proxyPassword=your_password
        ```
    *   **确保代理开启:** 在运行需要网络访问的 Gradle 命令（如 `npm run android` 或 `./gradlew build`）之前，确保你的系统代理或 VPN 已正确配置并处于活动状态，以便 Gradle 可以通过上述配置的代理访问网络。
    *   **一致性:** 确保在所有开发设备上都应用了相同的、有效的代理配置。

3.  **环境差异:**
    *   **路径分隔符:** 注意 Windows (`\`) 和 macOS/Linux (`/`) 之间的路径分隔符差异。尽量在脚本和配置文件中使用相对路径或环境变量来提高兼容性。
    *   **命令行:** 不同操作系统的终端命令可能不同 (e.g., `copy` vs `cp`, `del` vs `rm`)。
    *   **版本一致性:** 确保 Node.js, JDK, Android Studio/SDK 的版本在不同设备上保持一致（遵循本文档顶部的版本要求）。

4.  **依赖与缓存清理 (故障排除):**
    *   **Node 模块:** 切换设备后，如果遇到与 Node.js 相关的构建错误，尝试删除 `app/node_modules` 目录和 `app/package-lock.json` 文件，然后进入 `app` 目录重新运行 `npm install`。
    *   **Gradle 缓存:** 对于 Android 构建问题，可以尝试清理 Gradle 缓存。在 `app/android` 目录下运行 `./gradlew clean` (macOS/Linux) 或 `gradlew clean` (Windows)。有时更彻底的清理可能需要删除用户主目录下的 `.gradle/caches` 文件夹。

通过遵循以上步骤，可以最大限度地减少跨设备开发带来的环境配置和构建问题。

---

## 跨设备开发与同步注意事项

本项目可能在不同操作系统（如 macOS 和 Windows）之间进行开发。为确保顺利同步和构建，请注意以下几点：

1.  **代码同步:**
    *   在切换开发设备前，务必将所有本地代码更改（包括记忆库 `memory-bank/` 目录）提交 (commit) 并推送 (push) 到 GitHub 仓库。
    *   在新设备上开始工作前，务必拉取 (pull) 最新的代码。

2.  **Gradle 代理配置 (重要):**
    *   Gradle 在下载依赖项时可能会遇到网络问题，尤其是在访问 `mavenCentral()` 和 `google()` 等官方仓库时。
    *   **推荐方法:** 在 Gradle 用户主目录 (`$HOME/.gradle/` 或 `%USERPROFILE%\.gradle\`) 下创建或编辑 `gradle.properties` 文件，并添加以下全局代理配置（请根据你的实际代理服务器地址和端口修改）：
        ```properties
        # Gradle Proxy Settings (全局配置，推荐)
        systemProp.http.proxyHost=127.0.0.1
        systemProp.http.proxyPort=7890
        systemProp.https.proxyHost=127.0.0.1
        systemProp.https.proxyPort=7890
        ```
    *   **备选方法 (项目级):** 如果不想进行全局配置，可以在项目内的 `android/gradle.properties` 文件中添加上述 `systemProp` 配置。**但不推荐**，因为这会修改项目文件，可能导致 Git 冲突。
    *   **确保代理开启:** 在运行 Gradle 构建命令（如 `npm run android`）之前，确保你的系统代理或 VPN 已正确配置并处于活动状态。
    *   **macOS Shell 代理 (参考):** macOS 用户可以在 `.zshrc` 或 `.bash_profile` 中添加以下函数来快速开关终端代理（需要根据实际代理端口修改）：
        ```bash
        # Proxy Functions
        proxyon() {
            export http_proxy="http://127.0.0.1:7890"
            export https_proxy="http://127.0.0.1:7890"
            echo "Proxy is ON"
        }

        proxyoff() {
            unset http_proxy
            unset https_proxy
            echo "Proxy is OFF"
        }
        ```
        *注意: 仅在终端中执行 `proxyon` 只对当前终端会话生效，不会影响 Gradle 的全局配置。Gradle 构建依赖于 `gradle.properties` 中的配置。*
    *   **Windows 代理:** Windows 用户通常通过系统设置或代理软件界面配置代理，确保 Gradle 构建时网络通畅。

3.  **环境差异:**
    *   注意不同操作系统之间路径分隔符 (`/` vs `\`) 和环境变量设置方式的差异。尽量在脚本和配置文件中使用跨平台兼容的方式。
    *   确保 Node.js, JDK, Android Studio/SDK 的版本在不同设备上保持一致（遵循本文档顶部的版本要求）。

4.  **依赖重新安装:**
    *   切换设备后，如果遇到奇怪的构建错误，尝试删除 `app/node_modules` 目录和 `app/package-lock.json` 文件，然后重新运行 `cd app && npm install`。
    *   对于 Android 构建问题，可以尝试清理 Gradle 缓存：在 `app/android` 目录下运行 `./gradlew clean`。

通过遵循以上步骤，可以最大限度地减少跨设备开发带来的环境配置和构建问题。
