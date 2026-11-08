import { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Notification from './components/Notification';

const App = () => {
  const [page, setPage] = useState('authors');
  const [notification, setNotification] = useState('');

  return (
    <div>
      <nav>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </nav>

      <Notification notification={notification} setNotification={setNotification} />

      <Authors show={page === 'authors'} setNotification={setNotification} />

      <Books show={page === 'books'} setNotification={setNotification} />

      <NewBook show={page === 'add'} setNotification={setNotification} />
    </div>
  );
};

export default App;
