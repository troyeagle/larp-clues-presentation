# 项目 Pages 与私有源码回退规约

## 默认发布

公开仓库 [`troyeagle/larp-clues-presentation`](https://github.com/troyeagle/larp-clues-presentation) 独立发布项目 Pages：[线上入口](https://troyeagle.github.io/larp-clues-presentation/)。推送 `main` 或手动运行 [publish-static.yml](https://github.com/troyeagle/larp-clues-presentation/actions/workflows/publish-static.yml)，即执行检查、构建和部署。PR 只检查和构建，不部署。

Pages 使用官方固定 SHA 的 configure-pages、upload-pages-artifact、deploy-pages，权限分为构建 Contents: read/Pages: read，部署 Pages: write/ID-token: write。默认模式不需要 PAT、博客通知或定时收集，使用 GitHub 自动提供的 GITHUB_TOKEN 和 OIDC。

[Pages 设置](https://github.com/troyeagle/larp-clues-presentation/settings/pages) 的 Source 选择 GitHub Actions。构建输出为 `build/`，不进入源码 Git；所有模式均关闭 source map。页面资产采用项目子路径 `/larp-clues-presentation/` 或相对路径。查看本地实现与许可证要求以 README 为准。

## 两个互斥发布模式

[仓库 Variables](https://github.com/troyeagle/larp-clues-presentation/settings/variables/actions) 中的 `SITE_PUBLISH_MODE`：

| 值 | 项目 Pages | 博客回退 |
| --- | --- | --- |
| 不设置或 `pages` | 仅公开仓库可构建、部署 | 跳过 |
| `blog` | 跳过 | 构建并上传 `site-clue` |

`.github/workflows/publish-to-blog.yml` 是保留的回退配置，默认 job 条件不成立，不能自动恢复博客发布。其共享工作流与 `publisher_ref` 必须固定到相同的完整 SHA。回退打包器生成 `_site-sync.json` 并验证 source map、路径和内容；元数据不进入网站。

## 未来转为私有仓库时的操作顺序

1. 审核允许公开的构建输出。源码仓库私有不等于网站私有；博客 Pages 仍公开，只发布已批准的静态输出，不能包含密钥、内部资料、原始媒体、模板或 source map。
2. 暂停本仓库独立部署：将 `SITE_PUBLISH_MODE` 设为 `blog`；在 [Pages 设置](https://github.com/troyeagle/larp-clues-presentation/settings/pages) 下线项目站，必要时取消其自定义域名。不要让两个发布渠道同时承担相同入口。
3. 在博客保存的 `SOURCE_ARTIFACTS_TOKEN` 中给 `troyeagle/larp-clues-presentation` 添加 Contents: read、Actions: read，并按要求把源码仓库改为私有。该读取 Token 只保存在博客。
4. 手动运行 [回退工作流](https://github.com/troyeagle/larp-clues-presentation/actions/workflows/publish-to-blog.yml)，选择 `main`，等待构建成功。共享发布器自动使用博客旧路径 `/clue/`，而非默认项目路径。
5. 博客 `.github/apps.json` 中已保留 `clue` 槽位，默认 `enabled: false`。先在博客 [同步工作流](https://github.com/troyeagle/troyeagle.github.io/actions/workflows/sync-apps.yml) 勾选 `dry_run` 与 `include_disabled` 做预览；审核成功后将该槽位设为 `true`，再取消 `dry_run` 正式同步。`/clue/remark.md` 会由审核过的静态产物替换。
6. 验证博客地址 `https://troyeagle.github.io/clue/`、发布状态及正常 Pages 部署。没有通知 Token 时约每 30 分钟收集；若需立即通知，可在源码保存仅授权博客 Actions: write 的 `BLOG_DISPATCH_TOKEN`。不得把博客 Contents-write Token 分发到源码仓库。

项目路径与回退路径可能不同，调用者应按当时启用的发布模式更新入口链接。目录迁移说明位于博客 `clue/remark.md`。

## 返回公开项目站

先暂停博客槽位并验证其停止写入，再把源码改回公开、把模式设为 `pages` 或删除该变量、启用本仓库 Pages 的 GitHub Actions 来源，手动部署并检查项目路径。验证后恢复博客迁移说明。保留回退 workflow 和本规约，不清空历史配置。

## 本地检查与提交

```sh
npm test -- --watchAll=false --runInBand
npm run build
```

AI agent 的提交只使用 `Co-authored-by: Bot <bot@anonymous.com>` 一条匿名尾注，推送前读取实际提交信息核对；主作者仍使用用户指定的仓库身份。发布身份、构建记录与回退说明随代码提交，不写入任何 Token 值。
