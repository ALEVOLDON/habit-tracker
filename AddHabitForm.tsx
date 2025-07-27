import React, { useState } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { api, Category } from '../../services/api';

interface AddHabitFormProps {
  onHabitAdded: () => void; // Callback для обновления списка привычек
  categories: Category[] | null;
  isLoadingCategories: boolean;
}

const AddHabitForm: React.FC<AddHabitFormProps> = ({ onHabitAdded, categories, isLoadingCategories }) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const { execute: addHabit, isLoading, error } = useAsync<void>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isLoading || isLoadingCategories) {
      return;
    }

    try {
      // Передаем ID категории, если он выбран
      await addHabit(() => api.createHabit({ name, categoryId: categoryId || undefined }));
      setName(''); // Очищаем поле ввода после успеха
      setCategoryId(''); // Сбрасываем категорию
      onHabitAdded(); // Сообщаем родительскому компоненту, что нужно обновить список
    } catch (err) {
      // Ошибка уже обработана в хуке, но мы можем залогировать ее для отладки
      console.error('Failed to add habit:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0, marginBottom: '12px' }}>Добавить новую привычку</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Например, читать 15 минут в день"
        disabled={isLoading || isLoadingCategories}
        style={{ marginRight: '10px', padding: '8px', width: '250px', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        disabled={isLoading || isLoadingCategories}
        style={{ marginRight: '10px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
      >
        <option value="">{isLoadingCategories ? 'Загрузка...' : 'Без категории'}</option>
        {categories?.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>
      <button type="submit" disabled={isLoading || isLoadingCategories} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        {isLoading ? 'Добавление...' : 'Добавить'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '8px' }}>Ошибка: {error}</p>}
    </form>
  );
};

export default AddHabitForm;