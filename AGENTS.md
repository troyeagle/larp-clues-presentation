# AI agent 工程规约

开始工作前阅读 README.md 与 `.github/STATIC_PUBLISH.md`，保留用户已有工作区资料。

## AI 提交署名

所有 AI agent（ChatGPT/Codex、Claude、DeepSeek、TRAE 等）的提交统一只包含一条 `Co-authored-by: Bot <bot@anonymous.com>`。禁止默认模型、厂商或员工邮箱署名；推送前读取实际提交信息并修正自动追加内容。主作者使用用户指定的仓库身份，不改全局 Git 配置。发布模式切换按 `.github/STATIC_PUBLISH.md`，保留回退配置和未提交资料。

## 用户提交身份与公开路径

用户指定的人类作者和提交者统一为 `troyeagle <troyeagle@qq.com>`；AI 协作者统一为 `Co-authored-by: Bot <bot@anonymous.com>`，只保留一条。第三方作者及 GitHub 自动提交身份按其实际归属保留。

仅在本仓库设置 Git 身份，不修改全局配置：

```sh
git config --local user.name troyeagle
git config --local user.email troyeagle@qq.com
git var GIT_AUTHOR_IDENT
git var GIT_COMMITTER_IDENT
```

公开资料中的本机账户绝对路径统一写作 `/Users/{youraccountname}/...`。这是说明占位符；执行命令时应替换为本机账户，或使用相对路径重新生成素材清单。不得把真实本机账户路径再次提交到公开仓库。
