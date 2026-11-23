import { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Notification from './components/Notification';
import { useApolloClient } from '@apollo/client/react';

const App = () => {
  const [page, setPage] = useState('authors');
  const [notification, setNotification] = useState('');
  const [token, setToken] = useState(localStorage.getItem('library-user-token'));

  const client = useApolloClient();

  const onLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (!token) {
    return (
      <div>
        <Notification notification={notification} setNotification={setNotification} />
        <h2>Login</h2>
        <LoginForm setToken={setToken} setNotification={setNotification} />
      </div>
    );
  }

  return (
    <div>
      <nav>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </nav>

      <Notification notification={notification} setNotification={setNotification} />
      <button onClick={onLogout}>Logout</button>

      <Authors show={page === 'authors'} setNotification={setNotification} />

      <Books show={page === 'books'} setNotification={setNotification} />

      <NewBook show={page === 'add'} setNotification={setNotification} />
    </div>
  );
};

export default App;
