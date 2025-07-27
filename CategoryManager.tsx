import React, { useState } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { api, Category } from '../../services/api';
import CategoryItem from './CategoryItem';

interface CategoryManagerProps {
  categories: Category[];
  onCategoryChange: () => void; // Callback для обновления списка категорий
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onCategoryChange }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const { execute: createCategory, isLoading, error } = useAsync<Category>();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || isLoading) return;

    try {
      await createCategory(() => api.createCategory({ name: newCategoryName }));
      setNewCategoryName('');
      onCategoryChange();
    } catch (err) {
      console.error('Failed to create category', err);
    }
  };

  const handleUpdate = (updatedCategory: Category) => {
    // Просто триггерим обновление, т.к. состояние управляется родителем
    onCategoryChange();
  };

  const handleDelete = (id: string) => {
    // Просто триггерим обновление
    onCategoryChange();
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', marginTop: '24px', backgroundColor: '#f9fafb' }}>
      <h4>Управление категориями</h4>
      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Новая категория"
          style={{ flexGrow: 1, padding: '8px' }}
        />
        <button type="submit" disabled={isLoading}>{isLoading ? '...' : 'Создать'}</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {categories.map((cat) => (
          <CategoryItem key={cat._id} category={cat} onUpdate={handleUpdate} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;