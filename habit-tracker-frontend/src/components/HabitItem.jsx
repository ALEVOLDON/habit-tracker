import { useHabits } from '../context/HabitContext';

export const HabitItem = ({ habit }) => {
  const { deleteHabit, checkHabit, isLoading } = useHabits();

  const handleDelete = () => {
    if (window.confirm(`Вы уверены, что хотите удалить привычку "${habit.title}"?`)) {
      deleteHabit(habit._id);
    }
  };

  return (
    <div className="habit-item">
      <div>
        <div className="habit-title">{habit.title}</div>
        <div className="habit-meta">
          {habit.frequency === 'weekly' ? 'Еженедельно' : 'Ежедневно'}
          {habit.categoryId && habit.categoryId.name ? ` · ${habit.categoryId.name}` : ''}
        </div>
      </div>
      <div className="habit-actions">
        <button onClick={() => checkHabit(habit._id)} disabled={isLoading} title="Отметить выполнение">✓</button>
        <button onClick={handleDelete} disabled={isLoading} className="danger" title="Удалить">✕</button>
      </div>
    </div>
  );
};
