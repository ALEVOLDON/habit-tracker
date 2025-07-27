import React, { useState, useRef, useEffect } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { api } from '../../services/api';

interface Habit {
  _id: string;
  name: string;
  completedDates: string[];
  category?: {
    _id: string;
    name: string;
  };
}

interface HabitItemProps {
  habit: Habit;
  onDelete: (id: string) => void;
  onUpdate: (updatedHabit: Habit) => void;
  isDeleting: boolean;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, onDelete, onUpdate, isDeleting }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(habit.name);
  const { execute: performUpdate, isLoading: isUpdating } = useAsync<Habit>();
  const { execute: performCheck, isLoading: isChecking } = useAsync<Habit>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Проверяем, выполнена ли привычка сегодня
  const isCompletedToday = () => {
    if (!habit.completedDates) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Устанавливаем время на полночь для корректного сравнения
    return habit.completedDates.some(dateStr => {
      const completedDate = new Date(dateStr);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });
  };

  // Фокусируемся на инпуте при переходе в режим редактирования
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (name.trim() === habit.name || name.trim() === '') {
      setIsEditing(false);
      setName(habit.name); // Сбрасываем изменения, если имя не изменилось или стало пустым
      return;
    }

    try {
      const updatedHabit = await performUpdate(() => api.updateHabit(habit._id, { name }));
      onUpdate(updatedHabit);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update habit', err);
      setName(habit.name); // В случае ошибки возвращаем старое имя
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setName(habit.name);
    }
  };

  const handleCheck = async () => {
    try {
      const updatedHabit = await performCheck(() => api.checkHabit(habit._id));
      onUpdate(updatedHabit); // Обновляем состояние в родительском компоненте
    } catch (err) {
      console.error('Failed to check habit', err);
      alert('Не удалось отметить привычку. Попробуйте снова.');
    }
  };

  return (
    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', opacity: isChecking ? 0.5 : 1, transition: 'opacity 0.2s' }}>
      <input
        type="checkbox"
        checked={isCompletedToday()}
        onChange={handleCheck}
        disabled={isChecking || isDeleting || isUpdating}
        style={{ marginRight: '12px', cursor: 'pointer', transform: 'scale(1.5)' }}
      />
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          disabled={isUpdating || isChecking}
          style={{ flexGrow: 1, padding: '4px', border: '1px solid #9ca3af', borderRadius: '4px', marginRight: 'auto' }}
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          style={{
            cursor: 'pointer',
            flexGrow: 1,
            textDecoration: isCompletedToday() ? 'line-through' : 'none',
            color: isCompletedToday() ? '#6b7280' : 'inherit',
            transition: 'color 0.2s, text-decoration 0.2s',
          }}
        >
          {habit.name}
        </span>
      )}
      {habit.category && (
        <span style={{ fontSize: '0.8rem', color: '#6b7280', marginLeft: '8px', padding: '2px 8px', backgroundColor: '#e5e7eb', borderRadius: '12px', whiteSpace: 'nowrap' }}>
          {habit.category.name}
        </span>
      )}
      <button onClick={() => onDelete(habit._id)} disabled={isDeleting || isUpdating || isChecking} style={{ cursor: 'pointer', marginLeft: '16px' }}>Удалить</button>
    </li>
  );
};

export default HabitItem;