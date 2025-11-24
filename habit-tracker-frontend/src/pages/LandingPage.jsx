import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const features = [
  'Трек привычек с категориями и частотой',
  'Отметка выполнения и статистика',
  'Простой интерфейс с быстрым редактированием',
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const primaryCta = isAuthenticated ? { to: '/app', label: 'Перейти в приложение' } : { to: '/login', label: 'Начать' };
  const secondaryCta = isAuthenticated ? { to: '/login', label: 'Сменить аккаунт' } : { to: '/register', label: 'Создать аккаунт' };

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="brand">Habit Tracker</div>
        <div className="cta-row">
          <Link className="btn ghost" to="/">Главная</Link>
          <Link className="btn" to="/app">Приложение</Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-text">
          <p className="label">Личный контроль привычек</p>
          <h1>Отмечайте, анализируйте и держите ритм каждый день</h1>
          <p className="muted">Создавайте привычки, отмечайте выполнение, управляйте категориями и следите за прогрессом в одном месте.</p>
          <div className="cta-row">
            <Link className="btn" to={primaryCta.to}>{primaryCta.label}</Link>
            <Link className="btn ghost" to={secondaryCta.to}>{secondaryCta.label}</Link>
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