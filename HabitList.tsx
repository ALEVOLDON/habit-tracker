import React, { useEffect } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { HabitItem } from './HabitItem';
import HabitListSkeleton from './components/HabitListSkeleton';

export const HabitList = () => {
  const { habits, fetchHabits, isLoading, error } = useHabits();

  useEffect(() => {
    fetchHabits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Запускаем один раз при монтировании компонента

  // Показываем загрузку только при самом первом запросе
  if (isLoading && habits.length === 0) {
    return <HabitListSkeleton />;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Ошибка: {error}</div>;
  }

  if (!isLoading && habits.length === 0) {
    return <div>У вас пока нет привычек. Давайте добавим первую!</div>;
  }

  return (
    <div>
      {habits.map((habit) => (
        <HabitItem key={habit._id} habit={habit} />
      ))}
    </div>
  );
};