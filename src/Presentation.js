import { useState, useEffect } from 'react';
import { getTaskById } from './utils/storage';
import { fetchBuiltInClues } from './utils/clueService';
import ClueBoard from './ClueBoard';
import './Presentation.css';

function Presentation({ taskId, onNavigate }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (taskId && taskId.startsWith('builtin_')) {
        const builtIn = await fetchBuiltInClues();
        setTask(builtIn.find(c => c.id === taskId) || null);
      } else if (taskId) {
        setTask(await getTaskById(taskId));
      }
      setLoading(false);
    }
    load();
  }, [taskId]);

  if (loading) {
    return (
      <div className="presentation-error">
        <h2>加载中...</h2>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="presentation-error">
        <h2>线索板不存在</h2>
        <button className="btn btn-primary" onClick={() => onNavigate('list')}>
          返回列表
        </button>
      </div>
    );
  }

  const isBuiltin = task.source === 'builtin';

  return (
    <div className="presentation-page">
      <div className="presentation-header">
        <button className="btn btn-back" onClick={() => onNavigate('list')}>
          &larr; 返回列表
        </button>
        <h2>{task.name}</h2>
        {isBuiltin ? (
          <span className="task-badge task-badge-builtin" style={{ position: 'static' }}>内置</span>
        ) : (
          <button className="btn btn-secondary" onClick={() => onNavigate('edit', task.id)}>
            编辑
          </button>
        )}
      </div>
      <div className="presentation-body">
        <ClueBoard
          above={task.aboveImage}
          below={task.belowImage}
          row={task.row}
          column={task.column}
          header={task.name}
        />
      </div>
    </div>
  );
}

export default Presentation;
