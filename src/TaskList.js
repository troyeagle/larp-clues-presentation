import { useState, useEffect, useCallback } from 'react';
import { getTasks, deleteTask } from './utils/storage';
import { fetchBuiltInClues } from './utils/clueService';
import './TaskList.css';

function TaskList({ onNavigate }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const [builtin, user] = await Promise.all([
        fetchBuiltInClues(),
        getTasks(),
      ]);
      const userTasks = user.map(t => ({ ...t, source: 'user' }));
      setTasks([...builtin, ...userTasks]);
    } catch (e) {
      console.error('Failed to load tasks:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这个线索板吗？')) {
      await deleteTask(id);
      loadTasks();
    }
  };

  const handlePresent = (id, e) => {
    e.stopPropagation();
    onNavigate('present', id);
  };

  const handleEdit = (id, source, e) => {
    if (e) e.stopPropagation();
    if (source === 'builtin') {
      onNavigate('present', id);
    } else {
      onNavigate('edit', id);
    }
  };

  if (loading) {
    return (
      <div className="tasklist-page">
        <div className="tasklist-header">
          <h1>LARP 线索展示工具</h1>
        </div>
        <div className="tasklist-loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="tasklist-page">
      <div className="tasklist-header">
        <h1>LARP 线索展示工具</h1>
        <button className="btn btn-primary" onClick={() => onNavigate('upload')}>
          + 新建线索板
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="tasklist-empty">
          <div className="empty-icon">📋</div>
          <h3>还没有线索板</h3>
          <p>点击上方按钮创建你的第一个线索板</p>
        </div>
      ) : (
        <div className="tasklist-grid">
          {tasks.map((task) => {
            const isBuiltin = task.source === 'builtin';
            return (
              <div
                key={task.id}
                className="task-card"
                onClick={() => handleEdit(task.id, task.source)}
              >
                <div className="task-card-preview">
                  <img src={task.aboveImage} alt="above" className="task-thumb" />
                  <div className="task-card-overlay">
                    <span>{task.row} × {task.column}</span>
                  </div>
                  {isBuiltin && <span className="task-badge task-badge-builtin">内置</span>}
                  {!isBuiltin && <span className="task-badge task-badge-user">自定义</span>}
                </div>
                <div className="task-card-info">
                  <h3 className="task-card-name">{task.name}</h3>
                  {!isBuiltin && (
                    <span className="task-card-date">
                      {new Date(task.updatedAt || task.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                  )}
                </div>
                <div className="task-card-actions">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={(e) => handlePresent(task.id, e)}
                  >
                    展示
                  </button>
                  {!isBuiltin && (
                    <>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={(e) => handleEdit(task.id, task.source, e)}
                      >
                        编辑
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => handleDelete(task.id, e)}
                      >
                        删除
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TaskList;
