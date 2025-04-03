# 当前工作背景 (Active Context): TuneTrail

## 当前焦点 (Current Focus)

*   **项目初始化:** 设置 React Native 项目结构，配置开发环境。
*   **MVP 核心功能:** 开始规划和实现 MVP 的核心用户流程，包括 URL 输入、后端（或本地）处理逻辑的初步设计，以及与 YouTube Music API 的集成点。

## 最近的变更 (Recent Changes)

*   **记忆库初始化:** 根据项目简报更新了所有核心记忆库文件 (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `activeContext.md`, `progress.md`)。

## 下一步计划 (Next Steps)

*   **环境搭建:** 确保 React Native 开发环境和 Android 模拟器/设备正常工作。
*   **基础 UI:** 创建 MVP 所需的基本 UI 界面（URL 输入框、按钮、结果显示区域）。
*   **后端/逻辑设计:** 确定网页解析和音乐提取的具体实现方式（前端处理、后端 Serverless Function，或混合）。
*   **API 集成:** 研究并准备集成 YouTube Music API。

## 当前决策与考虑 (Active Decisions & Considerations)

*   **解析策略:** 需要决定是在客户端直接解析网页，还是通过后端服务进行解析。后端服务更健壮，但增加了复杂性。客户端解析更简单，但可能受限于移动环境和跨域策略。
*   **音乐提取方法:** 是使用基于规则的提取（例如查找特定 HTML 结构或关键词），还是探索更智能的 AI/NLP 方法？MVP 可能先从简单规则开始。
*   **状态管理:** 为 React Native 应用选择合适的状态管理方案（如 Context API, Zustand, Redux）。
