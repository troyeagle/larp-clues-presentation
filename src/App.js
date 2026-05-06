import { useState } from 'react';
import './App.css';
import TaskList from './TaskList';
import UploadForm from './UploadForm';
import Presentation from './Presentation';

function App() {
  const [page, setPage] = useState('list');
  const [taskId, setTaskId] = useState(null);

  const navigate = (target, id) => {
    setTaskId(id || null);
    setPage(target);
  };

  return (
    <div className="App">
      {page === 'list' && <TaskList onNavigate={navigate} />}
      {page === 'upload' && <UploadForm onNavigate={navigate} />}
      {page === 'edit' && <UploadForm taskId={taskId} onNavigate={navigate} />}
      {page === 'present' && <Presentation taskId={taskId} onNavigate={navigate} />}
    </div>
  );
}

export default App;
