import HabitListSkeleton from './HabitListSkeleton';
import { HabitItem } from './HabitItem';

export const HabitList = ({ habits, isLoading, error }) => {
  if (isLoading && habits.length === 0) {
    return <HabitListSkeleton />;
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>;
  }

  if (!isLoading && habits.length === 0) {
    return <div className="muted">У вас пока нет привычек. Добавьте первую!</div>;
  }

  return (
    <div className="habit-list">
      {habits.map((habit) => (
        <HabitItem key={habit._id} habit={habit} />
      ))}
    </div>
  );
};
