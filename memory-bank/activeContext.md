# 当前工作背景 (Active Context): TuneTrail

## 当前焦点 (Current Focus)

*   **跨设备同步:** 确保当前 macOS 环境下成功运行的版本能够顺利同步到 GitHub，并为后续在 PC (Windows) 环境下继续开发做好准备。
*   **文档更新:** 更新记忆库和 `SETUP.md`，记录调试过程和跨设备开发注意事项。

## 最近的变更 (Recent Changes)

*   **调试成功:** 在 macOS 环境下解决了 Gradle 依赖下载问题（通过配置全局代理），并成功构建和运行了 Android 应用。
*   **记忆库更新:** 更新了 `progress.md` 反映调试进展。
*   **Shell 配置:** 将代理设置和 `proxyon`/`proxyoff` 函数从 `.zshrc` 添加到了 `.bash_profile`。

## 下一步计划 (Next Steps)

*   **文档完善:** 在 `SETUP.md` 中添加关于跨设备开发同步和环境配置（特别是代理）的说明。
*   **代码同步:** 将所有本地更改提交并推送到 GitHub 仓库。
*   **PC 环境准备:** 用户将在 PC (Windows) 环境下继续开发，需要确保 PC 端的开发环境（Node.js, JDK, Android Studio, SDK, 代理设置等）配置正确。
*   **进入第二阶段:** 在 PC 环境下开始开发后端 Serverless Function。

## 当前决策与考虑 (Active Decisions & Considerations)

*   **代理配置一致性:** 确保 PC 端的 Gradle 代理配置与 macOS 端一致（推荐使用全局 `~/.gradle/gradle.properties`）。
*   **环境差异:** 注意 macOS 和 Windows 之间可能存在的细微环境差异（如路径分隔符、环境变量设置方式），并在 `SETUP.md` 中体现。
*   **解析策略:** (维持不变) 需要决定是在客户端直接解析网页，还是通过后端服务进行解析。后端服务更健壮，但增加了复杂性。客户端解析更简单，但可能受限于移动环境和跨域策略。
*   **音乐提取方法:** (维持不变) 是使用基于规则的提取（例如查找特定 HTML 结构或关键词），还是探索更智能的 AI/NLP 方法？MVP 可能先从简单规则开始。
*   **状态管理:** (维持不变) 为 React Native 应用选择合适的状态管理方案（如 Context API, Zustand, Redux）。
