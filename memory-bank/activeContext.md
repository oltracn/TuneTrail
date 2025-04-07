# 当前工作背景 (Active Context): TuneTrail

## 当前焦点 (Current Focus)

*   **多页面重构初步完成与测试:** 应用已重构为多页面结构 (Home, AddUrl, Settings)，引入了 React Navigation 和 Context API 进行导航和状态管理。初步测试通过，但存在一些待解决的问题。

## 最近的变更 (Recent Changes)

*   **后端 API 优化与 Spotify 集成:**
    *   优化了 YouTube API 调用为分批并行。
    *   集成了 Spotify API 搜索功能 (Client Credentials Flow)。
    *   后端 API 现在能根据 `platform` 参数进行条件搜索。
    *   更新了 `.clinerules` 关于 `replace_in_file` 的使用策略。
*   **前端重构:**
    *   安装了 React Navigation 及相关依赖。
    *   创建了 `HomeScreen`, `AddUrlScreen`, `SettingsScreen` 组件。
    *   设置了 Stack Navigator (`App.tsx`)。
    *   创建了 `SearchContext` 用于共享 `isLoading` 和 `results` 状态。
    *   修改了 `HomeScreen` 和 `AddUrlScreen` 以使用 Context。
    *   添加了基本的导航按钮 (FAB 和 Header Button)。
*   **问题修复:**
    *   解决了 `react-native-gesture-handler` 缺失导致的红屏错误 (安装依赖、修改 `MainActivity.kt`)。
    *   通过清理依赖和重启 Metro 解决了 `hoist-non-react-statics` 相关的红屏错误。
*   **初步测试:** 重构后的应用已能在模拟器上运行，导航和核心搜索流程初步通过测试。

## 下一步计划 (Next Steps)

*   **更新记忆库:** 更新 `progress.md` 反映重构和初步测试完成 (正在进行)。
*   **代码同步:** 将所有重构代码和记忆库更新提交到 GitHub (即将进行)。
*   **问题排查与修复:** 解决初步测试中发现的剩余问题 (具体问题待用户指出)。
*   **继续开发:**
    *   实现 `SettingsScreen` 中的平台选择 UI 和逻辑。
    *   将平台选择状态集成到 `AddUrlScreen` 的 API 调用中。
    *   实现分享接收功能 (`AndroidManifest.xml` 修改已完成，需在 `AddUrlScreen` 中完善逻辑)。
    *   (后续) 实现 Google 登录与收藏功能。

## 当前决策与考虑 (Active Decisions & Considerations)

*   **代码同步:** 确保所有必要的文件（包括记忆库更新）都已暂存并提交。
*   **代理配置一致性:** 强调在 Windows 环境下同样需要配置 Gradle 代理，路径通常是 `C:\Users\<YourUsername>\.gradle\gradle.properties`。
*   **环境差异:** 提醒用户注意 Windows 环境下的路径分隔符 (`\`) 和命令行差异，并在 `SETUP.md` 中体现。
*   **解析策略:** (维持不变) 需要决定是在客户端直接解析网页，还是通过后端服务进行解析。后端服务更健壮，但增加了复杂性。客户端解析更简单，但可能受限于移动环境和跨域策略。
*   **音乐提取方法:** (维持不变) 是使用基于规则的提取（例如查找特定 HTML 结构或关键词），还是探索更智能的 AI/NLP 方法？MVP 可能先从简单规则开始。
*   **状态管理:** (维持不变) 为 React Native 应用选择合适的状态管理方案（如 Context API, Zustand, Redux）。
