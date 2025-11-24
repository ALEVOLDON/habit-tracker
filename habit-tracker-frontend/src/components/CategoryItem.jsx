import { useState, useRef, useEffect } from 'react';
import { useAsync } from '../hooks/useAsync';
import { api } from '../services/api';

export const CategoryItem = ({ category, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const { execute: performUpdate, isLoading: isUpdating } = useAsync();
  const { execute: performDelete, isLoading: isDeleting } = useAsync();
  const inputRef = useRef(null);

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
    if (window.confirm(`Удалить категорию "${category.name}"? Привычки останутся без категории.`)) {
      try {
        await performDelete(() => api.deleteCategory(category._id));
        onDelete(category._id);
      } catch (err) {
        console.error('Failed to delete category', err);
        alert('Не удалось удалить категорию.');
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    else if (e.key === 'Escape') {
      setIsEditing(false);
      setName(category.name);
    }
  };

  return (
    <li className="category-item">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          disabled={isUpdating}
        />
      ) : (
        <span onClick={() => setIsEditing(true)} className="clickable">{category.name}</span>
      )}
      <div className="category-actions">
        <button onClick={handleDelete} disabled={isDeleting || isUpdating} className="danger">Удалить</button>
      </div>
    </li>
  );
};
