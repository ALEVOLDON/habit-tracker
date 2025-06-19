import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHabits, addHabit, checkHabit, updateHabit, deleteHabit } from '../api';

function Dashboard({ token, onLogout }) {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editFrequency, setEditFrequency] = useState('daily');
  const navigate = useNavigate();

  const loadHabits = async () => {
    try {
      const data = await getHabits(token);
      setHabits(data);
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
        navigate('/login');
      }
    }
  };

  const handleAdd = async () => {
    if (!title.trim()) {
      setError('Пожалуйста, введите название привычки');
      return;
    }
    if (habits.some(h => h.title.trim().toLowerCase() === title.trim().toLowerCase())) {
      setError('Такая привычка уже существует');
      return;
    }
    try {
      await addHabit(token, title, frequency);
      setTitle('');
      setError('');
      setSuccess('Привычка добавлена!');
      loadHabits();
    } catch (err) {
      console.error('Ошибка при добавлении привычки:', err);
      setError('Ошибка при добавлении привычки');
    }
  };

  const handleCheck = async (id) => {
    try {
      await checkHabit(token, id);
      loadHabits();
    } catch (err) {
      console.error('Ошибка при отметке привычки:', err);
      setError('Ошибка при отметке привычки');
    }
  };

  const startEdit = (habit) => {
    setEditId(habit._id);
    setEditTitle(habit.title);
    setEditFrequency(habit.frequency);
  };

  const handleEditSave = async (id) => {
    if (!editTitle.trim()) {
      setError('Пожалуйста, введите название привычки');
      return;
    }
    if (habits.some(h => h._id !== id && h.title.trim().toLowerCase() === editTitle.trim().toLowerCase())) {
      setError('Такая привычка уже существует');
      return;
    }
    try {
      await updateHabit(token, id, { title: editTitle, frequency: editFrequency });
      setEditId(null);
      setEditTitle('');
      setEditFrequency('daily');
      setError('');
      setSuccess('Привычка обновлена!');
      loadHabits();
    } catch (err) {
      setError('Ошибка при редактировании привычки');
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditTitle('');
    setEditFrequency('daily');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить привычку?')) return;
    try {
      await deleteHabit(token, id);
      setSuccess('Привычка удалена!');
      loadHabits();
    } catch (err) {
      setError('Ошибка при удалении привычки');
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      loadHabits();
    }
  }, [token, navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h2>Мои привычки</h2>
        <button className="logout-button" onClick={() => {
          onLogout();
          navigate('/login');
        }}>
          Выйти
        </button>
      </header>

      <div className="add-habit-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <div className="form-group">
          <label>Название:</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Новая привычка"
          />
        </div>
        <div className="form-group">
          <label>Частота:</label>
          <select value={frequency} onChange={e => setFrequency(e.target.value)}>
            <option value="daily">Каждый день</option>
            <option value="weekly">Каждую неделю</option>
          </select>
        </div>
        <button onClick={handleAdd}>Добавить</button>
      </div>

      <div className="habits-list">
        {habits.map(habit => (
          <div key={habit._id} className="habit-item">
            <div className="habit-header">
              {editId === habit._id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder="Название"
                  />
                  <select value={editFrequency} onChange={e => setEditFrequency(e.target.value)}>
                    <option value="daily">Каждый день</option>
                    <option value="weekly">Каждую неделю</option>
                  </select>
                  <button onClick={() => handleEditSave(habit._id)}>Сохранить</button>
                  <button onClick={handleEditCancel}>Отмена</button>
                </>
              ) : (
                <>
                  <h3>{habit.title}</h3>
                  <span className="habit-frequency">
                    {habit.frequency === 'daily' ? 'Каждый день' : 'Каждую неделю'}
                  </span>
                  <button onClick={() => startEdit(habit)}>Редактировать</button>
                  <button onClick={() => handleDelete(habit._id)}>Удалить</button>
                </>
              )}
            </div>
            <div className="habit-progress">
              <span>Прогресс: {habit.progress?.length || 0} отметок</span>
              <button 
                className="check-button"
                onClick={() => handleCheck(habit._id)}
              >
                ✓
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard; 