import './App.css';
import ClueBoard from './ClueBoard';

function App() {
  return (
    <div className="App">
      <div className='cluesection'>
        <ClueBoard above="./a1u.png" below="a1d.png" row={3} column={6}/>
        <ClueBoard above="./a2u.png" below="a2d.png" row={3} column={6}/>
        <ClueBoard above="./a3u.png" below="a3d.png" row={3} column={6}/>
        <ClueBoard above="./b1u.png" below="b1d.png" row={3} column={6}/>
        <ClueBoard above="./b2u.png" below="b2d.png" row={3} column={6}/>
        <ClueBoard above="./c2u.png" below="c2d.png" row={3} column={6}/>
        <ClueBoard above="./d1u.png" below="d1d.png" row={3} column={6}/>
        <ClueBoard above="./f1u.png" below="f1d.png" row={3} column={6}/>
      </div>
      
    </div>
  );
}

export default App;
