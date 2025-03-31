import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHabits, addHabit, checkHabit } from '../api';

function Dashboard({ token, onLogout }) {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [error, setError] = useState('');
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
      setError('Введите название привычки');
      return;
    }
    try {
      await addHabit(token, title, frequency);
      setTitle('');
      setError('');
      loadHabits();
    } catch (err) {
      setError('Ошибка при добавлении привычки');
    }
  };

  const handleCheck = async (id) => {
    try {
      await checkHabit(token, id);
      loadHabits();
    } catch (err) {
      setError('Ошибка при отметке привычки');
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      loadHabits();
    }
  }, [token, navigate]);

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
            <option value="daily">Ежедневно</option>
            <option value="weekly">Еженедельно</option>
          </select>
        </div>
        <button onClick={handleAdd}>Добавить</button>
      </div>

      <div className="habits-list">
        {habits.map(habit => (
          <div key={habit._id} className="habit-item">
            <div className="habit-header">
              <h3>{habit.title}</h3>
              <span className="habit-frequency">
                {habit.frequency === 'daily' ? 'Ежедневно' : 'Еженедельно'}
              </span>
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