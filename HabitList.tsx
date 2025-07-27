import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { api, Category } from '../../services/api';
import HabitListSkeleton from './HabitListSkeleton';
import AddHabitForm from '../AddHabitForm/AddHabitForm';
import HabitItem from './HabitItem';
import CategoryFilter from '../CategoryFilter/CategoryFilter';
import CategoryManager from '../CategoryManager/CategoryManager';

// Определим тип для привычки для большей надежности
interface Habit {
  _id: string;
  name: string;
  completedDates: string[];
  category?: {
    _id: string;
    name: string;
  };
}

const HabitList = () => {
  // Получаем setData для локального обновления UI
  const { execute: fetchHabits, data: habits, error, isLoading, setData: setHabits } = useAsync<Habit[]>();
  // Отдельный инстанс хука для операции удаления, чтобы состояния загрузки не пересекались
  const { execute: performDelete, isLoading: isDeleting } = useAsync<void>();
  // Состояние для фильтрации по категориям
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // Состояние для отображения менеджера категорий
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // --- ЕДИНЫЙ ИСТОЧНИК ДАННЫХ ДЛЯ КАТЕГОРИЙ ---
  const { execute: fetchCategories, data: categories, isLoading: isLoadingCategories } = useAsync<Category[]>();

  // Оборачиваем в useCallback, чтобы функция не создавалась заново при каждом рендере
  const handleFetchHabits = useCallback(() => {
    fetchHabits(api.getHabits);
  }, [fetchHabits]);

  const handleFetchCategories = useCallback(() => {
    fetchCategories(api.getCategories);
  }, [fetchCategories]);

  useEffect(() => {
    // Запускаем загрузку данных при монтировании компонента
    handleFetchHabits();
    handleFetchCategories();
  }, [handleFetchHabits, handleFetchCategories]);

  const handleDelete = async (habitId: string) => {
    // Запрашиваем подтверждение у пользователя
    if (window.confirm('Вы уверены, что хотите удалить эту привычку?')) {
      try {
        await performDelete(() => api.deleteHabit(habitId));
        // Обновляем состояние локально для мгновенного отклика UI
        setHabits((currentHabits) =>
          currentHabits ? currentHabits.filter((h) => h._id !== habitId) : null
        );
      } catch (err) {
        console.error('Failed to delete habit:', err);
        // После неудачного удаления категории, привычка могла остаться без нее. Перезапросим данные.
        handleFetchHabits();
        alert('Не удалось удалить привычку. Попробуйте снова.');
      }
    }
  };

  const handleUpdate = (updatedHabit: Habit) => {
    setHabits((currentHabits) => {
      if (!currentHabits) return null;
      return currentHabits.map((h) =>
        h._id === updatedHabit._id ? updatedHabit : h
      );
    });
  };

  // Фильтруем привычки на основе выбранной категории
  const filteredHabits = useMemo(() => {
    if (!habits) {
      return [];
    }
    if (selectedCategory === null) {
      return habits;
    }
    return habits.filter((habit) => habit.category?._id === selectedCategory);
  }, [habits, selectedCategory]);

  // Показываем скелетон только при самой первой загрузке, когда данных еще нет
  if ((isLoading && !habits) || (isLoadingCategories && !categories)) {
    return <HabitListSkeleton hasCategories={false} />;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Ошибка: {error}</div>;
  }

  return (
    <div>
      <AddHabitForm onHabitAdded={handleFetchHabits} categories={categories} isLoadingCategories={isLoadingCategories} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={categories}
          isLoading={isLoadingCategories}
        />
        <button onClick={() => setShowCategoryManager(!showCategoryManager)} style={{ height: 'fit-content' }}>
          {showCategoryManager ? 'Скрыть' : 'Категории'}
        </button>
      </div>

      {showCategoryManager && <CategoryManager categories={categories || []} onCategoryChange={handleFetchCategories} />}
      <h2>Ваши привычки</h2>
      {/* Используем отфильтрованный список для отображения */}
      {filteredHabits.length > 0 ? (
        <ul>
          {filteredHabits.map((habit) => (
            <HabitItem
              key={habit._id}
              habit={habit}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              isDeleting={isDeleting}
            />
          ))}
        </ul>
      ) : (
        <p>
          {habits && habits.length > 0
            ? 'Нет привычек в этой категории.'
            : 'У вас пока нет привычек. Давайте создадим первую!'}
        </p>
      )}
    </div>
  );
};

export default HabitList;