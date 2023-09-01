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