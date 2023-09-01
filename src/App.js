import './App.css';
import ClueBoard from './ClueBoard';

function App() {

  const header = '《白衣倾城》线索板'
  return (
    <div className="App">
      <div className='cluesection'>
        <ClueBoard above="./a1u.png" below="a1d.png" row={3} column={6} header={header}/>
        <ClueBoard above="./a2u.png" below="a2d.png" row={3} column={6} header={header}/>
        <ClueBoard above="./a3u.png" below="a3d.png" row={3} column={6} header={header}/>
        <ClueBoard above="./b1u.png" below="b1d.png" row={3} column={6} header={header}/>
        <ClueBoard above="./b2u.png" below="b2d.png" row={3} column={6} header={header}/>
        <ClueBoard above="./c2u.png" below="c2d.png" row={3} column={6} header={header}/>
        <ClueBoard above="./d1u.png" below="d1d.png" row={3} column={6} header={header}/>
        <ClueBoard above="./f1u.png" below="f1d.png" row={3} column={6} header={header}/>
      </div>
      
    </div>
  );
}

export default App;
