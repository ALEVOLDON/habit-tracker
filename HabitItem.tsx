import React from 'react';
import { Habit } from '../api';
import { useHabits } from '../contexts/HabitContext';

interface HabitItemProps {
  habit: Habit;
}

export const HabitItem = ({ habit }: HabitItemProps) => {
  const { deleteHabit, checkHabit, isLoading } = useHabits();

  const handleDelete = () => {
    if (window.confirm(`Вы уверены, что хотите удалить привычку "${habit.name}"?`)) {
      deleteHabit(habit._id);
    }
  };

  const handleCheck = () => {
    checkHabit(habit._id);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', border: '1px solid #ccc', margin: '5px 0', borderRadius: '4px' }}>
      <span>{habit.name}</span>
      <div>
        <button onClick={handleCheck} disabled={isLoading} title="Отметить выполнение">✔️</button>
        <button onClick={handleDelete} disabled={isLoading} style={{ marginLeft: '10px' }} title="Удалить привычку">❌</button>
      </div>
    </div>
  );
};