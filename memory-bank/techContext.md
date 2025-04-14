# 技术背景 (Tech Context): TuneTrail

## 主要技术栈 (Main Technology Stack)

*   **前端:** React Native (用于构建 Android 应用)
*   **后端:** Vercel Serverless Functions (Node.js, 位于 `api/` 目录，用于处理 URL 解析和音乐搜索 API 调用)
*   **外部 API:**
    *   YouTube Data API v3 (用于音乐搜索)
    *   Spotify API (用于音乐搜索)
    *   Gemini API (用于从文本中提取音乐信息)
*   **构建/部署:**
    *   **前端:** React Native CLI, Android Studio/SDK
    *   **后端 (`api/`):** Vercel CLI 或通过 Git 连接进行 Vercel 部署

## 开发环境设置 (Development Environment Setup)

*   **前端:**
    *   Node.js (指定版本，例如 LTS)
    *   npm 或 yarn
    *   React Native 开发环境 (根据 React Native 官方文档设置，包括 Android Studio, SDK, Emulator/Device)
    *   `npm install` 安装项目依赖 (`app/` 目录)
*   **后端 (Vercel - `api/` 目录):**
    *   Node.js (用于运行 Serverless Function)
    *   `npm install` 安装 API 依赖 (`api/` 目录)
    *   Vercel CLI (用于本地开发 `vercel dev` 和手动部署 `vercel`, `vercel --prod`)
    *   环境变量配置 (通过 Vercel 控制台或 CLI `vercel env add` 管理 API 密钥等敏感信息)

## 技术约束 (Technical Constraints)

*   **平台:** MVP 仅限 Android。
*   **API 限制:** 需要遵守 YouTube Data API, Spotify API, Gemini API 的使用条款和配额限制。
*   **网页抓取:** 播客 Shownotes 页面的结构可能多样且易变，网页抓取 (`axios`) 和内容解析 (`cheerio`) 需要健壮的错误处理和适应性。
*   **AI/解析:** 使用 Gemini API 提取音乐信息，需要考虑成本、准确性和延迟。
*   **Gradle 依赖下载:** 在某些网络环境下（尤其是国内），直接从 `mavenCentral()` 或 `google()` 下载 Gradle 依赖可能非常缓慢或失败。需要配置 HTTP/HTTPS 代理才能顺利完成构建。推荐在用户主目录的 `.gradle/gradle.properties` 文件中进行全局配置 (详见 `SETUP.md`)。
*   **Vercel 部署:** Serverless Function 有执行时间、内存等限制。

## 关键依赖项 (Key Dependencies)

*   **前端 (`app/`):**
    *   `react`: 核心库
    *   `react-native`: 核心框架
    *   `@react-navigation/native`, `@react-navigation/stack`: 导航
    *   `react-native-gesture-handler`, `react-native-screens`, `react-native-safe-area-context`: 导航依赖
    *   `axios`: API 请求
*   **后端 (`api/`):**
    *   `axios`: HTTP 请求 (抓取网页, 调用外部 API)
    *   `cheerio`: HTML 解析
    *   `@google/generative-ai`: Gemini API 客户端
    *   `googleapis`: Google API 客户端 (用于 YouTube Data API)
    *   `spotify-web-api-node`: Spotify API 客户端
*   **状态管理 (前端):**
    *   React `Context API` (`SearchContext.tsx`): 用于管理搜索状态 (加载、结果)。
