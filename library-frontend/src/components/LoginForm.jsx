import { useMutation } from '@apollo/client/react';
import { useState } from 'react';
import { LOGIN } from '../queries';

const LoginForm = ({ setNotification, setToken, show, setPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value;
      setToken(token);
      localStorage.setItem('library-user-token', token);
      setPage('authors');
    },
    onError: (error) => setNotification(`Login failed: ${error.message}`),
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    login({
      variables: {
        username,
        password,
      },
    });
  };

  if (!show) return null;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          username
          <input value={username} onChange={({ target }) => setUsername(target.value)} />
        </label>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
