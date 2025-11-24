import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { api } from '../services/api';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { execute, error, isLoading } = useAsync();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await execute(() => api.register({ email, password }));
      navigate('/login');
    } catch (err) {
      console.error('Registration failed', err);
    }
  };

  return (
    <div className="auth-card">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Пароль</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={isLoading}>{isLoading ? 'Регистрируем...' : 'Зарегистрироваться'}</button>
      </form>
      <p className="muted">Уже есть аккаунт? <Link to="/login">Войти</Link></p>
    </div>
  );
};

export default RegisterPage;
