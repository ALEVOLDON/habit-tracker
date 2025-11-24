import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import { notificationService } from '../notificationService';

const HabitContext = createContext();

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const { execute, isLoading, error } = useAsync();

  const fetchHabits = useCallback(async () => {
    try {
      const fetchedHabits = await execute(api.getHabits);
      if (Array.isArray(fetchedHabits)) {
        setHabits(fetchedHabits);
      } else {
        setHabits([]);
      }
    } catch (err) {
      notificationService.error('Не удалось загрузить список привычек.');
    }
  }, [execute]);

  const addHabit = useCallback(async (habitData) => {
    try {
      const newHabit = await execute(() => api.createHabit(habitData));
      if (newHabit) {
        setHabits((prevHabits) => [...prevHabits, newHabit]);
        notificationService.success('Привычка успешно добавлена!');
        return newHabit;
      }
    } catch (err) {
      notificationService.error('Не удалось добавить привычку.');
    }
  }, [execute]);

  const deleteHabit = useCallback(async (habitId) => {
    try {
      await execute(() => api.deleteHabit(habitId));
      setHabits((prevHabits) => prevHabits.filter((habit) => habit._id !== habitId));
      notificationService.success('Привычка удалена.');
    } catch (err) {
      notificationService.error('Не удалось удалить привычку.');
    }
  }, [execute]);

  const updateHabit = useCallback(async (habitId, habitData) => {
    try {
      const updatedHabit = await execute(() => api.updateHabit(habitId, habitData));
      if (updatedHabit) {
        setHabits((prevHabits) =>
          prevHabits.map((habit) => (habit._id === habitId ? updatedHabit : habit))
        );
        notificationService.success('Привычка обновлена.');
      }
    } catch (err) {
      notificationService.error('Не удалось обновить привычку.');
    }
  }, [execute]);

  const checkHabit = useCallback(async (habitId) => {
    try {
      const updatedHabit = await execute(() => api.checkHabit(habitId));
      if (updatedHabit) {
        setHabits((prevHabits) =>
          prevHabits.map((habit) => (habit._id === habitId ? updatedHabit : habit))
        );
        notificationService.success('Готово! Так держать!');
      }
    } catch (err) {
      notificationService.error('Не удалось отметить привычку.');
    }
  }, [execute]);

  const value = {
    habits,
    fetchHabits,
    addHabit,
    deleteHabit,
    updateHabit,
    checkHabit,
    isLoading,
    error,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};
