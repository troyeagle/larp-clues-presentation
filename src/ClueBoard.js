import { useState, useEffect } from 'react';

import './ClueBoard.css';

function ClueBoard({above, below, row, column}) {

  const [imgs, setImgs] = useState([]);

  const arr = new Array(row);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(column).fill('hidden');
  }

  const [visibles, setVisibles] = useState(arr);

  const setBelowHidden = (i, j) => {
    setVisibles(prevVisibles => {
      prevVisibles[i][j] = 'hidden';
      // 新建一个数组，否则 react hooks 不响应
      return [...prevVisibles];
    })
  }

  const setBelowRevealed = (e) => {
    const img = document.getElementsByClassName('aboveImg')[0];
    // min：避免数字过大点出界
    const columnIdx = Math.min(Math.floor(e.nativeEvent.offsetX * column / img.width), column - 1);

    const rowIdx = Math.min(Math.floor(e.nativeEvent.offsetY * row / img.height), row-1);

    console.log('the img is located at ', columnIdx, rowIdx);
    setVisibles(prevVisibles => {
      prevVisibles[rowIdx][columnIdx] = 'visible';
      return [...prevVisibles];
    })
  }

  // inset 只接受百分号语法。。
  const toPerc = (k) => {
    return Math.round(k * 100) + '%';
  }

  useEffect(() => {
    const bel = [];
    for(let i = 0; i < row; i++) {
      for (let j = 0;j < column; j++) {
        // 让图片的一小部分矩形显现
        const clip = `inset(${toPerc(i/row)} ${toPerc((column - 1 - j)/column)} ${toPerc((row - 1 - i)/row)} ${toPerc(j/column)})`;
        bel.push(<img
          src={below}
          className='belowImg'
          style={{
            visibility: visibles[i][j],
            clipPath: clip,
          }} alt='below'
          onClick={() => setBelowHidden(i, j)}
          key={`mg${i}${j}`}/>)
      }
    }

    setImgs(bel);
  }, [row, column, below, visibles])

  return (
    <div className="clues-wrapper">
      <div className="clue-header">
        <div>《白衣倾城》线索板</div>
      </div>
      <div className="clues">
        <img className="aboveImg" alt='above' src={above} onClick={setBelowRevealed}></img>
        {imgs}
      </div>
    </div>
  );
}

export default ClueBoard;
