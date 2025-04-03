# 产品背景 (Product Context): TuneTrail

## 项目目的 (Project Purpose)

*   解决用户在播客中发现新音乐后，需要手动在 YouTube Music 中搜索这些曲目的繁琐问题。
*   通过自动化流程，简化从播客 Shownotes 网页链接中提取音乐信息并在 YouTube Music 中查找的过程。

## 目标用户 (Target Users)

*   经常收听播客并从中发现音乐的用户。
*   希望简化音乐发现和查找流程的用户。
*   YouTube Music 的使用者。

## 核心功能 (Core Functionality)

*   **用户流程:**
    1.  用户在 TuneTrail 应用中粘贴播客 Shownotes 的网页 URL。
    2.  用户点击按钮启动分析。
    3.  应用（或其后端服务）抓取并解析网页内容，识别音乐信息（如：歌曲名、艺术家）。
    4.  应用使用识别出的信息调用 YouTube Music API 进行搜索。
    5.  应用在结果页面展示提取出的音乐列表，并提供指向 YouTube Music 的链接。

## 用户体验目标 (User Experience Goals)

*   **高效:** 用户能够快速、轻松地通过 URL 找到音乐。
*   **便捷:** 消除手动搜索的步骤，提供一站式体验。
*   **清晰:** 搜索结果明确，易于理解和操作。
