import { useState, useEffect, useRef } from 'react';

import './ClueBoard.css';

function ClueBoard({above, below, row, column, header}) {

  const [imgs, setImgs] = useState([]);
  const imgRef = useRef(null);

  const arr = new Array(row);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(column).fill('hidden');
  }

  const [visibles, setVisibles] = useState(arr);

  const setBelowHidden = (i, j) => {
    setVisibles(prevVisibles => {
      const next = prevVisibles.map(row => [...row]);
      next[i][j] = 'hidden';
      return next;
    })
  }

  const setBelowRevealed = (e) => {
    const img = imgRef.current;
    if (!img) return;
    const columnIdx = Math.min(Math.floor(e.nativeEvent.offsetX * column / img.width), column - 1);
    const rowIdx = Math.min(Math.floor(e.nativeEvent.offsetY * row / img.height), row - 1);

    setVisibles(prevVisibles => {
      const next = prevVisibles.map(row => [...row]);
      next[rowIdx][columnIdx] = 'visible';
      return next;
    })
  }

  const toPerc = (k) => {
    return Math.round(k * 100) + '%';
  }

  useEffect(() => {
    const bel = [];
    for(let i = 0; i < row; i++) {
      for (let j = 0;j < column; j++) {
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
        <div>{header}</div>
      </div>
      <div className="clues">
        <img ref={imgRef} className="aboveImg" alt='above' src={above} onClick={setBelowRevealed}></img>
        {imgs}
      </div>
    </div>
  );
}

export default ClueBoard;
