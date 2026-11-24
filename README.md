# Larp Clues

A clue presenter. Powered by create-react-app.
[中文说明](./README-zh.md)

## Prequisities

NodeJS >= 12.0

## Getting started

```sh
cd larp-clues-presentation
npm i

npm start
```

## Customize
First, put your scanned images to `/public/`

```jsx
  <div className='cluesection'>
    <ClueBoard above="./scanned-clue-back-side.png" below="scanned-clue-front-side.png" row={3} column={6} header={'clueboard'}/>
  </div>
```


## Countrbution 
Feel free to make any suggestions or PR!

## 项目 Pages 与私有化回退

线上访问：[项目站](https://troyeagle.github.io/larp-clues-presentation/)。公开仓库默认由自身 GitHub Actions 在 `main` 推送后直接部署。原博客 `/clue/` 目录留下迁移说明；未来转为私有源码时可通过停用的回退工作流恢复博客发布，详见 [发布规约](.github/STATIC_PUBLISH.md)。
