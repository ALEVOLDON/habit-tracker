import React, { useState, useRef, useEffect } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { api, Category } from '../../services/api';

interface CategoryItemProps {
  category: Category;
  onUpdate: (updatedCategory: Category) => void;
  onDelete: (id: string) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const { execute: performUpdate, isLoading: isUpdating } = useAsync<Category>();
  const { execute: performDelete, isLoading: isDeleting } = useAsync<void>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (name.trim() === category.name || name.trim() === '') {
      setIsEditing(false);
      setName(category.name);
      return;
    }
    try {
      const updatedCategory = await performUpdate(() => api.updateCategory(category._id, { name }));
      onUpdate(updatedCategory);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update category', err);
      setName(category.name);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Вы уверены, что хотите удалить категорию "${category.name}"? Все связанные привычки останутся без категории.`)) {
      try {
        await performDelete(() => api.deleteCategory(category._id));
        onDelete(category._id);
      } catch (err) {
        console.error('Failed to delete category', err);
        alert('Не удалось удалить категорию.');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    else if (e.key === 'Escape') {
      setIsEditing(false);
      setName(category.name);
    }
  };

  return (
    <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid #eee' }}>
      {isEditing ? (
        <input ref={inputRef} type="text" value={name} onChange={(e) => setName(e.target.value)} onBlur={handleSave} onKeyDown={handleKeyDown} disabled={isUpdating} style={{ flexGrow: 1 }} />
      ) : (
        <span onClick={() => setIsEditing(true)} style={{ cursor: 'pointer', flexGrow: 1 }}>{category.name}</span>
      )}
      <button onClick={handleDelete} disabled={isDeleting || isUpdating} style={{ marginLeft: '8px' }}>Удалить</button>
    </li>
  );
};

export default CategoryItem;