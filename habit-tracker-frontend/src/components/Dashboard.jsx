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
      setError('Please enter a habit name');
      return;
    }
    try {
      await addHabit(token, title, frequency);
      setTitle('');
      setError('');
      loadHabits();
    } catch (err) {
      console.error('Error adding habit:', err);
      setError('Error adding habit');
    }
  };

  const handleCheck = async (id) => {
    try {
      await checkHabit(token, id);
      loadHabits();
    } catch (err) {
      console.error('Error checking habit:', err);
      setError('Error checking habit');
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
        <h2>My Habits</h2>
        <button className="logout-button" onClick={() => {
          onLogout();
          navigate('/login');
        }}>
          Logout
        </button>
      </header>

      <div className="add-habit-form">
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label>Name:</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="New habit"
          />
        </div>
        <div className="form-group">
          <label>Frequency:</label>
          <select value={frequency} onChange={e => setFrequency(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <button onClick={handleAdd}>Add</button>
      </div>

      <div className="habits-list">
        {habits.map(habit => (
          <div key={habit._id} className="habit-item">
            <div className="habit-header">
              <h3>{habit.title}</h3>
              <span className="habit-frequency">
                {habit.frequency === 'daily' ? 'Daily' : 'Weekly'}
              </span>
            </div>
            <div className="habit-progress">
              <span>Progress: {habit.progress?.length || 0} checks</span>
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