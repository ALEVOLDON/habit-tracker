import { useState } from 'react';
import { useAsync } from '../hooks/useAsync';
import { api } from '../services/api';

export const AddHabitForm = ({ onHabitAdded, categories, isLoadingCategories }) => {
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [categoryId, setCategoryId] = useState('');
  const { execute: addHabit, isLoading, error } = useAsync();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isLoading || isLoadingCategories) return;

    try {
      await addHabit(() => api.createHabit({ title, frequency, categoryId: categoryId || null }));
      setTitle('');
      setFrequency('daily');
      setCategoryId('');
      onHabitAdded();
    } catch (err) {
      console.error('Failed to add habit:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="card-title">Добавить привычку</h3>
      <div className="form-row">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Например, пить 15 стаканов воды"
          disabled={isLoading || isLoadingCategories}
        />
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          disabled={isLoading || isLoadingCategories}
        >
          <option value="daily">Ежедневно</option>
          <option value="weekly">Еженедельно</option>
        </select>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          disabled={isLoading || isLoadingCategories}
        >
          <option value="">{isLoadingCategories ? 'Загрузка...' : 'Без категории'}</option>
          {categories?.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit" disabled={isLoading || isLoadingCategories}>
          {isLoading ? 'Добавляем...' : 'Добавить'}
        </button>
      </div>
      {error && <p className="error">Ошибка: {error}</p>}
    </form>
  );
};
