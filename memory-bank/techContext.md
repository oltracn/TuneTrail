# 技术背景 (Tech Context): TuneTrail

## 主要技术栈 (Main Technology Stack)

*   **前端:** React Native (用于构建 Android 应用)
*   **后端 (潜在):** Vercel Serverless Functions (Node.js 或其他 Vercel 支持的语言，用于处理业务逻辑和 API 调用)
*   **外部 API:** YouTube Music API (用于音乐搜索)
*   **构建/部署:**
    *   **前端:** React Native CLI 或 Expo CLI, Android Studio/SDK
    *   **后端:** Vercel CLI 或 Git-based deployment

## 开发环境设置 (Development Environment Setup)

*   **前端:**
    *   Node.js (指定版本，例如 LTS)
    *   npm 或 yarn
    *   React Native 开发环境 (根据 React Native 官方文档设置，包括 Android Studio, SDK, Emulator/Device)
    *   `npm install` 或 `yarn install` 安装项目依赖
*   **后端 (如果使用 Vercel):**
    *   Node.js (如果使用 Node.js functions)
    *   Vercel CLI (可选，用于本地测试和部署)
    *   环境变量设置 (例如 YouTube Music API 密钥)

## 技术约束 (Technical Constraints)

*   **平台:** MVP 仅限 Android。
*   **API 限制:** 需要遵守 YouTube Music API 的使用条款和配额限制。
*   **网页抓取:** 播客 Shownotes 页面的结构可能多样且易变，网页抓取和内容解析可能需要健壮的错误处理和适应性。依赖第三方网页内容存在不确定性。
*   **AI/解析:** 如果使用 AI 进行音乐信息提取，可能需要考虑成本、准确性和延迟。
*   **Gradle 依赖下载:** 在某些网络环境下（尤其是国内），直接从 `mavenCentral()` 或 `google()` 下载 Gradle 依赖可能非常缓慢或失败。需要配置 HTTP/HTTPS 代理才能顺利完成构建。推荐在用户主目录的 `.gradle/gradle.properties` 文件中进行全局配置。

## 关键依赖项 (Key Dependencies)

*   **React Native:** 核心前端框架。
*   **YouTube Music API:** 提供音乐搜索功能。
*   **(后端)** Web Scraping 库 (例如: Cheerio, Puppeteer - 如果在后端实现): 用于抓取和解析网页内容。
 *   **(后端)** HTTP Client (例如: Axios, Fetch API): 用于与 YouTube Music API 通信。
 *   **(潜在)** AI/NLP 库/服务: 如果采用 AI 方式提取音乐信息。
 *   **状态管理 (前端):** 初期使用 React `useState` 和/或 `Context API`。后续可根据复杂度评估引入 Zustand 或 Redux。
