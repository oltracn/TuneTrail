# 系统模式 (System Patterns): TuneTrail

## 系统架构 (System Architecture)

*   **客户端-服务器 (Client-Server) 架构:**
    *   **客户端:** Android 移动应用 (使用 React Native 构建)。
    *   **服务器 (潜在):** Vercel Serverless Functions 用于处理网页抓取、内容分析（可能涉及 AI）以及与 YouTube Music API 的交互。这种方式可以将复杂的逻辑和 API 密钥管理放在后端，保持客户端的轻量化。
*   **交互流程:**
    1.  客户端 (React Native App) 接收用户输入的 URL。
    2.  客户端将 URL 发送给后端 (Vercel Serverless Function)。
    3.  后端抓取网页内容，进行解析和音乐信息提取。
    4.  后端调用 YouTube Music API 搜索提取到的音乐。
    5.  后端将处理后的结果（音乐列表和链接）返回给客户端。
    6.  客户端展示结果给用户。

```mermaid
graph LR
    A[用户 (User)] -- 输入URL --> B(React Native App);
    B -- 发送URL --> C{Vercel Serverless Function};
    C -- 抓取内容 --> D[播客Shownotes网页];
    C -- 解析内容 & 提取音乐 --> C;
    C -- 查询音乐 --> E[YouTube Music API];
    E -- 返回结果 --> C;
    C -- 返回处理结果 --> B;
    B -- 显示结果 --> A;
```

## 关键技术决策 (Key Technical Decisions)

*   **React Native:** 选择 React Native 作为前端框架，允许未来可能（虽然 MVP 不包含）扩展到 iOS 平台，并利用现有的 React 生态系统。
*   **Vercel Serverless Functions:** 考虑使用 Vercel Serverless Functions 作为后端，提供按需扩展、简化部署和管理后端逻辑的能力，特别适合处理 API 调用和潜在的计算密集型任务（如网页解析/AI）。
*   **YouTube Music API:** 利用官方 API 进行音乐搜索，确保结果的准确性和合法性。

## 设计模式 (Design Patterns)

*   *(将在开发过程中根据具体实现确定，例如：可能使用状态管理模式如 Redux/Zustand 管理应用状态，或者使用模块化模式组织代码)*

## 组件关系 (Component Relationships)

*   **UI 组件 (React Native):** 负责用户输入、按钮交互和结果展示。
*   **API 服务层 (客户端):** 封装与后端 Serverless Function 的通信。
*   **后端服务 (Vercel):**
    *   **URL 处理模块:** 负责接收 URL、抓取和解析网页。
    *   **音乐提取模块:** 负责从解析内容中识别音乐信息。
    *   **YouTube Music API 客户端:** 负责与 YouTube Music API 交互。
