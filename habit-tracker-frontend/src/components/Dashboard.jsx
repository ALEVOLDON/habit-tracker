import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHabits, addHabit, checkHabit, updateHabit, deleteHabit, getCategories, createCategory, updateCategory, deleteCategory } from '../api';

function Dashboard({ token, onLogout }) {
  // --- Состояния для привычек, фильтров и категорий ---
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editId, setEditId] = useState(null); // id редактируемой привычки
  const [editTitle, setEditTitle] = useState('');
  const [editFrequency, setEditFrequency] = useState('daily');
  const [filterFrequency, setFilterFrequency] = useState('all');
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  // --- Состояния для создания/редактирования категорий ---
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#4CAF50');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryColor, setEditCategoryColor] = useState('#4CAF50');
  const navigate = useNavigate();

  // --- Загрузка привычек пользователя ---
  const loadHabits = useCallback(async () => {
    try {
      const data = await getHabits(token);
      setHabits(data);
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
        navigate('/login');
      }
    }
  }, [token, onLogout, navigate]);

  // --- Загрузка категорий пользователя ---
  const loadCategories = useCallback(async () => {
    try {
      const data = await getCategories(token);
      setCategories(data);
    } catch {
      setCategories([]);
    }
  }, [token]);

  // --- Добавить новую привычку ---
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
    } catch {
      setError('Ошибка при добавлении привычки');
    }
  };

  // --- Отметить привычку как выполненную ---
  const handleCheck = async (id) => {
    try {
      await checkHabit(token, id);
      loadHabits();
    } catch (err) {
      console.error('Ошибка при отметке привычки:', err);
      setError('Ошибка при отметке привычки');
    }
  };

  // --- Начать редактирование привычки ---
  const startEdit = (habit) => {
    setEditId(habit._id);
    setEditTitle(habit.title);
    setEditFrequency(habit.frequency);
  };

  // --- Сохранить изменения привычки ---
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
    } catch {
      setError('Ошибка при редактировании привычки');
    }
  };

  // --- Отмена редактирования привычки ---
  const handleEditCancel = () => {
    setEditId(null);
    setEditTitle('');
    setEditFrequency('daily');
  };

  // --- Удалить привычку ---
  const handleDelete = async (id) => {
    if (!window.confirm('Удалить привычку?')) return;
    try {
      await deleteHabit(token, id);
      setSuccess('Привычка удалена!');
      loadHabits();
    } catch {
      setError('Ошибка при удалении привычки');
    }
  };

  // --- Создать новую категорию ---
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setError('Введите название категории');
      return;
    }
    try {
      await createCategory(token, newCategoryName, newCategoryColor);
      setNewCategoryName('');
      setNewCategoryColor('#4CAF50');
      setSuccess('Категория создана!');
      loadCategories();
    } catch {
      setError('Ошибка при создании категории');
    }
  };

  // --- Начать редактирование категории ---
  const startEditCategory = (cat) => {
    setEditCategoryId(cat._id);
    setEditCategoryName(cat.name);
    setEditCategoryColor(cat.color || '#4CAF50');
  };

  // --- Сохранить изменения категории ---
  const handleEditCategorySave = async (id) => {
    if (!editCategoryName.trim()) {
      setError('Введите название категории');
      return;
    }
    try {
      await updateCategory(token, id, { name: editCategoryName, color: editCategoryColor });
      setEditCategoryId(null);
      setEditCategoryName('');
      setEditCategoryColor('#4CAF50');
      setSuccess('Категория обновлена!');
      loadCategories();
    } catch {
      setError('Ошибка при редактировании категории');
    }
  };

  // --- Отмена редактирования категории ---
  const handleEditCategoryCancel = () => {
    setEditCategoryId(null);
    setEditCategoryName('');
    setEditCategoryColor('#4CAF50');
  };

  // --- Удалить категорию ---
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Удалить категорию?')) return;
    try {
      await deleteCategory(token, id);
      setSuccess('Категория удалена!');
      loadCategories();
    } catch {
      setError('Ошибка при удалении категории');
    }
  };

  // --- Эффект: загрузка привычек и категорий при входе ---
  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      loadHabits();
      loadCategories();
    }
  }, [token, navigate, loadHabits, loadCategories]);

  // --- Эффект: автоочистка сообщений об ошибке/успехе ---
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

  // --- Фильтрация привычек по частоте и категории ---
  const filteredHabits = habits.filter(habit =>
    (filterFrequency === 'all' ? true : habit.frequency === filterFrequency) &&
    (filterCategory === 'all' ? true : (habit.categoryId && habit.categoryId._id === filterCategory))
  );

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

      <div className="form-group" style={{ maxWidth: 300, margin: '0 auto 1rem auto' }}>
        <label>Показать:</label>
        <select value={filterFrequency} onChange={e => setFilterFrequency(e.target.value)}>
          <option value="all">Все привычки</option>
          <option value="daily">Только ежедневные</option>
          <option value="weekly">Только еженедельные</option>
        </select>
      </div>

      {categories.length > 0 && (
        <div className="form-group" style={{ maxWidth: 300, margin: '0 auto 1rem auto' }}>
          <label>Категория:</label>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="all">Все категории</option>
            <option value="null">Без категории</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="habits-list">
        {filteredHabits.map(habit => (
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

      <div className="add-habit-form" style={{ marginTop: 24 }}>
        <h3>Создать категорию</h3>
        <div className="form-group">
          <label>Название:</label>
          <input
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            placeholder="Новая категория"
          />
        </div>
        <div className="form-group">
          <label>Цвет:</label>
          <input
            type="color"
            value={newCategoryColor}
            onChange={e => setNewCategoryColor(e.target.value)}
            style={{ width: 40, height: 32, border: 'none', background: 'none' }}
          />
        </div>
        <button onClick={handleCreateCategory}>Добавить категорию</button>
      </div>

      {categories.length > 0 && (
        <div className="add-habit-form" style={{ marginTop: 16 }}>
          <h3>Категории</h3>
          {categories.map(cat => (
            <div key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              {editCategoryId === cat._id ? (
                <>
                  <input
                    value={editCategoryName}
                    onChange={e => setEditCategoryName(e.target.value)}
                    placeholder="Название"
                  />
                  <input
                    type="color"
                    value={editCategoryColor}
                    onChange={e => setEditCategoryColor(e.target.value)}
                    style={{ width: 32, height: 28, border: 'none', background: 'none' }}
                  />
                  <button onClick={() => handleEditCategorySave(cat._id)}>Сохранить</button>
                  <button onClick={handleEditCategoryCancel}>Отмена</button>
                </>
              ) : (
                <>
                  <span style={{ background: cat.color, width: 18, height: 18, display: 'inline-block', borderRadius: 4, marginRight: 6 }}></span>
                  <span>{cat.name}</span>
                  <button onClick={() => startEditCategory(cat)}>Редактировать</button>
                  <button onClick={() => handleDeleteCategory(cat._id)}>Удалить</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard; 