# 当前工作背景 (Active Context): TuneTrail

## 当前焦点 (Current Focus)

*   **准备第二阶段:** 规划和开始实现后端 Serverless Function，用于处理网页抓取、解析和音乐提取。

## 最近的变更 (Recent Changes)

*   **完成第一阶段测试:** 验证了开发环境，修复了 Gradle 构建问题 (TLSv1.2)，并成功在模拟器上运行了基础 UI。
*   **更新 Memory Bank:** 更新了 `progress.md` 和 `activeContext.md` 以反映当前状态。
*   **代码同步:** 将所有更改提交并推送到 GitHub。

## 下一步计划 (Next Steps)

*   **后端开发 (第二阶段):**
    *   创建 Vercel 项目。
    *   设置 Node.js Serverless Function。
    *   实现 URL 接收、网页抓取 (`axios`) 和 HTML 解析 (`cheerio`)。
    *   开发初步的音乐信息提取逻辑。
*   **前端集成:** 在 `app/App.tsx` 中添加调用后端 Function 的逻辑。

## 当前决策与考虑 (Active Decisions & Considerations)

*   **解析策略:** 需要决定是在客户端直接解析网页，还是通过后端服务进行解析。后端服务更健壮，但增加了复杂性。客户端解析更简单，但可能受限于移动环境和跨域策略。
*   **音乐提取方法:** 是使用基于规则的提取（例如查找特定 HTML 结构或关键词），还是探索更智能的 AI/NLP 方法？MVP 可能先从简单规则开始。
*   **状态管理:** 为 React Native 应用选择合适的状态管理方案（如 Context API, Zustand, Redux）。
