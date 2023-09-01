# 线索展示工具

线索卡展示工具，只需要把正面 / 背面对应地扫描下来，传入组件，就能实现点击按需展示。

[English](./README.md)

## 要求
Node.js >= 12.0

## 快速开始
```sh
cd larp-clues-presentation

npm start
```
## 自定义
扫描的时候，尽量摆正，紧靠，铺平，贴边，保证产出的是一个被等分好的一面线索。程序是按照输入的行数 / 列数自动裁切的。

把扫描的图像放入 `/public/` 文件夹中。

```jsx
  <div className='cluesection'>
    <ClueBoard above="./scanned-clue-back-side.png" below="scanned-clue-front-side.png" row={3} column={6} header={'clueboard'}/>
  </div>
```