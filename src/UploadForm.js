import { useState, useRef, useEffect } from 'react';
import { compressImage } from './utils/imageUtils';
import { saveTask, getTaskById } from './utils/storage';
import './UploadForm.css';

function UploadForm({ taskId, onNavigate }) {
  const isEdit = !!taskId;

  const [name, setName] = useState('');
  const [abovePreview, setAbovePreview] = useState(null);
  const [belowPreview, setBelowPreview] = useState(null);
  const [row, setRow] = useState(3);
  const [column, setColumn] = useState(6);
  const [compressing, setCompressing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  const aboveInputRef = useRef(null);
  const belowInputRef = useRef(null);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    getTaskById(taskId).then((existing) => {
      if (existing) {
        setName(existing.name || '');
        setAbovePreview(existing.aboveImage || null);
        setBelowPreview(existing.belowImage || null);
        setRow(existing.row || 3);
        setColumn(existing.column || 6);
      }
      setLoading(false);
    });
  }, [isEdit, taskId]);

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setCompressing(true);
    try {
      const dataUrl = await compressImage(file);
      if (type === 'above') {
        setAbovePreview(dataUrl);
      } else {
        setBelowPreview(dataUrl);
      }
    } catch {
      alert('图片处理失败，请重试');
    } finally {
      setCompressing(false);
    }
  };

  const canSave = abovePreview && belowPreview && row >= 1 && column >= 1 && !saving;

  const doSave = async () => {
    if (!canSave) return null;
    setSaving(true);
    try {
      const task = {
        id: taskId || Date.now().toString(),
        name: name.trim() || '未命名线索板',
        aboveImage: abovePreview,
        belowImage: belowPreview,
        row: Number(row),
        column: Number(column),
      };
      const saved = await saveTask(task);
      return saved.id;
    } catch (e) {
      console.error('Save failed:', e);
      alert('保存失败，请重试');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    const id = await doSave();
    if (id) onNavigate('present', id);
  };

  const handleSaveToList = async () => {
    const id = await doSave();
    if (id) onNavigate('list');
  };

  if (loading) {
    return (
      <div className="upload-page">
        <div className="upload-header">
          <button className="btn btn-back" onClick={() => onNavigate('list')}>&larr; 返回列表</button>
          <h2>加载中...</h2>
          <div style={{ width: 80 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="upload-page">
      <div className="upload-header">
        <button className="btn btn-back" onClick={() => onNavigate('list')}>
          &larr; 返回列表
        </button>
        <h2>{isEdit ? '编辑线索板' : '新建线索板'}</h2>
        <div style={{ width: 80 }} />
      </div>

      <div className="upload-body">
        <div className="upload-section">
          <label className="field-label">线索板名称</label>
          <input
            className="field-input"
            type="text"
            placeholder="输入名称（可选）"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="upload-images">
          <div className="upload-card">
            <label className="field-label">背面图（初始显示）</label>
            <div
              className="upload-dropzone"
              onClick={() => aboveInputRef.current?.click()}
            >
              {abovePreview ? (
                <img src={abovePreview} alt="above preview" className="upload-preview" />
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">+</span>
                  <span>点击上传背面图</span>
                </div>
              )}
            </div>
            <input
              ref={aboveInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e, 'above')}
            />
            {abovePreview && (
              <button className="btn btn-sm btn-replace" onClick={() => aboveInputRef.current?.click()}>
                重新上传
              </button>
            )}
          </div>

          <div className="upload-card">
            <label className="field-label">正面图（点击揭示）</label>
            <div
              className="upload-dropzone"
              onClick={() => belowInputRef.current?.click()}
            >
              {belowPreview ? (
                <img src={belowPreview} alt="below preview" className="upload-preview" />
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">+</span>
                  <span>点击上传正面图</span>
                </div>
              )}
            </div>
            <input
              ref={belowInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e, 'below')}
            />
            {belowPreview && (
              <button className="btn btn-sm btn-replace" onClick={() => belowInputRef.current?.click()}>
                重新上传
              </button>
            )}
          </div>
        </div>

        {compressing && <div className="compressing-hint">正在处理图片...</div>}
        {saving && <div className="compressing-hint">正在保存...</div>}

        <div className="upload-grid-config">
          <label className="field-label">网格配置</label>
          <div className="grid-inputs">
            <div className="grid-field">
              <span>行数 (Row)</span>
              <input
                type="number"
                min="1"
                max="20"
                value={row}
                onChange={(e) => setRow(Math.max(1, Math.min(20, Number(e.target.value))))}
              />
            </div>
            <span className="grid-x">×</span>
            <div className="grid-field">
              <span>列数 (Column)</span>
              <input
                type="number"
                min="1"
                max="20"
                value={column}
                onChange={(e) => setColumn(Math.max(1, Math.min(20, Number(e.target.value))))}
              />
            </div>
          </div>
          <p className="grid-hint">
            图片将被切割为 {row} × {column} = {row * column} 个小块，点击时逐块揭示
          </p>
        </div>

        <div className="upload-actions">
          <button
            className="btn btn-primary btn-lg"
            disabled={!canSave}
            onClick={handleSave}
          >
            保存并进入展示
          </button>
          <button
            className="btn btn-secondary btn-lg"
            disabled={!canSave}
            onClick={handleSaveToList}
          >
            保存并返回列表
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadForm;
