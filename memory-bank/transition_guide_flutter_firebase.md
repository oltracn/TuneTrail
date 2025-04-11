# TuneTrail: 产品描述与迁移指南 (Flutter & Firebase)

本文档旨在描述 TuneTrail 应用的核心功能，并为将项目技术栈从 React Native/Vercel 迁移到 Flutter/Firebase 提供指导。

## 1. 产品概述 (基于当前记忆库)

### 1.1 核心目标

开发一个移动应用程序 (TuneTrail)，允许用户通过粘贴播客 Shownotes 的网页链接，轻松发现其中提及的音乐，并在选定的音乐平台（目前支持 YouTube Music 和 Spotify）上查看搜索结果。

### 1.2 解决的问题

解决用户在播客中听到喜欢的音乐后，需要手动在音乐流媒体服务中搜索这些曲目的繁琐过程。

### 1.3 目标用户

*   经常收听播客并从中发现音乐的用户。
*   希望简化音乐发现和查找流程的用户。
*   YouTube Music 或 Spotify 的使用者。

### 1.4 核心功能 (当前 React Native/Vercel 版本)

1.  **URL 输入:** 用户在应用主界面 (`AddUrlScreen`) 粘贴播客 Shownotes 的 URL。
2.  **平台选择 (部分实现):** 用户应能在设置 (`SettingsScreen`) 中选择目标搜索平台 (YouTube Music, Spotify)。(UI 待实现)
3.  **处理与搜索:**
    *   点击按钮后，应用将 URL 和选定的平台发送到后端 Vercel Serverless Function (`/api/process-url`)。
    *   后端抓取 URL 内容 (`axios`, `cheerio`)。
    *   后端使用 Gemini API 从 HTML 内容中提取音乐信息（歌曲、艺术家）。
    *   后端根据用户选择的平台，调用相应的 API (YouTube Music API, Spotify API) 并行搜索提取到的音乐。
4.  **结果展示:** 应用在主界面 (`HomeScreen`) 显示从后端获取的音乐列表，包含歌曲信息和指向相应音乐平台搜索结果的链接 (`Linking`)。
5.  **状态管理:** 使用 React Context API (`SearchContext`) 管理加载状态和搜索结果。
6.  **导航:** 使用 React Navigation 实现多页面导航 (Home, AddUrl, Settings)。
7.  **分享接收 (部分实现):** Android 清单已配置为接收分享意图，但应用内处理逻辑待完善。

### 1.5 当前技术栈 (遗留)

*   **前端:** React Native (Android)
*   **后端:** Vercel Serverless Functions (Node.js)
*   **核心逻辑:** Cheerio (HTML 解析), Gemini API (音乐提取), YouTube API, Spotify API
*   **状态管理:** React Context API
*   **导航:** React Navigation

## 2. 拟议新架构 (Flutter & Firebase)

为了利用 Flutter 的跨平台能力和 Firebase 的集成后端服务，建议采用以下新架构：

*   **前端:** Flutter (使用 Dart 语言，可构建 Android, iOS, Web, Desktop 应用)
*   **后端:** Firebase (Google 的移动和 Web 应用开发平台)
    *   **Cloud Functions for Firebase:** 用于替代 Vercel Serverless Functions，执行服务器端逻辑，如：
        *   接收来自 Flutter 应用的请求 (HTTPS Callable Functions)。
        *   抓取和解析 Shownotes 网页内容。
        *   调用 Gemini API 或其他方法提取音乐信息。
        *   调用 YouTube Music API 和 Spotify API 进行搜索。
        *   处理和返回结果给 Flutter 应用。
    *   **Cloud Firestore:** NoSQL 数据库，用于存储应用数据，例如：
        *   用户偏好设置（如默认搜索平台）。
        *   用户搜索历史 (可选功能)。
        *   用户收藏的歌曲 (对应原计划的 Google 登录后收藏功能)。
    *   **Firebase Authentication:** 提供用户认证功能（电子邮件/密码、Google 登录等），简化用户管理。
    *   **(可选) Firebase Cloud Storage:** 如果需要存储用户上传的文件或其他媒体。

### 2.1 新架构图 (Mermaid)

```mermaid
graph LR
    A[用户 (User)] -- 交互 --> B(Flutter App);
    B -- 调用Function (HTTPS) --> C{Cloud Functions};
    C -- 抓取内容 --> D[播客Shownotes网页];
    C -- (可选)调用AI --> F[Gemini API];
    C -- 查询音乐 --> G[YouTube Music API / Spotify API];
    G -- 返回结果 --> C;
    F -- 返回结果 --> C;
    C -- 返回处理结果 --> B;
    B -- 读/写数据 --> E(Cloud Firestore);
    B -- 认证 --> H(Firebase Authentication);
    E -- (触发Functions - 可选) --> C;
    H -- (触发Functions - 可选) --> C;
```

## 3. 迁移指南

将项目从 React Native/Vercel 迁移到 Flutter/Firebase 需要重写前端和后端逻辑。

### 3.1 前端迁移 (React Native -> Flutter)

*   **环境搭建:** 设置 Flutter 开发环境 (Flutter SDK, Dart SDK, IDE 插件 for VS Code/Android Studio)。
*   **项目初始化:** 创建新的 Flutter 项目 (`flutter create tunetrail_flutter`)。
*   **UI 重建:**
    *   使用 Flutter 的 Widget 系统重新构建用户界面 (Screens: Home, AddUrl, Settings)。利用 `MaterialApp`, `Scaffold`, `AppBar`, `TextField`, `Button`, `ListView`/`GridView`, `CircularProgressIndicator` 等 Widget。
    *   考虑使用 Flutter 的主题系统 (`ThemeData`) 来统一应用风格。
*   **导航:**
    *   使用 Flutter 的内置 Navigator (`Navigator.push`, `Navigator.pop`) 或推荐的路由管理包 (如 `go_router`) 来实现页面间的跳转，替代 React Navigation。
*   **状态管理:**
    *   选择一个适合 Flutter 的状态管理方案来替代 React Context API。常用选项包括:
        *   **Provider:** 官方推荐，相对简单。
        *   **Riverpod:** Provider 的改进版，编译时安全，更灵活。
        *   **BLoC/Cubit:** 功能强大，适合复杂状态管理，学习曲线稍陡。
    *   管理应用状态，如 `isLoading`, `searchResults`, `selectedPlatform`, `userSession` 等。
*   **API 集成:**
    *   添加 Firebase 相关 Flutter 插件 (`firebase_core`, `cloud_functions`, `cloud_firestore`, `firebase_auth`) 到 `pubspec.yaml`。
    *   初始化 Firebase (`Firebase.initializeApp()`)。
    *   实现调用 Cloud Functions 的逻辑，使用 `firebase_functions` 插件。处理请求发送、等待响应、错误捕获。
    *   实现与 Firestore 的交互逻辑 (读写用户设置、历史记录等)，使用 `cloud_firestore` 插件。
*   **平台集成:**
    *   **分享接收:** 使用 `receive_sharing_intent` 或类似插件来处理从其他应用分享过来的 URL。
    *   **打开链接:** 使用 `url_launcher` 插件打开外部音乐平台链接。
*   **依赖管理:** 使用 Flutter 的 `pubspec.yaml` 文件管理 Dart 和 Flutter 依赖。

### 3.2 后端迁移 (Vercel -> Firebase Cloud Functions)

*   **环境设置:** 初始化 Firebase 项目 (`firebase init functions`)，选择 Node.js (或 TypeScript) 作为运行时。
*   **逻辑移植:**
    *   将 `api/process-url.js` 中的核心逻辑（使用 `axios`, `cheerio`, Gemini API, YouTube/Spotify API 客户端）迁移到 Firebase Cloud Function 代码中 (`functions/index.js` 或相应文件)。
    *   确保 API 密钥和敏感配置通过 Firebase Functions 的环境变量 (`firebase functions:config:set`) 进行管理，而不是硬编码。
*   **函数类型:**
    *   使用 **HTTPS Callable Functions**，这是从 Flutter 应用直接调用 Functions 的推荐方式，Firebase SDK 会自动处理认证令牌和序列化。
*   **依赖管理:** 在 `functions/package.json` 中管理 Node.js 依赖 (`npm install` in `functions` directory)。
*   **部署:** 使用 Firebase CLI 部署 Functions (`firebase deploy --only functions`)。

### 3.3 数据管理 (新增 - Cloud Firestore)

*   **数据建模:**
    *   设计 Firestore 的数据结构。例如:
        *   `users/{userId}/settings` (文档): 存储 `preferredPlatform` 等设置。
        *   `users/{userId}/searchHistory` (集合): 每个文档代表一次搜索记录。
        *   `users/{userId}/favorites` (集合): 每个文档代表一首收藏的歌曲。
*   **安全规则:** 配置 Firestore 安全规则，确保用户只能访问自己的数据。
*   **Flutter 集成:** 在 Flutter 应用中使用 `cloud_firestore` 插件执行 CRUD (Create, Read, Update, Delete) 操作。

### 3.4 认证 (新增 - Firebase Authentication)

*   **控制台配置:** 在 Firebase 控制台启用所需的登录方式 (例如 Google Sign-In, Email/Password)。
*   **Flutter 集成:**
    *   使用 `firebase_auth` 插件实现登录、注册、登出流程。
    *   监听认证状态变化 (`FirebaseAuth.instance.authStateChanges()`) 来更新 UI。
    *   将认证获得的用户 ID (`uid`) 用于 Firestore 数据读写，关联用户数据。

## 4. 关键考虑与后续步骤

*   **功能对等:** 确保迁移后的 Flutter/Firebase 版本至少包含当前 React Native 版本的所有核心功能。
*   **学习曲线:** 团队需要投入时间学习 Dart, Flutter 以及 Firebase 的各种服务。
*   **测试:** 在迁移的每个阶段进行彻底测试（单元测试、Widget 测试、集成测试）。Firebase 提供了本地模拟器套件 (`Firebase Emulator Suite`)，可以在本地测试 Functions, Firestore, Auth 等。
*   **依赖选择:** 仔细选择 Flutter 插件，关注其维护状态、社区支持和平台兼容性。
*   **成本:** 了解 Firebase 的定价模型（特别是 Cloud Functions, Firestore, Gemini API 的使用量）。Firebase 有慷慨的免费额度，但超出后会产生费用。
*   **分阶段迁移 (可选):** 如果项目复杂，可以考虑分阶段迁移。例如，先迁移后端到 Cloud Functions，让 React Native 应用调用新的后端，然后再迁移前端到 Flutter。但这会增加过渡期的复杂性。
*   **更新记忆库:** 一旦开始迁移，务必更新所有相关的记忆库文件 (`techContext.md`, `systemPatterns.md`, `progress.md`, `activeContext.md`) 以反映新的技术栈和架构。

**下一步:**

1.  **确认迁移计划:** 与团队讨论并确认此迁移方案。
2.  **环境设置:** 搭建 Flutter 和 Firebase 开发环境。
3.  **开始迁移:** 按照上述指南逐步进行前端和后端的重写与集成。
4.  **持续更新文档:** 在迁移过程中持续更新本文档和记忆库。
