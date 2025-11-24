import { useState, useEffect } from 'react';
import { useHabits } from '../context/HabitContext';

export const HabitItem = ({ habit }) => {
  const { deleteHabit, checkHabit, updateHabit, isLoading } = useHabits();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(habit.title);
  const [frequency, setFrequency] = useState(habit.frequency);

  useEffect(() => {
    setTitle(habit.title);
    setFrequency(habit.frequency);
  }, [habit.title, habit.frequency]);

  const handleDelete = () => {
    if (window.confirm(Вы уверены, что хотите удалить привычку ""?)) {
      deleteHabit(habit._id);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setTitle(habit.title);
      setIsEditing(false);
      return;
    }
    await updateHabit(habit._id, { title, frequency });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(habit.title);
    setFrequency(habit.frequency);
    setIsEditing(false);
  };

  return (
    <div className="habit-item">
      <div>
        {isEditing ? (
          <>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              className="input-inline"
            />
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              disabled={isLoading}
              className="select-inline"
            >
              <option value="daily">Ежедневно</option>
              <option value="weekly">Еженедельно</option>
            </select>
          </>
        ) : (
          <>
            <div className="habit-title">{habit.title}</div>
            <div className="habit-meta">
              {habit.frequency === 'weekly' ? 'Еженедельно' : 'Ежедневно'}
              {habit.categoryId && habit.categoryId.name ?  ·  : ''}
            </div>
          </>
        )}
      </div>
      <div className="habit-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave} disabled={isLoading} title="Сохранить изменения">✓</button>
            <button onClick={handleCancel} disabled={isLoading} className="secondary" title="Отменить">✕</button>
          </>
        ) : (
          <>
            <button onClick={() => checkHabit(habit._id)} disabled={isLoading} title="Отметить выполнение">✓</button>
            <button onClick={() => setIsEditing(true)} disabled={isLoading} title="Редактировать">✎</button>
            <button onClick={handleDelete} disabled={isLoading} className="danger" title="Удалить">✕</button>
          </>
        )}
      </div>
    </div>
  );
};
