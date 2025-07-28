import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { api, NewHabitData, UpdateHabitData, Habit } from '../api';
import { useAsync } from '../useAsync';
import { notificationService } from '../notificationService';

interface HabitContextType {
  habits: Habit[];
  fetchHabits: () => Promise<void>;
  addHabit: (habitData: NewHabitData) => Promise<Habit | undefined>;
  deleteHabit: (habitId: string) => Promise<void>;
  updateHabit: (habitId: string, habitData: UpdateHabitData) => Promise<void>;
  checkHabit: (habitId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits должен использоваться внутри HabitProvider');
  }
  return context;
};

interface HabitProviderProps {
  children: ReactNode;
}

export const HabitProvider = ({ children }: HabitProviderProps) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  // Используем useAsync для управления состоянием асинхронных операций
  const { execute, isLoading, error } = useAsync<any>();

  const fetchHabits = useCallback(async () => {
    try {
      const fetchedHabits = await execute(api.getHabits);
      if (fetchedHabits) {
        setHabits(fetchedHabits);
      }
    } catch (err) {
      // Ошибки уже обрабатываются в useAsync, но можно добавить уведомление
      notificationService.error('Не удалось загрузить привычки.');
    }
  }, [execute]);

  const addHabit = useCallback(async (habitData: NewHabitData) => {
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

  const deleteHabit = useCallback(async (habitId: string) => {
    try {
      await execute(() => api.deleteHabit(habitId));
      setHabits((prevHabits) => prevHabits.filter((habit) => habit._id !== habitId));
      notificationService.success('Привычка удалена.');
    } catch (err) {
      notificationService.error('Не удалось удалить привычку.');
    }
  }, [execute]);

  const updateHabit = useCallback(async (habitId: string, habitData: UpdateHabitData) => {
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

  const checkHabit = useCallback(async (habitId: string) => {
    try {
      const updatedHabit = await execute(() => api.checkHabit(habitId));
      if (updatedHabit) {
         setHabits((prevHabits) =>
          prevHabits.map((habit) => (habit._id === habitId ? updatedHabit : habit))
        );
        notificationService.success('Отлично! Так держать!');
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