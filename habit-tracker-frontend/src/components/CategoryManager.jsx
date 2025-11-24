import { useState } from 'react';
import { useAsync } from '../hooks/useAsync';
import { api } from '../services/api';
import { CategoryItem } from './CategoryItem';

export const CategoryManager = ({ categories, onCategoryChange }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const { execute: createCategory, isLoading, error } = useAsync();

  const handleCreate = async (e) => {
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

  const handleUpdate = () => {
    onCategoryChange();
  };

  const handleDelete = () => {
    onCategoryChange();
  };

  return (
    <div className="card">
      <h4 className="card-title">Категории</h4>
      <form onSubmit={handleCreate} className="form-row">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Название категории"
        />
        <button type="submit" disabled={isLoading}>{isLoading ? '...' : 'Создать'}</button>
      </form>
      {error && <p className="error">{error}</p>}
      <ul className="category-list">
        {categories.map((cat) => (
          <CategoryItem key={cat._id} category={cat} onUpdate={handleUpdate} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
};
