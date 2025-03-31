import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api';

function Auth({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const token = isRegistering 
        ? await register(email, password)
        : await login(email, password);
      
      if (!token) {
        throw new Error(isRegistering ? 'Registration error' : 'Invalid email or password');
      }
      
      onLogin(token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication error');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{isRegistering ? 'Registration' : 'Login'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleAuth}>
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="auth-button">
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
        <button 
          className="toggle-auth-button"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError('');
          }}
        >
          {isRegistering ? 'Already have an account?' : 'Create account'}
        </button>
      </div>
    </div>
  );
}

export default Auth; 