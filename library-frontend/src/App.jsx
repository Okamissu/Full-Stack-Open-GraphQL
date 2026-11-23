import { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
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

  return (
    <div>
      <nav>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={onLogout}>logout</button>}
        {!token && <button onClick={() => setPage('login')}>login</button>}
      </nav>
      <Notification notification={notification} setNotification={setNotification} />

      {!token && (
        <LoginForm
          show={page === 'login'}
          setToken={setToken}
          setNotification={setNotification}
          setPage={setPage}
        />
      )}

      <Authors
        show={page === 'authors'}
        setNotification={setNotification}
        token={token}
      />
      <Books show={page === 'books'} setNotification={setNotification} />

      {token && <NewBook show={page === 'add'} setNotification={setNotification} />}
    </div>
  );
};

export default App;
