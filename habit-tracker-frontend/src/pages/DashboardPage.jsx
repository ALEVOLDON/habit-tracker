import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';
import { api } from '../services/api';
import { AddHabitForm } from '../components/AddHabitForm';
import { HabitList } from '../components/HabitList';
import { CategoryFilter } from '../components/CategoryFilter';
import { CategoryManager } from '../components/CategoryManager';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { habits, fetchHabits, isLoading, error } = useHabits();
  const { logout } = useAuth();
  const [categories, setCategories] = React.useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState(null);

  const loadCategories = React.useCallback(async () => {
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

  React.useEffect(() => {
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
          <Link to="/" className="btn ghost" style={{ marginTop: '8px', display: 'inline-block' }}>На главную</Link>
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
