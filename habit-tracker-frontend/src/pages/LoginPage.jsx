import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../hooks/useAsync';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { execute, error, isLoading } = useAsync();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await execute(() => login({ email, password }));
      navigate('/');
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <div className="auth-card">
      <h2>Вход</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Пароль</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={isLoading}>{isLoading ? 'Входим...' : 'Войти'}</button>
      </form>
      <p className="muted">Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link></p>
    </div>
  );
};

export default LoginPage;
