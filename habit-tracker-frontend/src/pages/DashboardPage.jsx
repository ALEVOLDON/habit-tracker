import { useEffect, useState, useCallback } from 'react';
import { useHabits } from '../context/HabitContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AddHabitForm } from '../components/AddHabitForm';
import { HabitList } from '../components/HabitList';
import { CategoryFilter } from '../components/CategoryFilter';
import { CategoryManager } from '../components/CategoryManager';

const DashboardPage = () => {
  const { habits, fetchHabits, isLoading, error } = useHabits();
  const { logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const loadCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
    loadCategories();
  }, [fetchHabits, loadCategories]);

  const filteredHabits = habits.filter((habit) => {
    if (selectedCategory === null) return true;
    if (selectedCategory === 'null') return !habit.categoryId;
    const habitCategoryId = typeof habit.categoryId === 'string' ? habit.categoryId : habit.categoryId?._id;
    return habitCategoryId === selectedCategory;
  });

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Трекер привычек</h1>
          <p className="muted">Добавляйте привычки, отмечайте выполнение и управляйте категориями.</p>
        </div>
        <button onClick={logout} className="secondary">Выйти</button>
      </header>

      <AddHabitForm onHabitAdded={() => { fetchHabits(); }} categories={categories} isLoadingCategories={isLoadingCategories} />

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
        isLoading={isLoadingCategories}
      />

      <HabitList habits={filteredHabits} isLoading={isLoading} error={error} />

      <CategoryManager categories={categories} onCategoryChange={() => loadCategories()} />
    </div>
  );
};

export default DashboardPage;
