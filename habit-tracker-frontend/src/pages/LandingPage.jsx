import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const features = [
  'Трек привычек с категориями и частотой',
  'Отметка выполнения и статистика',
  'Простой интерфейс с быстрым редактированием',
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="brand">Habit Tracker</div>
        <div className="cta-row">
          <Link className="btn ghost" to="/login">Войти</Link>
          <Link className="btn" to="/register">Регистрация</Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-text">
          <p className="label">Личный контроль привычек</p>
          <h1>Отмечайте, анализируйте и держите ритм каждый день</h1>
          <p className="muted">Создавайте привычки, отмечайте выполнение, управляйте категориями и следите за прогрессом в одном месте.</p>
          <div className="cta-row">
            <Link className="btn" to="/login">Начать</Link>
            <Link className="btn ghost" to="/register">Создать аккаунт</Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-screenshot">
            <div className="skeleton-title" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
            <div className="skeleton-line" />
            <div className="skeleton-pill" />
            <div className="skeleton-pill" />
            <div className="skeleton-button" />
          </div>
        </div>
      </section>

      <section className="features">
        {features.map((item) => (
          <div className="feature-card" key={item}>
            <div className="feature-dot" />
            <p>{item}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default LandingPage;
